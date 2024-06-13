import { Token, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { Route, Trade } from '@uniswap/v3-sdk';
import { BigNumberish } from 'ethers';
import { ISwapOptions } from './ISwapOptions';

export interface ISwapService {
    getQuote(route: Route<Token, Token>, amountIn: CurrencyAmount<Token>): Promise<BigNumberish>;
    executeTrade(trade: Trade<Token, Token, TradeType>, options: ISwapOptions): Promise<string>;
}
