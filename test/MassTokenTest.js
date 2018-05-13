var MassToken = artifacts.require("MassToken")

contract('MassToken', (accounts) => {

const admin =accounts[0];
const account1= accounts[1];
const account2= accounts[2];
const _tokenName="Massacre Token";
const _tokenSymbol="MTCv1.0";
const _tokenDecimal=3;
const _tokenTotalSupply=1000000;

	//admin Account =1000000
	//account1=0
	//account2=0
	//account3=0
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
	


	//admin Account =1000000
	//account1=0
	//account2=0
	//account3=0
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
	

	//admin Account =1000000
	//account1=100
	//account2=0
	//account3=0
	
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


	//admin Account =1000000
	//account1=100
	//account2=0
	//account3=0
	it("to check transfer adminship to other account",function(){
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


	//admin Account =1000000
	//account1=100
	//account2=100
	//account3=0
	it("To verify delegated transfer of token",function(){
		let tokenInstance;
		//Delegated Account can transfer defined fund from `from` Account to `to` Account. 
		const fromAccount=accounts[0];
		const toAccount=accounts[2];
		const delegatedAccount=accounts[1];
		let initialAmountOfFromAccount;
		let initialAmountOfToAccount;

		return MassToken.deployed().then(function(instance){
			tokenInstance=instance;
			initialAmountOfFromAccount=tokenInstance.balanceOf(fromAccount);
			initialAmountOfToAccount=tokenInstance.balanceOf(toAccount);
			return tokenInstance.approve(delegatedAccount,250000,{from:fromAccount});
		}).then(function(success){
			assert(success,"Delegated should be assigned");
			return tokenInstance.allowances.call(fromAccount,delegatedAccount);
		}).then(function(delegatedAmount){
			assert.equal(delegatedAmount.toNumber(),250000,"Delegate Amount should be 250000 to delegated account for from account");
			return tokenInstance.transferFrom(fromAccount,toAccount,1000000000,{from:delegatedAccount});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf("revert")>=0,"delegation should fails as the transfer amount is greater than delegated amount");
			return tokenInstance.transferFrom(fromAccount,toAccount,250000,{from:delegatedAccount});
		}).then(function(success){
			assert(success,"delegated transferFrom should be successful");
			return tokenInstance.balanceOf.call(fromAccount);
		}).then(function(balance){
			let finalAmountOfFromAccount=initialAmountOfFromAccount-balance.toNumber();
			assert.equal(balance.toNumber(),750000,"deleagated amount should be deducted from `from` account");
			return tokenInstance.balanceOf.call(toAccount);
		}).then(function(balance){
			assert.equal(balance.toNumber(),250100,"250000 should be added to `to` Account");
		});
	});

	//admin Account =750000
	//account1=100
	//account2=250100
	//account3=0
	
});

