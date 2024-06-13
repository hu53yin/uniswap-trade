import { SwapService } from '../src/services/swap.service';
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core';
import { Pool, Route, Trade } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import sinon from 'sinon';
import { USDC_ADDRESS, WETH_ADDRESS } from '../src/config';

describe('SwapService', () => {
  let swapService: SwapService;

  beforeEach(() => {
    swapService = new SwapService();
    sinon.restore();
  });

  it('should get a quote', async () => {
    const tokenIn = new Token(80001, WETH_ADDRESS, 18, 'WETH', 'Wrapped ETH');
    const tokenOut = new Token(80001, USDC_ADDRESS, 6, 'USDC', 'USD Coin');

    const pool = new Pool(
      tokenIn,
      tokenOut,
      3000,
      ethers.toBigInt('79228162514264337593543950336').toString(),
      ethers.toBigInt('1000').toString(),
      0
    );

    const route = new Route([pool], tokenIn, tokenOut);
    const amountInCurrency = CurrencyAmount.fromRawAmount(tokenIn, ethers.toBigInt('1000000000000000000').toString());

    const quoteStub = sinon.stub(swapService, 'getQuote').returns(Promise.resolve(ethers.toBigInt('2000000')));
    const amountOut = await swapService.getQuote(route, amountInCurrency);
    
    expect(quoteStub.calledOnce).toBe(true);
    expect(amountOut.toString()).toBe('2000000');
  });

  it('should execute a trade', async () => {
    const tokenIn = new Token(80001, WETH_ADDRESS, 18, 'WETH', 'Wrapped ETH');
    const tokenOut = new Token(80001, USDC_ADDRESS, 6, 'USDC', 'USD Coin');

    const pool = new Pool(
      tokenIn,
      tokenOut,
      3000,
      ethers.toBigInt('79228162514264337593543950336').toString(),
      ethers.toBigInt('1000').toString(),
      0
    );

    const route = new Route([pool], tokenIn, tokenOut);
    const amountInCurrency = CurrencyAmount.fromRawAmount(tokenIn, ethers.toBigInt('1000000000000000000').toString());
    const amountOutCurrency = CurrencyAmount.fromRawAmount(tokenOut, ethers.toBigInt('2000000').toString());

    const trade = Trade.createUncheckedTrade({
      route: route,
      inputAmount: amountInCurrency,
      outputAmount: amountOutCurrency,
      tradeType: TradeType.EXACT_INPUT,
    });

    const options = {
      slippageTolerance: new Percent(50, 10000), // 0.5%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes
      recipient: '0x...WALLET_ADDRESS',
    };

    const executeTradeStub = sinon.stub(swapService, 'executeTrade').returns(Promise.resolve('0x...TX_HASH'));
    const txHash = await swapService.executeTrade(trade, options);
    expect(executeTradeStub.calledOnce).toBe(true);
    expect(txHash).toBe('0x...TX_HASH');
  });
});