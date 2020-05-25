import React, { useState, Fragment, useEffect } from 'react';
import NavBar from '../core/Navbar/NavBar';
import UserInfo from '../core/UserInfo/UserInfo';
import Footer from '../core/Footer/Footer';
import { userWallet } from '../../contractInterfaces/userWallet';
import CompoundDash from '../CompoundDash';
import AaveDash from  '../AaveDash';
import UniswapDash from '../UniswapDash/UniswapDash';
import './TransactionDashboard.css';
import compoundIcon from '../../icons/pools/compound.png';
import aaveIcon from '../../icons/pools/aave.png';
import uniswapIcon from '../../icons/pools/uniswap.png';
import {getDepositHashCompoundAave, getDepositAndBorrowCompoundHash, getDepositAndStreamAaveHash, getUniswapSwapHash, getMultisenderHash} from '../../contractInterfaces/functionHashes';
import PoolPercentageChart from '../PoolPercentageChart';
import SavedTransactionsChart from '../SavedTransactionsChart';

function TransactionDashboard({web3, tokenAddresses, address, setAddress, balances, setBalances, isWalletConnected, setIsWalletConnected, isRegistered, setIsRegistered, registryContract, setRegistryContract }) {

    const poolStyles = pool => {
        if(!isPoolSelected[pool]) return null;
        return {backgroundColor:'#3FBDA6'};
    }

    const supportedPools = ['compound', 'aave', 'uniswap'];
    const poolAddresses = {'compound':'0x533dfFF0908196568d22806230f85de0ae576dCE' ,'aave':'0x8cFc0fcD556882bbD5e4f1257BB8dfF862219ad1', 'uniswap':'0xCC2f880f977d96b7DE75aD64Fc25696cC5b549d0'};
    const poolIcons = {'compound':compoundIcon, 'aave':aaveIcon, 'uniswap':uniswapIcon };
    const [selectedPools, setSelectedPools] = useState([]);
    const [isPoolSelected, setIsPoolSelected] = useState({compound:false, aave:false, uniswap:false});
    const [compoundTransactSelected, setCompoundTransactSelected] = useState({lend: false, borrow:false});
    const [compoundInput, setCompoundInput] = useState({lend:0, borrow:0})
    const [aaveTransactSelected, setAaveTransactSelected] = useState({lend:false, stream:false});
    const [aaveInput, setAaveInput] = useState({lend:0, stream:""}); 
    const [uniswapTransactSelected, setUniswapTransactSelected]=useState({'DAI':false, 'BAT':false, 'MKR':false, 'OMG':false});
    const [uniswapInput, setUniswapInput] = useState({from:0, to:{'DAI':0, 'BAT':0, 'MKR':0, 'OMG':0}});
    const uniswapTokenAddresses = {'DAI':'0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa', 'USDC':'0x75B0622Cec14130172EaE9Cf166B92E5C112FaFF', 'MKR':'0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD'};
    const [savedTransactionCount, setSavedTransactionCount] = useState(0);
    const [poolInvestPercentages, setPoolInvestPercentages]= useState({compound:0, aave:0, uniswap:0})
    const [compoundError,setCompoundError]=useState(false);
    const [aaveError, setAaveError]=useState(false);
    const [walletError, setWalletError] = useState(false);
    const [uniswapError, setUniswapError] = useState(false);
    

    const updateTransactionCount = () => {
        let compoundCount = 0;
        if(compoundInput.lend!==0 && compoundInput.borrow!==0) compoundCount+=2;
        else if(compoundInput.lend!==0 && compoundInput.borrow===0) compoundCount+=1;
        let aaveCount=0;
        if(aaveInput.lend!==0 && aaveInput.stream!=="") aaveCount+=2;
        else if(aaveInput.lend!==0 && aaveInput.stream=="") aaveCount+=1;
        let uniswapCount=0;
        const uniswapAmts=uniswapInput.to;
        for(const token in uniswapAmts) {
            if(uniswapAmts[token]!==0) {
                uniswapCount++;
            }
        }
        return compoundCount+aaveCount+uniswapCount;
    }

    const updatePoolInvestPercentages = () => {
        const compoundAmt=Number(compoundInput.lend);
        const aaveAmt=Number(aaveInput.lend);
        const uniswapAmt = Number(uniswapInput.from);
        const totalAmt=compoundAmt+aaveAmt+uniswapAmt;
        const poolPercentages = {...poolInvestPercentages};
        poolPercentages.compound= Math.round((compoundAmt/totalAmt)*10000)/100;
        poolPercentages.aave= Math.round((aaveAmt/totalAmt)*10000)/100;
        poolPercentages.uniswap= Math.round((uniswapAmt/totalAmt)*10000)/100;
        setPoolInvestPercentages(poolPercentages);
    }

    useEffect(() => {
        const transCount = updateTransactionCount();
        setSavedTransactionCount(transCount-1);
        updatePoolInvestPercentages();
        console.log(poolInvestPercentages);
    }, [compoundInput, aaveInput, uniswapInput, savedTransactionCount]);

    const updateSelectedPools = pool => {
        let currentPools=[...selectedPools];
        const poolIndex=currentPools.indexOf(pool);
        let updatedSelection = {...isPoolSelected};
        if(poolIndex===-1) {
            updatedSelection[pool]=true;
            setIsPoolSelected(updatedSelection);
            currentPools=[...selectedPools,pool];
            setSelectedPools(currentPools);
        }
        else {
            updatedSelection[pool]=false;
            setIsPoolSelected(updatedSelection);
            currentPools.splice(poolIndex,1);
            setSelectedPools(currentPools);
            if(pool==='compound') {
                const compoundInp={...compoundInput};
                compoundInp.lend=0;
                compoundInp.borrow=0;
                setCompoundInput(compoundInp);
            }
            else if(pool==='aave') {
                const aaveInp = {...aaveInput}
                aaveInp.lend=0;
                aaveInp.stream="";
                setAaveInput(aaveInp);
            }
            else if(pool==='uniswap') {
                const uniswapInp = {...uniswapInput}
                uniswapInp.from=0;
                for(const token in uniswapInp.to) {
                    uniswapInp.to[token]=0;
                }
                setUniswapInput(uniswapInp);
            }
        }
        console.log(selectedPools);
        console.log(isPoolSelected);
    }

    const initiateTransaction = async () => {
        setCompoundError(false);
        setAaveError(false);
        setUniswapError(false);
        setWalletError(false);
        if(!address) 
            return setWalletError("Error: Please connect to portal wallet to initiate any transaction");
        const wallet = new web3.eth.Contract(userWallet.contract.abi, address);
        const poolAddressArray=[];
        const functionHashArray=[];
        // IF COMPOUND SELECTED
        if(isPoolSelected.compound) {
            // IF BORROW WITHOUT LEND THROW ERR
            if(compoundTransactSelected.lend===false && compoundTransactSelected.borrow===true) {
                return setCompoundError('Cannot borrow DAI without lending');
            }
            // IF LEND AND BORROW 
            else if(compoundTransactSelected.lend===true  && compoundTransactSelected.borrow===true) {
                poolAddressArray.push(poolAddresses['compound']);
                const lendValue = Number(compoundInput.lend)*Math.pow(10,18);
                const borrowValue = Number(compoundInput.borrow)*Math.pow(10,18);
                if(lendValue===0)
                    return setCompoundError('Cannot borrow with zero lend amount'); 
                if(borrowValue===0)
                    return setCompoundError('Borrow amount cannot be zero for lend and borrow option'); 
                const funcHash = getDepositAndBorrowCompoundHash(web3, lendValue, borrowValue);
                functionHashArray.push(funcHash);
            }
            // IF ONLY LEND
            else if(compoundTransactSelected.lend===true && compoundTransactSelected.borrow===false) {
                poolAddressArray.push(poolAddresses['compound']);
                const lendValue = Number(compoundInput.lend)*Math.pow(10,18);
                if(lendValue===0)
                    return setCompoundError('Lend amount cannot be zero');
                const funcHash = getDepositHashCompoundAave(web3, lendValue)*Math.pow(10,18);
                functionHashArray.push(funcHash);
            }
        }

        // IF AAVE SELECTED
        console.log(isPoolSelected);
        if(isPoolSelected.aave) {
            // IF ONLY STREAM
            if(aaveTransactSelected.lend===false && aaveTransactSelected.stream===true) {
                console.log('here');
                return setAaveError('Need to lend amount, to be able to stream interest to an address');
            }
            // IF LEND AND STREAM
            else if(aaveTransactSelected.lend===true && aaveTransactSelected.stream===true) {
                poolAddressArray.push(poolAddresses['aave']);
                const lendValue = Number(aaveInput.lend)*Math.pow(10,18);
                const streamAddress = aaveInput.stream;
                if(lendValue===0) 
                    return setAaveError('Lend amount cannot be zero for Lend and Stream option' );
                if(streamAddress==="")
                    return setAaveError('Stream address needs to be specified for Lend and Stream option');
                const funcHash=getDepositAndStreamAaveHash(web3, lendValue, streamAddress);
                functionHashArray.push(funcHash);
            }
            // IF ONLY LEND
            else if(aaveTransactSelected.lend===true && aaveTransactSelected.stream===false) {
                poolAddressArray.push(poolAddresses['aave']);
                const lendValue = Number(aaveInput.lend)*Math.pow(10,18);
                if(lendValue===0) 
                    return setAaveError('Cannot lend zero amount');
                const funcHash=getDepositHashCompoundAave(web3, lendValue);
                functionHashArray.push(funcHash);
            }
        }

        // IF UNISWAP SELECTED
        if(isPoolSelected.uniswap) {
            const toAmts = uniswapInput.to;
            for(const token in toAmts) {
                const swapAmt=Number(toAmts[token]);
                if(swapAmt>0) {
                    const funcHash = getUniswapSwapHash(web3, swapAmt*Math.pow(10,18), uniswapTokenAddresses[token] );
                    poolAddressArray.push(poolAddresses['uniswap']);
                    functionHashArray.push(funcHash);
                }
            }
        }

        await wallet.methods.execute([...poolAddressArray], [...functionHashArray]).send({ from: window.ethereum.selectedAddress, value: 2*Math.pow(10,17).toString() });
        console.log('Pool Address');
        console.log(poolAddressArray);
        console.log('Function Hashes');
        console.log(functionHashArray)
        
    };


    
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
                <UserInfo address={address} balances={balances} />
                <div id="select-pools">Select Protocols to invest</div>
                <div id="supported-pools"> 
                    {supportedPools.map((pool, index) => 
                        <div className="pool" 
                            key={index}
                            style={poolStyles(pool)}
                            onClick={() => updateSelectedPools(pool)}
                            
                        >
                            <img className="pool-img" src={poolIcons[pool]} alt={pool} />
                        </div>
                    )}
                </div>
                { (isPoolSelected['compound'] || isPoolSelected['aave'] || isPoolSelected['uniswap']) &&
                    <div id="transact-info-div">
                        <div><SavedTransactionsChart  savedTransactionCount={savedTransactionCount}/></div>
                        <div><PoolPercentageChart poolInvestPercentages={poolInvestPercentages}/></div>
                    </div>
                }
                <div id="selected-pool-container">
                       { isPoolSelected['compound'] && 
                            <CompoundDash 
                                transactSelected={compoundTransactSelected}
                                setTransactSelected={setCompoundTransactSelected}
                                amounts={compoundInput}
                                setAmounts={setCompoundInput}
                                error={compoundError}
                            />
                       }
                       { isPoolSelected['aave'] && 
                            <AaveDash 
                                transactSelected={aaveTransactSelected}
                                setTransactSelected={setAaveTransactSelected}
                                fields={aaveInput}
                                setFields={setAaveInput}
                                error={aaveError}
                            />
                        }
                       {isPoolSelected['uniswap'] && 
                            <UniswapDash 
                                selectedTokens={uniswapTransactSelected}
                                setSelectedTokens={setUniswapTransactSelected}
                                amounts={uniswapInput}
                                setAmounts={setUniswapInput}
                                error={uniswapError}
                                setError={setUniswapError}
                            />
                        }
                </div>
                <div className="error-div">{walletError}</div>
                <div style={{textAlign:'center', margin:'50px 0 100px 0'}}>
                        <button className="deposit-btn"
                                onClick={initiateTransaction}
                        >
                            Transact
                        </button>
                </div>
                <Footer />
           </Fragment>
}

export default TransactionDashboard;