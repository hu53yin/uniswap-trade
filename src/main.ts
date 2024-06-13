import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core';
import { Route, Trade } from '@uniswap/v3-sdk';
import { SWAP_ROUTER_ADDRESS, USDC_ADDRESS, WETH_ADDRESS, wallet } from './config';
import { PoolService } from './services/pool.service';
import { SwapService } from './services/swap.service';
import { ethers } from 'ethers';
import { PriceService } from './services/price.service';
import logger from './logger';

const FEE = 3000;

const main = async () => {
  try {
    logger.info('Starting Uniswap trade process');

    const tokenIn = new Token(80001, WETH_ADDRESS, 18, 'WETH', 'WETH Token');
    const tokenOut = new Token(80001, USDC_ADDRESS, 6, 'USDC', 'USD Coin');
    const amountIn = 0.0001;  // Amount in WETH

    const poolService = new PoolService();
    const swapService = new SwapService();
    const priceService = new PriceService();

    logger.info('Creating pool');
    const { pool, address: poolAddress } = await poolService.createPool(tokenIn, tokenOut, FEE);
    logger.info(`Pool created at address: ${poolAddress}`);

    logger.info('Calculating initial price');
    const initialPrice = await priceService.calculateInitialPrice(tokenIn, tokenOut);
    logger.info(`Calculated initial price: ${initialPrice.toString()}`);

    logger.info('Initializing pool');
    await poolService.initializePool(poolAddress, initialPrice);
    logger.info('Pool initialized successfully');

    const route = new Route([pool], tokenIn, tokenOut);

    logger.info('Getting quote for amount in');
    const amountInCurrency = CurrencyAmount.fromRawAmount(tokenIn, ethers.parseUnits(amountIn.toString(), tokenIn.decimals).toString());
    const amountOut = await swapService.getQuote(route, amountInCurrency);
    logger.info(`Quote received: ${amountOut.toString()}`);

    logger.info('Creating trade');
    const trade = Trade.createUncheckedTrade({
      route: route,
      inputAmount: amountInCurrency,
      outputAmount: CurrencyAmount.fromRawAmount(tokenOut, amountOut.toString()),
      tradeType: TradeType.EXACT_INPUT,
    });

    const approvalAmount = ethers.parseUnits(amountIn.toString(), tokenIn.decimals).toString();
    const tokenContract = new ethers.Contract(WETH_ADDRESS, ['function approve(address spender, uint256 amount) external returns (bool)'], wallet);

    logger.info('Approving token transfer');
    await tokenContract.approve(SWAP_ROUTER_ADDRESS, approvalAmount);
    logger.info('Token transfer approved');

    const options = {
      slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
      recipient: wallet.address,
    };

    logger.info('Executing trade');
    const txHash = await swapService.executeTrade(trade, options);
    logger.info(`Trade executed successfully, transaction hash: ${txHash}`);
  } catch (error) {
    logger.error('An error occurred during the Uniswap trade process', { error });
    process.exit(1);
  }
};

main();