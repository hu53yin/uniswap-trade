# Uniswap Trade on Polygon Mumbai

This project demonstrates how to interact with Uniswap V3 on the Polygon Mumbai testnet, including creating a pool, calculating initial prices, and executing trades. The project is written in TypeScript and uses ethers.js for blockchain interactions and winston for logging.


## Installation

To set up the project, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/hu53yin/uniswap-trade.git
cd uniswap-trade
npm install
```

## Configuration

Create a .env file in the root directory of the project and add your configuration variables:

```bash
RPC_URL=https://mumbai.rpc.thirdweb.com
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
WALLET_PRIVATE_KEY=YOUR_WALLET_PRIVAYE_KEY
```

Replace your-private-key, chainlink-wmatic-usd-feed-address, chainlink-usdc-usd-feed-address, and uniswap-v3-swap-router-address with your actual values.

# Scripts

## Build and Clean

- Build the project: Compiles TypeScript files to JavaScript.

```bash
npm run build
```

- Clean the build: Removes the dist directory.

```bash
npm run clean
```

## Development

- Start development mode: Uses nodemon to watch files and restart on changes.

```bash
npm run dev
```

## Production

- Start the project: Runs the compiled JavaScript files.

```bash
npm start
```

## Debugging

- Debug the project: Runs the project in debug mode.

```bash
npm run debug
```

## Testing

- Run tests: Executes all tests using Jest.

```bash
npm test
```

## Logging

- The project uses winston for logging. Logs are output to the console with timestamps and error stacks.

## Error Handling

- Error handling is implemented throughout the project. If an error occurs, it is logged, and the process exits with an error code.
