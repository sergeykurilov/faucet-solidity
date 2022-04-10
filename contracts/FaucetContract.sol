pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    // this a special function
    //it's called when you make a tx that doesn't specify
    // function name to call


    //external function are part of the contract interface
    //which means that they can be called via contracts and other txs (transactions)
    receive() external payable {}
}
