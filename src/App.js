import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { initWeb3, initUser, initContract } from './contractInterfaces/init';
import { registry, checkRegistry } from './contractInterfaces/registry';
import { uniswap } from './contractInterfaces/uniswap';
// import config from './contractInterfaces/config';
import Home from './components/Home/Home';
import SwapDashboard from './components/SwapDash/SwapDashboard';
import TransactionDashboard from './components/TransactDash/TransactionDashboard';


/* Wallet => Metamask wallet Registry => Personal Wallet */
function App() {

  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState("");
  const tokenAddresses={
    'DAI':'0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    'MKR': '0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD',
    'aETH':'0xD483B49F2d55D2c53D32bE6efF735cB001880F79',
    'cETH' : '0xf92FbE0D3C0dcDAE407923b2Ac17eC223b1084E4'
  };
  const [balances, setBalances] = useState({'ETH':0, 'DAI':0, 'MKR':0, 'cETH':0, 'aETH':0});
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [registryContract, setRegistryContract] = useState(null);
  const [uniSwapContract, setUniswapContract] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  // window.ethereum.on('accountsChanged', async () => {
  //   try {
  //     if(web3) {
  //       const [add,bal] = await initUser(web3);
  //       setAddress(add);
  //       setBalance(web3.utils.fromWei(bal, 'ether'));
  //       let personalWalletAdd = await checkRegistry(registryContract);
  //       if(personalWalletAdd==="0x0000000000000000000000000000000000000000") {
  //         setIsRegistered(false);
  //         setPersonalWalletAddress(null);
  //       }
  //       else {
  //         setIsRegistered(true);
  //         setPersonalWalletAddress(personalWalletAdd);
  //       }
  //     }
  //   }
  //   catch(err) {
  //     setIsWalletConnected(false);
  //     setAddress("");
  //     setBalance(0);
  //   }
  // });

  const runInit = async () => {
    try {
      const web3Obj = await initWeb3();
      setWeb3(web3Obj);
      // console.log(web3Obj); 
      setTimeout(async () => {
        // const [add, bal] = await initUser(web3Obj);
        // setAddress(add);
        // setBalance(web3Obj.utils.fromWei(bal,'ether'));
        const registryContractObj = initContract(web3Obj, registry.contract.abi, registry.contract.address);
        setRegistryContract(registryContractObj);
        const uniswapContractObj = initContract(web3Obj, uniswap.contract.abi, uniswap.contract.address);
        setUniswapContract(uniswapContractObj);
        // const result=await uniswapContractObj.methods.getAmount(["0xd0A1E359811322d97991E03f863a0C30C2cF029C", "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"], "100000000000000000").call();
        // console.log(result);
      }, 1000);
    }
    catch(err) {
      console.log(err);
      setIsWalletConnected(false);
      // setAddress("");
      // setBalance(0);
      setRegistryContract(null);
    }
  }

  useEffect(() => {
    if(window.ethereum.selectedAddress) setIsWalletConnected(true);
    if(isWalletConnected) runInit();
    if(address) setIsRegistered(true);
  }, [isWalletConnected, isRegistered, registryContract, address, balances]);

  return  <Router>
              <Switch>
                <Route path='/' exact 
                  render={ () =>  <Home
                                    web3={web3}
                                    tokenAddresses={tokenAddresses}
                                    setAddress={setAddress}
                                    setBalances={setBalances}
                                    setIsWalletConnected={setIsWalletConnected}
                                    isRegistered={isRegistered}
                                    setIsRegistered={setIsRegistered}
                                    registryContract={registryContract}
                                    setRegistryContract={setRegistryContract}
                  />}
                />
                <Route path='/parcel' exact 
                  render={() => <SwapDashboard
                                    web3={web3}
                                    tokenAddresses={tokenAddresses}
                                    address={address}
                                    balances={balances}
                                    setAddress={setAddress}
                                    setBalances={setBalances}
                                    setIsWalletConnected={setIsWalletConnected}
                                    isRegistered={isRegistered}
                                    setIsRegistered={setIsRegistered}
                                    registryContract={registryContract}
                                    setRegistryContract={setRegistryContract}
                                        
                  />}
                />
                <Route path="/defi" exact 
                  render={() => <TransactionDashboard
                                  web3={web3}
                                  tokenAddresses={tokenAddresses}
                                  address={address}
                                  balances={balances}
                                  setAddress={setAddress}
                                  setBalances={setBalances}
                                  setIsWalletConnected={setIsWalletConnected}
                                  isRegistered={isRegistered}
                                  setIsRegistered={setIsRegistered}
                                  registryContract={registryContract}
                                  setRegistryContract={setRegistryContract}
                                 
                  />}   
                />
              </Switch>
          </Router>
}

export default App;



