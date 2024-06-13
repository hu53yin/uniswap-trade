import { PriceService } from '../src/services/price.service';
import { CHAINLINK_WETH_USD_FEED, CHAINLINK_USDC_USD_FEED } from '../src/config';
import { Token } from '@uniswap/sdk-core';
import sinon from 'sinon';
import BigNumber from 'bignumber.js';

describe('PriceService', () => {
  let priceService: PriceService;
  let getChainlinkPriceStub: sinon.SinonStub;

  beforeEach(() => {
    priceService = new PriceService();
    getChainlinkPriceStub = sinon.stub(priceService as any, 'getChainlinkPrice');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return the correct price for WETH', async () => {
    getChainlinkPriceStub.withArgs(CHAINLINK_WETH_USD_FEED).returns(Promise.resolve(2));
    const price = await priceService.getPrice(CHAINLINK_WETH_USD_FEED);

    expect(price).toBe(2);
  });

  it('should return the correct price for USDC', async () => {
    getChainlinkPriceStub.withArgs(CHAINLINK_USDC_USD_FEED).returns(Promise.resolve(1));
    const price = await priceService.getPrice(CHAINLINK_USDC_USD_FEED);

    expect(price).toBe(1);
  });

  it('should calculate the correct initial price', async () => {
    const token0 = new Token(80001, CHAINLINK_WETH_USD_FEED, 18, 'WETH', 'Wrapped ETH');
    const token1 = new Token(80001, CHAINLINK_USDC_USD_FEED, 6, 'USDC', 'USD Coin');

    getChainlinkPriceStub.withArgs(CHAINLINK_WETH_USD_FEED).returns(Promise.resolve(2));
    getChainlinkPriceStub.withArgs(CHAINLINK_USDC_USD_FEED).returns(Promise.resolve(1));

    const initialPrice = await priceService.calculateInitialPrice(token0, token1);
    const priceRatio = BigNumber(2 * 10 ** 18).div(BigNumber(1 * 10 ** 18));
    const sqrtPriceX96 = priceRatio.sqrt().multipliedBy(BigNumber(2).pow(96));

    expect(initialPrice).toEqual(sqrtPriceX96);
  });
});