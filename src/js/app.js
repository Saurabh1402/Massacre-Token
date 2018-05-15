App={
	web3Provider:null,
	contracts:{},
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
				console.log(crowdSale.address);
			});
		}).done(function(){
			$.getJSON("MassToken.json",function(MassTokenJSON){
			//console.log("CrowdSale laoded successfully");
				App.contracts.MassToken = TruffleContract(MassTokenJSON);
				App.contracts.MassToken.setProvider(App.web3Provider);
				App.contracts.MassToken.deployed().then(function(MassToken){
					console.log(MassToken.address);
				});
			})
		});
	}
}

$(function(){
	$(window).on('load',function(){
		App.init();
	})
})