import { Token } from '@uniswap/sdk-core';
import { Pool } from '@uniswap/v3-sdk';
import { Contract } from 'ethers';
import { IPoolService } from '../interfaces/IPoolService';
import { IPoolInfo } from '../interfaces/IPoolInfo';
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { abi as IUniswapV3FactoryABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json';
import { UNISWAP_V3_FACTORY_ADDRESS, provider, wallet } from '../config';
import BigNumber from 'bignumber.js';

export class PoolService implements IPoolService {
    private factoryContract: Contract;

    constructor() {
        this.factoryContract = new Contract(UNISWAP_V3_FACTORY_ADDRESS, IUniswapV3FactoryABI, wallet);
    }

    async createPool(token0: Token, token1: Token, fee: number): Promise<{ pool: Pool, address: string }> {
        const tx = await this.factoryContract.createPool(token0.address, token1.address, fee);
        
        const receipt = await tx.wait();
        
        const poolAddress = receipt.events[0].args.pool;

        const poolInfo = await this.getPoolInfo(poolAddress);

        const pool = new Pool(
            token0,
            token1,
            fee,
            poolInfo.sqrtPriceX96.toString(),
            poolInfo.liquidity.toString(),
            poolInfo.tick
        );

        return { pool, address: poolAddress };
    }

    async getPoolInfo(poolAddress: string): Promise<IPoolInfo> {
        const poolContract = new Contract(poolAddress, IUniswapV3PoolABI, provider);
        
        const [liquidity, slot0] = await Promise.all([
            poolContract.liquidity(),
            poolContract.slot0()
        ]);

        return {
            liquidity,
            sqrtPriceX96: slot0.sqrtPriceX96,
            tick: slot0.tick
        };
    }

    async initializePool(poolAddress: string, sqrtPriceX96: BigNumber): Promise<void> {
        const poolContract = new Contract(poolAddress, IUniswapV3PoolABI, wallet);
        const tx = await poolContract.initialize(sqrtPriceX96);
        
        await tx.wait();
    }
}
