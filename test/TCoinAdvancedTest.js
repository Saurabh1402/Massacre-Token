var TCoinAdvanced = artifacts.require("TCoinAdvanced")

contract('TCoinAdvanced', (accounts) => {

  
  let owner = accounts[0];
  let account1 = accounts[1];
  let account2 = accounts[2];
  let account3 = accounts[3];

  it("should put 1000000 TCoinAdvanced in th first account", function(){

    return TCoinAdvanced.deployed().then(function(instance){
      return instance.balanceOf.call(accounts[0]);
    }).then(function(balance){
      assert.equal(balance.valueOf(), 1000000, "1000000 wasn't in the first account");
    });
  });

  //transfering token for the token holder having token 1000000 to another address
  it("should transfer coin to another address",function(){
    let tokenInstance;
    return TCoinAdvanced.deployed().then(function(instance){
      tokenInstance=instance;
      tokenInstance.transfer(accounts[1],100);
      return tokenInstance.balanceOf.call(accounts[1])
      }).then(function(balance){
        assert.equal(balance.toNumber(), 100, "100 coin should be tranfered to account1");
     });
  });

})
