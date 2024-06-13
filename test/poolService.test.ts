import { PoolService } from '../src/services/pool.service';
import { Token } from '@uniswap/sdk-core';
import { Pool } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import sinon from 'sinon';
import { USDC_ADDRESS, WETH_ADDRESS } from '../src/config';
import BigNumber from 'bignumber.js';

describe('PoolService', () => {
  let poolService: PoolService;
  let createPoolStub: sinon.SinonStub;
  let getPoolInfoStub: sinon.SinonStub;

  beforeEach(() => {
    poolService = new PoolService();
    createPoolStub = sinon.stub(poolService, 'createPool');
    getPoolInfoStub = sinon.stub(poolService, 'getPoolInfo');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a new pool', async () => {
    const token0 = new Token(80001, WETH_ADDRESS, 18, 'WETH', 'Wrapped ETH');
    const token1 = new Token(80001, USDC_ADDRESS, 6, 'USDC', 'USD Coin');
    const fee = 3000;

    const poolAddress = '0x...POOL_ADDRESS';

    const poolInfo = {
      liquidity: ethers.toBigInt('1000'),
      sqrtPriceX96: ethers.toBigInt('79228162514264337593543950336'),
      tick: 0
    };

    createPoolStub.returns(Promise.resolve({ pool: new Pool(token0, token1, fee, poolInfo.sqrtPriceX96.toString(), poolInfo.liquidity.toString(), poolInfo.tick), address: poolAddress }));

    getPoolInfoStub.withArgs(poolAddress).returns(Promise.resolve(poolInfo));

    const { pool, address } = await poolService.createPool(token0, token1, fee);
    
    expect(address).toBe(poolAddress);
    expect(pool.liquidity.toString()).toBe(poolInfo.liquidity.toString());
    expect(pool.sqrtRatioX96.toString()).toBe(poolInfo.sqrtPriceX96.toString());
    expect(pool.tickCurrent).toBe(poolInfo.tick);
  });

  it('should initialize a pool', async () => {
    const poolAddress = '0x...POOL_ADDRESS';
    const sqrtPriceX96 = BigNumber('79228162514264337593543950336');

    const initializePoolStub = sinon.stub(poolService, 'initializePool').returns(Promise.resolve());
    
    await poolService.initializePool(poolAddress, sqrtPriceX96);
    
    expect(initializePoolStub.calledOnceWith(poolAddress, sqrtPriceX96)).toBe(true);
  });
});