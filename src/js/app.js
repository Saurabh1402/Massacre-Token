App={
	web3Provider:null,
	contracts:{},
	loading:false,
	account:'0x0000000000000000000000000000000000000000',
	priceOfToken:1000000000000000,
	init: function(){
		console.log("App loaded successfully");		
		return App.initWeb3();
	},
	initWeb3:function(){

		if(typeof web3 !== 'undefined'){
			App.web3Provider=web3.currentProvider;
			web3=new Web3(web3.currentProvider);
		}else{
			App.web3Provider=new Web3.providers.HttpProvider("http://localhost:8545");
			web3=new Web3(App.web3Provider);
		}
		return App.initContract();
	},
	initContract:function(){
		$.getJSON("CrowdSale.json",function(CrowdSaleJSON){
			//console.log("CrowdSale laoded successfully");
			App.contracts.CrowdSale = TruffleContract(CrowdSaleJSON);
			App.contracts.CrowdSale.setProvider(App.web3Provider);
			App.contracts.CrowdSale.deployed().then(function(crowdSale){
				console.log("CrowdSale Address: ",crowdSale.address);
			});
		}).done(function(){
			$.getJSON("MassToken.json",function(MassTokenJSON){
			//console.log("CrowdSale laoded successfully");
				App.contracts.MassToken = TruffleContract(MassTokenJSON);
				App.contracts.MassToken.setProvider(App.web3Provider);
				App.contracts.MassToken.deployed().then(function(MassToken){
					console.log("Mass Token Address:",MassToken.address);

				});
				return App.render();
			});
		});
		
	},
	render:function(){
		if(App.loading){
			return;
		}
		App.loading=true;
		$('#loader').show();
		$('#content').hide();
		
		web3.eth.getCoinbase(function(error,account){
			console.log("Account Logged in: ",account);
			App.account=account;
			$('#account-address').html(account);
		});
		var tokenInstance;
		var tokenSaleInstance;
		App.contracts.CrowdSale.deployed().then(function(instance){
			tokenSaleInstance=instance;
			return tokenSaleInstance.priceInWei();
		}).then(function(priceOfToken){
			App.priceOfTokenInWei=priceOfToken.toNumber();
			$('.token-price').html(web3.fromWei(App.priceOfTokenInWei,'ether'));
			return tokenSaleInstance.fundingMinimumTargetInWei();
		}).then(function(minimunTargetInWei){
			console.log('minimunTargetInWei',minimunTargetInWei.toNumber()/App.priceOfTokenInWei);
			App.minimumTokensTarget=(minimunTargetInWei.toNumber()/App.priceOfTokenInWei);
			$('.token-available').html(App.minimumTokensTarget);
			return tokenSaleInstance.totalRaised();
		}).then(function(totalRaised){
			console.log('minimunTargetInWei',totalRaised.toNumber()/App.priceOfTokenInWei);
			App.totalRaised=(totalRaised.toNumber()/App.priceOfTokenInWei);
			$('#progress').css('width',App.totalRaised*100/App.minimumTokensTarget+"%");
			$('.token-sold').html(App.totalRaised);
			return App.contracts.MassToken.deployed();
		})
		.then(function(instance){
			tokenInstance=instance;
			console.log("token Instance",tokenInstance.address);
			return tokenInstance.balanceOf(App.account);
		}).then(function(balance){
			console.log('Account Balance',balance.toNumber());
			App.tokenBalance=balance.toNumber();
			$('.token-balance').html(App.tokenBalance);
			App.loading=false;
			$('#loader').hide();
			$('#content').show();
			
		});

	},
	buyTokenListener:function(){
		var tokenBuying=$('#numberOfTokens').val();
		console.log('token Buying: ',tokenBuying);
		var account=App.account;
		var ether_amount=tokenBuying * App.priceOfTokenInWei;
		App.contracts.CrowdSale.deployed().then(function(instance){
			return instance.contribute({
				from:account,
				value:ether_amount,
				gas:500000
			})
		}).then(function(result){
			console.log(result);
		});
	}
}

$(function(){
	$(window).on('load',function(){
		App.init();
	})
})