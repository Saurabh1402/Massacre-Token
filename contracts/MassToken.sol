pragma solidity ^0.4.0;


contract ERC223ReceivingContract {
    function tokenFallback(address _from, uint _value, bytes _data) public;
}
interface ERC223 {
    function transfer(address _to, uint _value, bytes _data) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint value, bytes indexed data);
}
interface ERC20{
    function transferFrom(address _from, address _to, uint _value) external returns (bool success);
    function approve(address _spender,uint _value) external returns (bool success);
    function allowance(address _owner,address _spender) external constant returns (uint remaining);
    event Approval(address indexed _from, address indexed _spender, uint _value);
}
/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}
contract Token {
    string public symbol;
    string public name;
    uint8 public decimals;
    uint public totalSupply;
    mapping (address => uint) public balanceOf;
    mapping (address => mapping (address => uint)) public allowances;

    constructor(string _name,string _symbol, uint8 _decimals, uint _totalSupply) public {
        symbol = _symbol;
        name = _name;
        decimals = _decimals;
        totalSupply = _totalSupply;
    }

    function name() public constant returns (string) {
        return name;
    }

    function symbol() public constant returns (string) {
        return symbol;
    }

    function decimals() public constant returns (uint8) {
        return decimals;
    }

    function totalSupply() public constant returns (uint) {
        return totalSupply;
    }

    function balanceOf(address _addr) public constant returns (uint);
    function transfer(address _to, uint _value) public returns (bool);
    event Transfer(address indexed _from, address indexed _to, uint _value);
}

contract MassToken is Token,ERC20,ERC223{
    address admin;
    using SafeMath for uint256;


    constructor(string _tokenName,string _tokenSymbol,uint8 _decimal,uint _totalSupply) Token(_tokenName,_tokenSymbol,_decimal,_totalSupply) public{
        balanceOf[msg.sender]=_totalSupply;
        admin=msg.sender;
    }
    function totalSupply() public constant returns (uint){
        return totalSupply;
    }

    modifier isAdmin(){
        require(admin==msg.sender);
        _;
    }

    function addTotalSupply(uint _amount) isAdmin public{
        totalSupply=_totalSupply.add(_amount);
        balanceOf[msg.sender]=balanceOf[msg.sender].add(_amount);

    }
    function subtractTotalSupply(uint _amount) isAdmin public{
        require(balanceOf[admin]>=_amount);
        totalSupply=_totalSupply.sub(_amount);
        balanceOf[msg.sender]=balanceOf[msg.sender].sub(_amount);

    }

    function transfer(address _to, uint _value) public returns (bool){
        if(_value!=0 &&
        _value<=_balanceOf[msg.sender]){
            balanceOf[msg.sender]-=_value;
            balanceOf[_to]+=_value;
            Transfer(msg.sender,_to,_value);
            return true;
        }
        return false;
    }
    function transfer(address _to, uint _value, bytes _data) external returns (bool){
         if(_value!=0 &&
        _value<=_balanceOf[msg.sender]){
            balanceOf[msg.sender]-=_value;
            balanceOf[_to]+=_value;
            ERC223ReceivingContract _contract=ERC223ReceivingContract(_to);
            _contract.tokenFallback(msg.sender,_value,_data);
            Transfer(msg.sender,_to,_value,_data);
            return true;
        }
        return false;
    }

    function isContract(address _addr) private constant returns (bool){
        uint codeSize;
        assembly{
            codeSize:=extcodesize(_addr)
        }
        return codeSize>0;
    }
    function transferFrom(address _from, address _to, uint _value) external returns (bool){
        if(allowances[_from][msg.sender]> 0 &&
        _value > 0 &&
        allowances[_from][msg.sender]>=_value &&
        balanceOf[_from]>=_value){
            balanceOf[_from]-=_value;
            balanceOf[_to]+=_value;
            allowances[_from][msg.sender]-=_value;
            Transfer(_from,_to,_value);
            return true;
        }
        return false;
    }
    function approve(address _spender,uint _value) external returns (bool success){
        allowances[msg.sender][_spender]=_value;
        Approval(msg.sender,_spender,_value);
        return true;

    }
    function allowance(address _owner,address _spender) external constant returns (uint){
        return allowances[_owner][_spender];
    }
}
