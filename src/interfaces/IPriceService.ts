import { Token } from "@uniswap/sdk-core";
import BigNumber from "bignumber.js";
import { BigNumberish } from "ethers";

export interface IPriceService {
    getPrice(tokenAddress: string): Promise<number>;
    calculateInitialPrice(token0: Token, token1: Token): Promise<BigNumber>;
}