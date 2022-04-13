pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    uint public numOfFunders;
    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;


    receive() external payable {}

    
    function addFunds() external payable {
        address funder = msg.sender;
        if(!funders[funder]) {
            uint index = numOfFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
    }

    function getAllFounders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);
        for (uint i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }
        return _funders;
    }

    function getFounderAtIndex(uint8 index) external view returns (address) {
        return lutFunders[index];
    }
}

// const instance = await Faucet.deployed()
// instance.addFunds({from: accounts[0], value: "2"})
// instance.addFunds({from: accounts[1], value: "2"})
// instance.getFounderAtIndex(0)
// instance.getAllFounders()
