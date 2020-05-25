import React, { useState, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {initWeb3, initContract} from '../../../contractInterfaces/init';
import { registry, initRegistry, checkRegistry } from '../../../contractInterfaces/registry';
import {balanceAbi} from '../../../contractInterfaces/balance';
import Modal from 'react-modal';
import './NavBar.css';
import brandLogo from '../../../icons/logo.png';
import metamaskIcon from '../../../icons/metamask.svg'
import swapIcon from '../../../icons/swap.svg'
import transactionIcon from '../../../icons/transaction.svg'

Modal.setAppElement('#root');

function NavBar({tokenAddresses, setAddress, setBalances, setIsWalletConnected, isRegistered, setIsRegistered, registryContract, setRegistryContract}) {
   const [showMetaMaskModal, setShowMetaMaskModal] = useState(false); 
   let [showPersonalWalletConnectModal, setShowPersonalWalletConnectModal] = useState(false);

    const connectMetaMaskWallet = async () => {
        setShowMetaMaskModal(false);
        setIsWalletConnected(true);
        const web3Obj = await initWeb3();
        setTimeout(async () => {
            const registryContractObj = initContract(web3Obj, registry.contract.abi, registry.contract.address);
            setRegistryContract(registryContractObj);
            const personalWalletAdd = await checkRegistry(registryContractObj);
            if(personalWalletAdd==="0x0000000000000000000000000000000000000000") {
                setShowPersonalWalletConnectModal(true);
                setIsRegistered(false);
                setAddress(null);
            }
            else {
                setAddress(personalWalletAdd);
                const currentBalances = {'ETH':0, 'DAI':0, 'MKR':0, 'cETH':0, 'aETH':0};
                const ETHbal = await web3Obj.eth.getBalance(personalWalletAdd);
                currentBalances['ETH']=Math.round((Number(ETHbal)/(Math.pow(10,18)))*10000)/10000;
                for(const token in currentBalances) {
                    if(token!=='ETH') {
                        const balanceContract = initContract(web3Obj, balanceAbi, tokenAddresses[token]);
                        const result=await balanceContract.methods.balanceOf(personalWalletAdd).call();
                        currentBalances[token]=Math.round((Number(result)/(Math.pow(10,18)))*10000)/10000;
                    }
                }
                setBalances(currentBalances);
                setIsRegistered(true);
                console.log('PWA: '+personalWalletAdd);
                console.log(currentBalances);

            }   
        },1000);
    }

    const createPersonalWallet = async () => {
        setShowPersonalWalletConnectModal(false);
        const personalWalletAdd = await initRegistry(registryContract);
        console.log(personalWalletAdd);
        if(personalWalletAdd==="0x0000000000000000000000000000000000000000" || !personalWalletAdd) {
            setIsRegistered(false);
            setAddress(null);
        }
        else {
            setIsRegistered(true);
            setAddress(personalWalletAdd);
        }
        console.log(personalWalletAdd);
    }

   const modalStyles = {
        content: {
            top: '30vh',
            left: '20vw',
            right:'20vw',
            height:'150px',
            backgroundColor:'#fff',
            boxShadow:'2px 1.5px #999'
        }
   };

    return <Fragment>
                <header>
                    <Link className="nav-link" id="logo" to="/">
                        <img src={brandLogo} alt="parcel-logo"/>
                    </Link>
                    <nav>
                            <Link className="nav-link" to="/parcel"> 
                                <img src={swapIcon} alt="swap-icon"/>
                                <span>Parcel</span>
                            </Link>
                        
                            <Link className="nav-link" to="/defi">
                                <img src={transactionIcon} alt="transactionIcon" />
                                <span>DeFi Protocols</span>
                                
                            </Link>
                           
                            {isRegistered ? 
                                <button>Wallet Connected</button> :
                                <button onClick={() => setShowMetaMaskModal(true)}>Connect</button>
                            }
                            {/* {isRegistered &&
                                <button>Wallet Connected</button>
                            } */}
                            {/* {isWalletConnected ?
                                <button>Metamask Connected</button> :
                                <button onClick={() => setShowMetaMaskModal(true)}>Connect Metamask</button>
                            } */}
                            
                    </nav>
                </header>
                <Modal 
                    isOpen={showMetaMaskModal}
                    onRequestClose={() => setShowMetaMaskModal(false)}
                    style={modalStyles}
                >
                    <h1 id="modal-title">Connect Ethereum Wallet</h1>
                    <div id="modal-body">
                        <img src={metamaskIcon} alt="metamask" />
                        <div>
                            <h3>Metamask</h3>
                            Self custodial browser extension based wallet
                        </div>
                            <button onClick={connectMetaMaskWallet}>Connect using Metamask</button>
                    </div>                 
                </Modal>
                <Modal
                    isOpen={showPersonalWalletConnectModal}
                    onRequestClose={() => setShowPersonalWalletConnectModal(false)}
                    style={modalStyles}
                >
                    <h1 id="modal-title">Create Personal Wallet</h1>
                    <div id="modal-body">
                        <img style={{width:'150px'}} src={brandLogo} alt="metamask" />
                        <div>
                            <h3>Parcel Wallet</h3>
                            Parcel protocol requires for you to create a personal wallet
                        </div>
                            <button onClick={createPersonalWallet}>Create Wallet</button>
                    </div>                 
                </Modal>
           </Fragment>;
}

export default withRouter(NavBar);