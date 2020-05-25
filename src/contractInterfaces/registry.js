const registry={};
registry.contract = { 
    address : "0x828E2a8c8b73a612d77Cbe1a52e5B3a166199Fef",
    abi : [
    {
      "constant": false,
      "inputs": [],
      "name": "register",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "registered",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
}

  // Check if the user if already registered and fetch the registered address
  async function checkRegistry(registryContract) {
    const walletAddress = await registryContract.methods.registered(window.ethereum.selectedAddress).call({ from: window.ethereum.selectedAddress });
    console.log(walletAddress)
    return walletAddress;
  }

  async function register(registryContract) {
    const check = await registryContract.methods.register().send({ from: window.ethereum.selectedAddress });
    console.log(check);
  }

  const initRegistry = async (registryContract) => {
    try {
    let personalWalletAdd = await checkRegistry(registryContract);
    if(personalWalletAdd==="0x0000000000000000000000000000000000000000") {
        await register(registryContract);
        personalWalletAdd = await checkRegistry(registryContract);
    }
    return personalWalletAdd;
  }
  catch(err) {
    console.log(err);
  }
  }

  export { registry, checkRegistry, initRegistry };