import React, { useState } from 'react';
import './UniswapDash.css';
import uniswapIcon from '../../icons/pools/uniswap.png';
import daiIcon from '../../icons/tokens/DAI.svg';
import batIcon from '../../icons/tokens/BAT.svg';
import mkrIcon from '../../icons/tokens/MKR.svg';
import omgIcon from '../../icons/tokens/OMG.svg';

function UniswapDash({selectedTokens, setSelectedTokens, amounts, setAmounts, error, setError}) {

    const tokenStyles = token => {
        if(!selectedTokens[token]) return null;
        return {backgroundColor:'#03255A', color:'#fff'};
    }
    
    const supportedTokens = ['DAI', 'BAT', 'MKR', 'OMG'];
    const tokenIcons = {'DAI':daiIcon, 'BAT':batIcon, 'MKR':mkrIcon, 'OMG':omgIcon};
    const [toPercent, setToPercent] = useState({'DAI':0, 'BAT':0, 'MKR':0, 'OMG':0});
    const [totalToAmt, setTotalToAmt] = useState(0);

    const noTokenSelected = () => {
        for(const token in selectedTokens) {
            if(selectedTokens[token]===true)
                return false;
        }
        return true;
    }

    const _getTotalToAmts = amountsObj => {
        const currentToAmts = amountsObj.to;
        let totalToAmt=0;
        for(const token in currentToAmts) {
            totalToAmt+=Number(currentToAmts[token]);
        }
        return totalToAmt;
    }

    const updateSelectedTokens = token => {
        const currentSelection = {...selectedTokens};
        currentSelection[token] = !currentSelection[token];
        setSelectedTokens(currentSelection);
        console.log(selectedTokens);
    };

    const handleAmtsChange = (e,token) => {
        setError(false);
        if(e.target.name==='fromAmt') {
            const currentAmts = {...amounts};
            currentAmts.from=e.target.value;
            setAmounts(currentAmts);
        }
        else {
            const toAmt=Number(e.target.value);
            const currentAmts={...amounts};
            currentAmts.to[token]=toAmt;
            setAmounts(currentAmts);
            const currentToPercents={...toPercent};
            const percentage=(toAmt/Number(currentAmts.from))*100;
            currentToPercents[token]=Math.round(percentage*100)/100;
            setToPercent(currentToPercents);
            const totaltoAmt=_getTotalToAmts(amounts);
            setTotalToAmt(totaltoAmt);
            if(totaltoAmt>Number(amounts.from)) {
                setError('Send amount can\'t be greater that from amount');
            }
        }
    }

    const handleToPercentChange = (e, token) => {
        const percentage=Math.round(Number(e.target.value)*100)/100;
        const currentToPercents = {...toPercent};
        currentToPercents[token]=percentage;
        setToPercent(currentToPercents);
        const currentAmts={...amounts};
        const toAmt = (Number(currentAmts.from)*percentage)/100;
        currentAmts.to[token]=Math.round(toAmt*100000000)/1000000000;
        setAmounts(currentAmts);
        console.log(token);
        console.log(toPercent);
        console.log(amounts);
        const totaltoAmt=_getTotalToAmts(amounts);
        setTotalToAmt(totaltoAmt);
        if(totaltoAmt>Number(amounts.from)) {
            setError('Send amount can\'t be greater that from amount');
        }
    }

    return <div className="selected-pool" id="uniswap-pool" >
                <img className="pool-img" src={uniswapIcon} alt="uniswap-pool-icon" />
                <form id="form-div">
                    <label className="form-div-item">From</label>
                    <input className="form-div-item" 
                           type="number" 
                           min={0}
                           onChange={handleAmtsChange}
                           value={amounts.from}
                           name="fromAmt"
                    /> 
                    {/* {amounts.from} */}
                    <span className="form-div-item">ETH</span>
                </form>
                <div id="select-tokens">Select Tokens</div>
                <div id="supported-tokens">
                    {supportedTokens.map((token, index) => 
                        <div className="token" 
                             key={index}
                             style={tokenStyles(token)}
                             name={token}
                             onClick={() => updateSelectedTokens(token)}
                        >
                            <img className="token-img" src={tokenIcons[token]} alt={token} />
                            <span>{token}</span>
                        </div>
                    )}
                </div>
                {!noTokenSelected() &&
                <table id="token-table">
                    <thead>
                        <tr className="token-table-header">
                            <th>Token</th>
                            <th>Allocation</th>
                            <th>ETH to be Swapped</th>
                            <th>Estimated Tokens</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(selectedTokens).map( (token, index) => {
                            if(selectedTokens[token]!==false) 
                                return <tr key={index} className="token-table-row">
                                        <td className="token-cell">
                                            {token}
                                        </td>
                                        <td className="range-cell">
                                            <input  type="range" value={toPercent[token]}
                                                    min="0" max="100"
                                                    onChange={e => handleToPercentChange(e, token)}
                                            />
                                            <label>{Math.round(toPercent[token]*100)/100}</label>
                                        </td>
                                        <td className="number-cell">
                                            <input type="number"
                                                   min={0} 
                                                   value={amounts.to[token]===0 ? "" : amounts.to[token]}
                                                   onChange={e => handleAmtsChange(e, token)}
                                                   name="toAmt"
                                            />
                                        </td>
                                        <td>300</td>
                                    </tr>
                        })}
                    <tr className="token-table-header">
                    <td>Total</td>
                    <td colSpan="5" style={totalToAmt > amounts.from ? {color:'red'}: {}}> {totalToAmt}</td>   
                    </tr>
                    </tbody>
                    
                </table>
                }
                <div className="error-div">{error}</div>
            </div>
}

export default UniswapDash;