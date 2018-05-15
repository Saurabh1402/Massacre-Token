var MassToken = artifacts.require("./MassToken.sol");
var CrowdSale = artifacts.require("./CrowdSale.sol");

module.exports = function(deployer) {
	deployer.deploy(MassToken,"Massacre Token", "MTCv1.0",3,1000000).then(function(){
		return deployer.deploy(CrowdSale,50,"google.com",web3.eth.accounts[2],1,0,MassToken.address,1000000000000000);
	});
	
};
