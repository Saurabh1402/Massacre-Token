var CrowdSale=artifacts.require("CrowdSale")
var MassToken=artifacts.require("MassToken")

contract("CrowdSale",function(accounts){

let admin=accounts[0];
let account1=accounts[1];
let account2=accounts[2];
let account3=accounts[3];
let account4=accounts[4];
let ether_in_wei=1000000000000000000;
it("should initialize the Crowdsale correctly",function(){
	var tokenInstance;
	var tokenSaleInstance;
	return MassToken.deployed().then(function(instance){
		tokenInstance=instance;
		return CrowdSale.deployed();
	}).then(function(instance){
		tokenSaleInstance=instance;
		return tokenSaleInstance.tokenReward();
	}).then(function(tokenReward){
		assert.equal(tokenReward,tokenInstance.address,"tokenReward of Crowdsale should be equal to tokenInstance");
		return tokenSaleInstance.creator();
	}).then(function(creator){
		assert.equal(creator,admin,"creator in Crowdsale should be equal to admin");
		return tokenSaleInstance.beneficiary();
	}).then(function(beneficiary){
		assert.equal(beneficiary,account2,"beneficiary in Crowdsale should be equal to account2");
		return tokenSaleInstance.fundingMinimumTargetInWei();
	}).then(function(minTarget){
		assert.equal(minTarget.toNumber(),ether_in_wei,"minimum target should be equal to 1 ether");
		return tokenSaleInstance.fundingMaximumTargetInWei();
	}).then(function(maxTarget){
		assert.equal(maxTarget.toNumber(),0,"Maximum target should be equal to 0 ether");
	});

	
});

})