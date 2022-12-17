// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";

contract TokenFactory {
  address public owner;
  uint256 public fee = 0.1 ether;
  address[] public tokens;

  event TokenCreated(address tokenAddress);
  event FeeUpdated(uint256 amount);
  event OwnerUpdated(address owner);
  event FeesWithdrawn(address to, uint256 amount);

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only Owner can call this function");
    _;
  }

  function createToken(
    string memory name,
    string memory symbol,
    uint256 maxSupply
  ) external payable {
    require(msg.value == fee, "Invalid fees");
    ERC20 newToken = new ERC20(name, symbol, maxSupply);
    tokens.push(address(newToken));
    emit TokenCreated(address(newToken));
  }

  function getTokens() external view returns (address[] memory) {
    return tokens;
  }

  function setOwner(address newOwner) external onlyOwner {
    owner = newOwner;
    emit OwnerUpdated(newOwner);
  }

  function setFees(uint256 newFee) external onlyOwner {
    fee = newFee;
    emit FeeUpdated(newFee);
  }

  function withdrawFees() external onlyOwner {
    uint256 fees = address(this).balance;
    (bool sent, ) = payable(owner).call{value: fees}("");
    require(sent, "Failed to withdraw fees");
    emit FeesWithdrawn(owner, fees);
  }
}
