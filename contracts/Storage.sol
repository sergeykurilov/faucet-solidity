pragma solidity >=0.4.22 <0.9.0;

contract Storage {

    mapping(uint => uint) public aa;
    mapping(address => uint) public bb;

    //keccak256(slot) + index of the item
    uint[] public cc; //slot 2

    uint public a = 7; //1
    uint16  public b = 10; //2
    address public c = 0x522fd268AaED52d9D181716Dedc0C256482Cf0c5; //20
    bool d = true; //1
    uint64 public e = 15; //8
    // 32 bytes all values will be stored in slot 0
    //0x 0f 01 522fd268aaed52d9d181716dedc0c256482cf0c5 000a

    uint256 public f = 200; //32 slot 1
    uint8 public g = 40; // 1 byte -> slot 2
    uint256 public h = 789; //32 -> slot 3

    constructor() {
        cc.push(1);
        cc.push(10);
        cc.push(100);

        aa[2] = 4;
        aa[3] = 10;
        bb[0xed3a7773120A220bDB438283717F71410c719605] = 100;
    }

}

