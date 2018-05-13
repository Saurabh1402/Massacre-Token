var MassToken = artifacts.require("MassToken")

contract('MassToken', (accounts) => {

const admin =accounts[0];
const account1= accounts[1];
const account2= accounts[2];
const _tokenName="Massacre Token";
const _tokenSymbol="MTCv1.0";
const _tokenDecimal=3;
const _tokenTotalSupply=1000000;

	it("checking whether Token intialized as expected",function(){
		let tokenInstance;
		return MassToken.deployed()
		.then(function(instance){
			tokenInstance=instance;
			return tokenInstance.name();
		}).then(function(tokenName){
			assert.equal(tokenName,_tokenName,"Mass Token Name should be equal to Massacre Token");
			return tokenInstance.symbol();
		}).then(function(symbol){
			assert.equal(symbol,_tokenSymbol,"Mass Token symbol should be equal to MTCv1.0");
			return tokenInstance.decimals();
		}).then(function(tokenDecimal){
			assert.equal(tokenDecimal,_tokenDecimal,"Mass Token decimal should be equal to 3");
			return tokenInstance.totalSupply().valueOf();
		}).then(function(tokenTotalSupply){
			assert.equal(tokenTotalSupply,_tokenTotalSupply,"Mass Token TotalSupply should be equal to 1000000");
			return tokenInstance.balanceOf(admin);
		});
	});
	
	it("checking whether mintToken is executed by onlyAdmin",function(){
		let tokenInstance;
		return MassToken.deployed().then(function(instance){
			tokenInstance=instance;
			return tokenInstance;
		}).then(function(instance){
			instance.mintToken(account1,100,{from:admin});
			return instance.balanceOf.call(account1);
		}).then(function(balance){
			assert.equal(balance.toNumber(),100,"Mass token should be equal to 100 after minting to account1");
				
		});

	});
	it("throw exception as mintToken is called from account other than Admin",function(){
		let tokenInstance;
		return MassToken.deployed().then(function(instance){
			tokenInstance=instance;
			return tokenInstance.mintToken.call(account2,100,{from:account1});
		}).then(assert.fail).catch(function(error){
			//console.log(error);
			assert(error.message.indexOf('revert')>=0,"error message must contain revert");
		});
	});


	it("transfer adminship to other account",function(){
		let tokenInstance;
		return MassToken.deployed().then(function(instance){
			tokenInstance=instance;
			return tokenInstance.transferAdminship(account1,{from:admin});
		}).then(function(success){
			assert(success,"Adminship transferred successfully");
			return tokenInstance.mintToken(account2,100,{from:account1});
		}).then(function(success){
			assert(success,"Minting should work after tranfer Adminship");
			return tokenInstance.balanceOf.call(account2);
		}).then(function(balance){
			assert.equal(balance.toNumber(),100,"balance should be 100 after Minting through account1");
		});
	});
});

