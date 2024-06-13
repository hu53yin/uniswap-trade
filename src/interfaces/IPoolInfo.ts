import { BigNumberish } from 'ethers';

export interface IPoolInfo {
    liquidity: BigNumberish;
    sqrtPriceX96: BigNumberish;
    tick: number;
}
