var MassToken = artifacts.require("./MassToken.sol");


module.exports = function(deployer) {
	deployer.deploy(MassToken,"Massacre Token", "MTCv1.0",3,1000000);
	
};
