pragma solidity >=0.4.22 <0.9.0;

// it's way for designer to say that
// any child the abstract contract has to implement specified methods
abstract contract Logger {
    uint public testNum;

    constructor() {
        testNum = 1000;
    }

    function emitLog() public virtual pure returns(bytes32);
    function test3() public pure returns(uint) {
        return 100;
    }

    function test5() external pure returns(uint) {
        test3();
        return 200;
    }
}
