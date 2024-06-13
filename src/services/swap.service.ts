import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core';
import { Route, Trade, SwapQuoter, SwapRouter } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { wallet, provider, QUOTER_CONTRACT_ADDRESS, SWAP_ROUTER_ADDRESS } from '../config';
import { ISwapService } from '../interfaces/ISwapService';
import { ISwapOptions } from '../interfaces/ISwapOptions';

export class SwapService implements ISwapService {
    async getQuote(route: Route<Token, Token>, amountIn: CurrencyAmount<Token>): Promise<ethers.BigNumberish> {
        const { calldata } = await SwapQuoter.quoteCallParameters(
            route,
            amountIn,
            TradeType.EXACT_INPUT,
            {
                useQuoterV2: true,
            }
        );

        const quoteCallReturnData = await provider.call({
            to: QUOTER_CONTRACT_ADDRESS,
            data: calldata,
        });

        return ethers.AbiCoder.defaultAbiCoder().decode(['uint256'], quoteCallReturnData)[0];
    }

    async executeTrade(trade: Trade<Token, Token, TradeType>, options: ISwapOptions): Promise<string> {
        const methodParameters = SwapRouter.swapCallParameters([trade], options);

        const tx = {
            data: methodParameters.calldata,
            to: SWAP_ROUTER_ADDRESS,
            value: methodParameters.value,
            from: wallet.address,
            maxFeePerGas: ethers.parseUnits('100', 'gwei'),
            maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
        };

        const transaction = await wallet.sendTransaction(tx);
        
        return transaction.hash;
    }
}