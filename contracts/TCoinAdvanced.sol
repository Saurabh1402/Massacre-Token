pragma solidity ^0.4.8;

contract admined {
	address public admin;

	constructor() public {
		admin = msg.sender;
	}

	modifier onlyAdmin(){
		require(msg.sender == admin) ;
		_;
	}

	function transferAdminship(address newAdmin) onlyAdmin public  {
		admin = newAdmin;
	}

}

contract TCoin {

	mapping (address => uint256) public balanceOf;
	mapping (address => mapping (address => uint256)) public allowance;
	// balanceOf[address] = 5;
	string public standard = "TCoin v1.0";
	string public name;
	string public symbol;
	uint8 public decimals; 
	uint256 public totalSupply;
	event Transfer(address indexed from, address indexed to, uint256 value);


	constructor(uint256 initialSupply, string tokenName, string tokenSymbol, uint8 decimalUnits) public {
		balanceOf[msg.sender] = initialSupply;
		totalSupply = initialSupply;
		decimals = decimalUnits;
		symbol = tokenSymbol;
		name = tokenName;
	}

	function transfer(address _to, uint256 _value) public {
			require(balanceOf[msg.sender] > _value) ;
		require(balanceOf[_to] + _value > balanceOf[_to]) ;
		//if(admin)

		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		emit Transfer(msg.sender, _to, _value);
	}

	function approve(address _spender, uint256 _value) public returns (bool success){
		allowance[msg.sender][_spender] = _value;
		return true;
	}

	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
		require(balanceOf[_from] > _value) ;
		require(balanceOf[_to] + _value > balanceOf[_to]) ;
		require(_value < allowance[_from][msg.sender]) ;
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		allowance[_from][msg.sender] -= _value;
		emit Transfer(_from, _to, _value);
		return true;

	}
}

contract TCoinAdvanced is admined, TCoin{

	uint256 minimumBalanceForAccounts = 5 finney;
	uint256 public sellPrice;
	uint256 public buyPrice;

	constructor(uint256 initialSupply, string tokenName, string tokenSymbol, uint8 decimalUnits, address centralAdmin) TCoin (initialSupply, tokenName, tokenSymbol, decimalUnits ) public {
		
		if(centralAdmin != 0)
			admin = centralAdmin;
		else
			admin = msg.sender;
		balanceOf[admin] = initialSupply;
		totalSupply = initialSupply;	
	}

	function mintToken(address target, uint256 mintedAmount) onlyAdmin public {
		balanceOf[target] += mintedAmount;
		totalSupply += mintedAmount;
		emit Transfer(0, this, mintedAmount);
		emit Transfer(this, target, mintedAmount);
	}


	function transfer(address _to, uint256 _value) public {
		require(_value>0);
		require(balanceOf[msg.sender] >= _value) ;
		require(balanceOf[_to] + _value > balanceOf[_to]) ;
		
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		emit Transfer(msg.sender, _to, _value);
	}

	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
		require(balanceOf[_from] > _value) ;
		require(balanceOf[_to] + _value > balanceOf[_to]) ;
		require(_value < allowance[_from][msg.sender]) ;
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		allowance[_from][msg.sender] -= _value;
		emit Transfer(_from, _to, _value);
		return true;

	}

	function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyAdmin public {
		sellPrice = newSellPrice;
		buyPrice = newBuyPrice;
	}

	function buy() payable  public {
		uint256 amount = (msg.value/(1 ether)) / buyPrice;
		require(balanceOf[this] > amount) ;
		balanceOf[msg.sender] += amount;
		balanceOf[this] -= amount;
		emit Transfer(this, msg.sender, amount);
	}

	function sell(uint256 amount) public {
		require(balanceOf[msg.sender] > amount) ;
		balanceOf[this] +=amount;
		balanceOf[msg.sender] -= amount;
		if(!msg.sender.send(amount * sellPrice * 1 ether)){
			revert();
		} else {
			
			emit Transfer(msg.sender, this, amount);
		}
	}

}





