function getDepositHashCompoundAave(web3, lendValue) {
    const depositHash = web3.eth.abi.encodeFunctionCall({
        "name":"deposit",
        "type":"function",
        "inputs": [{
            "type": "uint256",
            "name": "msgValue"
          }]
    },[lendValue.toString()]);
    console.log(depositHash);
    return depositHash;
}

function getDepositAndBorrowCompoundHash(web3, lendValue, borrowValue) {
    const depositandBorrowHash = web3.eth.abi.encodeFunctionCall({
        "name":"depositAndBorrow",
        "type":"function",
        "inputs": [{
            "type": "uint256",
            "name": "msgValue"
          },{
            "type": "uint256",
            "name": "daiValue"
          }]
    },[lendValue.toString(), borrowValue.toString()]);
    console.log(depositandBorrowHash);
    return depositandBorrowHash;
}

function getDepositAndStreamAaveHash(web3, lendValue, streamAddress) {
    const hash = web3.eth.abi.encodeFunctionCall({
      name: 'depositAndRedirect',
      type: 'function',
      inputs: [{
        type: 'uint256',
        name: 'msgValue'
      }, {
        type: 'address',
        name: 'receiver'
      }]
    }, [lendValue.toString(), streamAddress]);
    return hash;
}

function getUniswapSwapHash(web3, swapValue, toTokenAddress) {
    const hash = web3.eth.abi.encodeFunctionCall({
      name: 'swap',
      type: 'function',
      inputs: [{
        type: 'address[]',
        name: 'path'
      }, {
        type: 'uint256',
        name: 'amountInEth'
      }]
    }, [["0xd0A1E359811322d97991E03f863a0C30C2cF029C", toTokenAddress], swapValue.toString()]);
    return hash;

}


function getMultisenderHash(web3, tokenAddressArray, receiverAddressArray, tokenAmtArray) {
  const hash = web3.eth.abi.encodeFunctionCall({
    name: 'multiToken',
    type: 'function',
    inputs: [{
      type: 'address[]',
      name: 'targets'
    }, {
      type: 'address[]',
      name: 'addresses'
    },
    {
      type: 'uint256[]',
      name: 'values'
    }]
  }, [[...tokenAddressArray], [...receiverAddressArray], [...tokenAmtArray]]);
  return hash;
}
export { getDepositHashCompoundAave, getDepositAndBorrowCompoundHash, getDepositAndStreamAaveHash, getUniswapSwapHash, getMultisenderHash}

