var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "super oak possible super proof copy assume destroy device panda spin chimney";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      //from: 0xf1bc156395c41231efb7ddda14766acc34fabcae,
      network_id: 4,
      gas: 2000000 // Gas limit used for deploys
    }
  }
};


//curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc": "2.0", "id": 1, "method": "eth_blockNumber", "params": []}' "https://mainnet.infura.io/ygSC9EPQzpdB13FybRGG"

// rinkeby: {
//       host: "localhost", // Connect to geth on the specified
//       port: 8545,
//       from: "0xf1bc156395c41231efb7ddda14766acc34fabcae", // default address to use for any transaction Truffle makes during migrations
//       network_id: 4,
//       gas: 500000 // Gas limit used for deploys
//     }


// rinkeby: {
//       provider: function() {
//         return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/ygSC9EPQzpdB13FybRGG");
//       },
//       network_id: 4
//     } 