var TCoinAdvanced = artifacts.require("./TCoinAdvanced.sol");


module.exports = function(deployer) {
  deployer.deploy(TCoinAdvanced,1000000, "TCoinAdv ", "TCAv1.0", 3, 0);
};
