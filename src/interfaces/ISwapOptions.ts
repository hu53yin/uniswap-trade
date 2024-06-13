import { Percent } from '@uniswap/sdk-core';

export interface ISwapOptions {
    slippageTolerance: Percent;
    deadline: number;
    recipient: string;
}
