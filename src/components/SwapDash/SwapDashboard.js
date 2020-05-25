import React, { Fragment, useState, useEffect } from 'react';
import {initWeb3, initContract} from '../../contractInterfaces/init';
import {uniswap} from '../../contractInterfaces/uniswap';
import NavBar from '../core/Navbar/NavBar';
import {userWallet} from '../../contractInterfaces/userWallet';
import UserInfo from '../core/UserInfo/UserInfo';
import Footer from '../core/Footer/Footer';
import './SwapDashboard.css';
import daiIcon from '../../icons/tokens/DAI.svg';
import batIcon from '../../icons/tokens/BAT.svg';
import mkrIcon from '../../icons/tokens/MKR.svg';
import omgIcon from '../../icons/tokens/OMG.svg';
import SavedTransactionsChart from '../SavedTransactionsChart';
import { getUniswapSwapHash, getMultisenderHash } from '../../contractInterfaces/functionHashes';


function SwapDashboard({web3, tokenAddresses, address, setAddress, balances, setBalances, isWalletConnected, setIsWalletConnected, isRegistered, setIsRegistered, registryContract, setRegistryContract, setPersonalWalletAddress}) {

    const supportedTokens = ['ETH', 'DAI', 'MKR', 'USDC'];
    const tokenIcons = {'DAI':daiIcon, 'BAT':batIcon, 'MKR':mkrIcon, 'OMG':omgIcon};
    const [swapSaved, setSwapSaved] =useState(0);
    const [fromAmount, setFromAmount] = useState(0);
    const [transactionRows, setTransactionRows] = useState(0);
    const [selectedToken, setSelectedToken] = useState("DAI");
    const [toAmountsArray, setToAmountsArray] = useState([{token:"ETH", ethAmt:0, receiverAddress:"", tokenAllocation:0}]);
    const toAmountObj = {token:"ETH", ethAmt:0, receiverAddress:"", tokenAllocation:0};
    const [amtLimtExceedError, setAmtLimitExceedError] = useState(false);
    const [receiverAddressEmptyError, setReceiverAddressEmptyError] = useState(false);
    const [outputAmt, setOutputAmt] = useState(0);
    const uniswapTokenAddresses = {'ETH':'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE','DAI':'0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa', 'USDC':'0x75B0622Cec14130172EaE9Cf166B92E5C112FaFF', 'MKR':'0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD'};
    const multiTokenAddress='0xcb9C3BC7fc71F72E67b985ca7752291E1beaC3D6';
    const [metaMaskAdd, setMetamaskAdd] = useState("");
    const [metaMaskBal, setMetamaskBal] = useState(0);

    const handleFromAmtChange = e => setFromAmount(e.target.value);

    const getSwapSaved = () => {
        let savedCount=0;
        for(const obj in toAmountsArray) {
            if(toAmountsArray[obj].ethAmt!==0)
                savedCount++;
        }
        return savedCount;
    }

    const getMetaMaskDetails = async () => {
        const web3 = await initWeb3();
        if(window.ethereum.selectedAddress) {
            const add = window.ethereum.selectedAddress;
            const bal = await web3.eth.getBalance(add)/Math.pow(10,18);
            setMetamaskAdd(add);
            setMetamaskBal(bal);
            console.log(bal);
        }
    }
    

    useEffect(() => { 
        const savedCount = getSwapSaved();
        console.log(savedCount);
        setSwapSaved(savedCount);
        getMetaMaskDetails();
        
    }, []);


    const _getTotalOutputAmt = (outputAmtArray) => {
        let totalOutputAmt=0;
        for(const amtObj of outputAmtArray) {
            totalOutputAmt+=Number(amtObj.ethAmt);
        }
        return totalOutputAmt;
    }

    const _isReceiverAddressEmpty = (outputAmtArray) => {
        for(const amtObj of outputAmtArray) {
            if(!amtObj.receiverAddress)
                return true;
        }
        return false;
    }
    const handleTokenSelect = (e, toAmount, index) =>{
        const toAmtObj = toAmount;
        toAmtObj.token=e.target.value;
        const currentToAmountsArray=[...toAmountsArray];
        currentToAmountsArray[index]=toAmtObj;
        setToAmountsArray(currentToAmountsArray);
        console.log(currentToAmountsArray);
    }
    
    const handletoAmountChange = async (e, toAmount, index) => {
        setAmtLimitExceedError(false);
        const toAmtObj=toAmount;
        toAmtObj.ethAmt=e.target.value;
        console.log(toAmtObj.token);
        if(toAmtObj.token==='ETH') {
            toAmtObj.tokenAllocation=0;
        }
        else {
            const uniswapContract = initContract(web3, uniswap.contract.abi, uniswap.contract.address);
            const tokenExValue = await uniswapContract.methods.getAmount(["0xd0A1E359811322d97991E03f863a0C30C2cF029C", uniswapTokenAddresses[toAmtObj.token] ], (Number(toAmtObj.ethAmt)*Math.pow(10,18)).toString()).call()
            const divFactor = toAmtObj.token==='USDC' ? Math.pow(10,6) : Math.pow(10,18);
            toAmtObj.tokenAllocation = Number(tokenExValue[1])/divFactor;
        }
        const currentToAmountsArray=[...toAmountsArray];
        currentToAmountsArray[index]=toAmtObj;
        setToAmountsArray(currentToAmountsArray);
        const totalOutputAmt=_getTotalOutputAmt(currentToAmountsArray);
        setOutputAmt(totalOutputAmt);
        if(totalOutputAmt>Number(fromAmount)){
            setAmtLimitExceedError('Total amount to be sent can\'t be greater than input amount');
        }
    }

    const handleToAddressChange = (e, toAmount, index) => {
        const toAmtObj = toAmount;
        toAmtObj.receiverAddress=e.target.value;
        const currentToAmountsArray=[...toAmountsArray];
        currentToAmountsArray[index]=toAmtObj;
        setToAmountsArray(currentToAmountsArray);
        console.log(currentToAmountsArray);
    }

    const addTransactionRow = () => {
        const currentToAmtsArray = [...toAmountsArray];
        currentToAmtsArray.push(toAmountObj);
        setToAmountsArray(currentToAmtsArray);
    };  
    
    const deleteTransactionRow = index => {
        const currentToAmountsArray=[...toAmountsArray];
        currentToAmountsArray.splice(index,1);
        setToAmountsArray(currentToAmountsArray);
    }
    const initiateSend = async () => { 
        console.log(address);
       const metamaskAcc = window.ethereum.selectedAddress;
       const web3 = await initWeb3();
       const weiBalance = await web3.eth.getBalance(metamaskAcc);
       const accBalance = web3.utils.fromWei(weiBalance,'ether');
       if(Number(fromAmount) > accBalance) {
           return setAmtLimitExceedError('Insufficient Funds. Account balance less than send amount')
       }
       if(outputAmt>Number(fromAmount)) {
           return setAmtLimitExceedError('Total amount to be sent canno\'t be greater than input amount');
       }
       const isReceiverAddressEmpty=_isReceiverAddressEmpty(toAmountsArray);
       if(isReceiverAddressEmpty) {
           return setReceiverAddressEmptyError('Receiver address cannot be empty');
       }
       const sendAmounts=[];
       for(const amtObj of toAmountsArray) {
           if(Number(amtObj.ethAmt)!==0) 
                sendAmounts.push(amtObj);
       }
       const wallet = new web3.eth.Contract(userWallet.contract.abi, address);
       const poolAddressArray=[];
       const functionHashArray=[];
       for(const amtObj of sendAmounts) {
           if(amtObj.token!=='ETH') {
               const swapValue= Number(amtObj.ethAmt)*Math.pow(10,18);
               console.log('Not ETH');
               console.log(swapValue);
               const toToken = amtObj.token;
               const swapFuncHash = getUniswapSwapHash(web3, swapValue, uniswapTokenAddresses[toToken]);
               poolAddressArray.push(uniswap.contract.address);
               functionHashArray.push(swapFuncHash);
            }
       }
        const tokenAddressArray=[];
        const receiverAddressArray=[];
        const tokenAmtArray=[];
       for(const amtObj of sendAmounts) { 
            tokenAddressArray.push(uniswapTokenAddresses[amtObj.token]);
            receiverAddressArray.push(amtObj.receiverAddress);
            const multiFactor = amtObj.token==='USDC' ? Math.pow(10,6) : Math.pow(10,18);
            console.log('ANY');
            const tokenAmt = amtObj.token==='ETH' ? Number(amtObj.ethAmt)*multiFactor :Number(amtObj.tokenAllocation)*multiFactor;
            console.log(tokenAmt);
            tokenAmtArray.push(tokenAmt.toString());
       }
        poolAddressArray.push(multiTokenAddress);
        const multisenderFuncHash = getMultisenderHash(web3, tokenAddressArray, receiverAddressArray, tokenAmtArray);
        functionHashArray.push(multisenderFuncHash);
        console.log(poolAddressArray);
        console.log(functionHashArray);       
        const result =  wallet.methods.execute([...poolAddressArray], [...functionHashArray]).send({ from: window.ethereum.selectedAddress, value: Number(fromAmount)*Math.pow(10,18).toString() });
        result.on("transactionHash", (hash) => {
            alert("Transaction sent successfully! Waiting for confirmation....")
            console.log("Transaction Hash is ", hash)   
          }).once("confirmation", (confirmationNumber, receipt) => {
            if (receipt.status) {
              alert("Transaction processed successfully")
            } else {
            }
            console.log(receipt)
        })
    }

    return <Fragment>
                <NavBar isWalletConnected={isWalletConnected}
                        setIsWalletConnected={setIsWalletConnected}
                        isRegistered={isRegistered}
                        setIsRegistered={setIsRegistered}
                        registryContract={registryContract}
                        setRegistryContract={setRegistryContract}
                        setAddress={setAddress}
                        setBalances={setBalances}   
                        tokenAddresses={tokenAddresses}                      
                />
                {/* <div id="chart-div">
                    <SavedTransactionsChart savedTransactionCount={swapSaved} maxCount={20}/>
                </div> */}
                <div id="info-container-div">
                    <div className="info-item-div">
                    <h3 className="title">Wallet</h3>
                    <p class="content">{metaMaskAdd ? metaMaskAdd : <span style={{color:'red'}}>Wallet not connected</span>}</p>
                    <p class="content">{metaMaskBal ? Math.round(metaMaskBal*10000)/10000+' ETH' : ""}</p>
                </div>
                    {/* <div className="info-item-div"><h3 className="title">Transactions Saved</h3>
                        <p style={{color:'#000'}}>{swapSaved-1===-1 ? 0 : swapSaved-1}</p>
                    </div> */}
                </div>
                <div id="choose-allocations">Send Amount</div> 
                <form id="form-div-parcel">
                    {/* <label className="form-div-item-parcel">From</label> */}
                    <input className="form-div-item" 
                           type="number" 
                           min={0}
                           onChange={handleFromAmtChange}
                           value={fromAmount}
                           required  
                           autoFocus
                    /> 
                    <span className="form-div-item-parcel">ETH</span>
                    {/* {selectedTokens.length===0 && <button id="swap-btn" onClick={initiateSwap}>Swap</button>}
                    {insufficientFundsError && <div className="error-div">{insufficientFundsError}</div>} */}
                </form>
                {toAmountsArray.length!==0 && 
                <table id="token-table-parcel">
                    <thead>
                        <tr className="token-table-header">
                            <th style={{backgroundColor:'#F6F9FC'}}></th>
                            <th>ETH / Token</th>
                            <th>Send Amount in ETH</th>
                            <th>Tokens Sent</th>
                            <th>Receiver Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {toAmountsArray.map((toAmount, index) => 
                            <tr key={index} >
                                <td>
                                    <button id="delete-row-btn-parcel" onClick={() => deleteTransactionRow(index)}>x</button>
                                </td>
                                <td>
                                <select name="token"
                                        onChange={e => handleTokenSelect(e, toAmount, index)}
                                >
                                    <option value="ETH">ETH</option>
                                    <option value="DAI">DAI</option>
                                    <option value="MKR">MKR</option>
                                    <option value="USDC">USDC</option>
                                </select>
                                </td>
                                <td>
                                    <input type="number" 
                                            className="user-input-cell"
                                            min={0}
                                            onChange={e => handletoAmountChange(e, toAmount, index)}
                                    />
                                </td>
                                <td>{toAmount.tokenAllocation}</td>
                                <td>
                                    <input type="text"
                                        className="user-input-cell" 
                                        onChange={e => handleToAddressChange(e, toAmount, index)}
                                    />
                                </td>
                            </tr>
                        )}
                        <tr className="token-table-header">
                        <td style={{backgroundColor:'#F6F9FC'}}>
                            <button id="add-row-btn-parcel" onClick={addTransactionRow}>+</button>
                        </td>
                            <td>Total Amount</td>
                            <td style={outputAmt > Number(fromAmount) ? {color:'red'}: {}}
                                colSpan="4"
                            >
                                {outputAmt}
                            </td>
                        </tr>
                        {amtLimtExceedError && 
                            <tr>
                                <td colSpan="5" style={{color:'red'}}>{amtLimtExceedError}</td>
                            </tr>
                        }
                        {receiverAddressEmptyError && 
                            <tr>
                                <td colSpan="5" style={{color:'red'}}>{receiverAddressEmptyError}</td>
                            </tr>
                        }
                    </tbody>
                </table>
                }
                {toAmountsArray.length!==0 && 
                    <div style={{textAlign:'center'}}>
                        <button id="send-amt-btn" style={{marginBottom:'20px'}} onClick={initiateSend}>Parcel</button>
                        
                    </div>
                }
                <Footer />
           </Fragment>
}

export default SwapDashboard;