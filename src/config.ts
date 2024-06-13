import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// https://docs.base.org/docs/base-contracts

// https://docs.uniswap.org/contracts/v3/reference/deployments/polygon-deployments
export const UNISWAP_V3_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'; 

// https://mumbai.polygonscan.com/token/0xe6b8a5cf854791412c1f6efc7caf629f5df1c747
export const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

// https://mumbai.polygonscan.com/token/0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747
export const USDC_ADDRESS = '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747';

// https://mumbai.polygonscan.com/token/0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa
export const WETH_ADDRESS = '0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa';

export const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';

// https://docs.chain.link/data-feeds/price-feeds/addresses?network=polygon&page=1
export const CHAINLINK_WETH_USD_FEED = '0xF0d50568e3A7e8259E16663972b11910F89BD8e7';
export const CHAINLINK_USDC_USD_FEED = '0x1b8739bB4CdF0089d07097A9Ae5Bd274b29C6F16';

export const RPC_URL = process.env.RPC_URL || '';
export const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || '';

export const provider = new ethers.JsonRpcProvider(RPC_URL);

export const providerAmoy = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL || '');
export const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

