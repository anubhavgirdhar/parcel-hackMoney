import Web3 from 'web3';

async function initWeb3() {

    const web3 = window.ethereum ? (new Web3(window.ethereum)) : 
                                 ( window.web3 ? new Web3(window.web3.currentProvider) : null );
    if(!web3) { 
        console.log("Non-window.ethereum browser detected. You should consider trying MetaMask!");
        return -1;
    }
    try {
      await window.ethereum.enable();
      return web3;
    }
    catch(err) {
      console.log(err);
    }
} 

async function initUser(web3Obj) {
  const add = window.ethereum.selectedAddress;
  try {
      const bal = await web3Obj.eth.getBalance(add);
      return [add, bal];
  }
  catch(err) {
    console.log(err);
  }

}

function initContract(web3Obj , contractAbi, contractAddress) {
  const contract = new web3Obj.eth.Contract(contractAbi, contractAddress);
  return contract;
}

export { initWeb3, initUser, initContract };