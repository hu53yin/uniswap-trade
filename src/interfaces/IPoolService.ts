import { Token } from '@uniswap/sdk-core';
import { IPoolInfo } from './IPoolInfo';
import { Pool } from '@uniswap/v3-sdk';
import BigNumber from 'bignumber.js';

export interface IPoolService {
    createPool(token0: Token, token1: Token, fee: number): Promise<{ pool: Pool, address: string }>;
    getPoolInfo(poolAddress: string): Promise<IPoolInfo>;
    initializePool(poolAddress: string, sqrtPriceX96: BigNumber): Promise<void>;
}
