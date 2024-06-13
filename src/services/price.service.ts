import { ethers } from 'ethers';
import { providerAmoy, CHAINLINK_WETH_USD_FEED, CHAINLINK_USDC_USD_FEED } from '../config';
import { Token } from '@uniswap/sdk-core';
import { IPriceService } from '../interfaces/IPriceService';
import * as aggregatorV3InterfaceABI from '@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json';
import BigNumber from 'bignumber.js';

export class PriceService implements IPriceService {
    private async getChainlinkPrice(feedAddress: string): Promise<number> {
        const priceFeed = new ethers.Contract(feedAddress, aggregatorV3InterfaceABI, providerAmoy);
        const decimals = await priceFeed.decimals();
        const latestRoundData = await priceFeed.latestRoundData();
        const price = latestRoundData.answer.toNumber() / (10 ** decimals);
        
        return price;
    }

    public async getPrice(tokenAddress: string): Promise<number> {
        if (tokenAddress === CHAINLINK_WETH_USD_FEED) {
            return this.getChainlinkPrice(CHAINLINK_WETH_USD_FEED);
        } else if (tokenAddress === CHAINLINK_USDC_USD_FEED) {
            return this.getChainlinkPrice(CHAINLINK_USDC_USD_FEED);
        }

        throw new Error('Unsupported token address');
    }

    public async calculateInitialPrice(token0: Token, token1: Token): Promise<BigNumber> {
        const price0 = await this.getPrice(token0.address);
        const price1 = await this.getPrice(token1.address);

        const priceRatio = BigNumber(price0 * 10 ** 18).div(BigNumber(price1 * 10 ** 18));
        const sqrtPriceX96 = priceRatio.sqrt().multipliedBy(BigNumber(2).pow(96));
        
        return sqrtPriceX96;
    }
}
