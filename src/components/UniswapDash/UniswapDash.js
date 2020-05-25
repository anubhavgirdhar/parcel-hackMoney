import React, { useState } from 'react';
import { initWeb3, initContract } from '../../contractInterfaces/init';
import './UniswapDash.css';
import { uniswap } from '../../contractInterfaces/uniswap';
import uniswapIcon from '../../icons/pools/uniswap.png';
import daiIcon from '../../icons/tokens/DAI.svg';
// import batIcon from '../../icons/tokens/BAT.svg';
import mkrIcon from '../../icons/tokens/MKR.svg';
// import omgIcon from '../../icons/tokens/OMG.svg';
import usdcIcon from '../../icons/tokens/USDC.png'
function UniswapDash({ selectedTokens, setSelectedTokens, amounts, setAmounts, error, setError }) {

    const tokenStyles = token => {
        if (!selectedTokens[token]) return null;
        return { backgroundColor: '#03255A', color: '#fff' };
    }

    const supportedTokens = ['DAI', 'MKR', 'USDC'];
    const tokenIcons = { 'DAI': daiIcon, 'MKR': mkrIcon, 'USDC': usdcIcon };
    const [toPercent, setToPercent] = useState({ 'DAI': 0, 'MKR': 0, 'USDC': 0 });
    const [totalToAmt, setTotalToAmt] = useState(0);
    const [tokensPerEth, setTokensPerEth] = useState({ 'DAI': 0, 'MKR': 0, 'USDC': 0 })
    const tokenAddObj = { 'DAI': '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa', 'USDC': '0x75B0622Cec14130172EaE9Cf166B92E5C112FaFF', 'MKR': '0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD' };


    const noTokenSelected = () => {
        for (const token in selectedTokens) {
            if (selectedTokens[token] === true)
                return false;
        }
        return true;
    }

    const _getTotalToAmts = amountsObj => {
        const currentToAmts = amountsObj.to;
        let totalToAmt = 0;
        for (const token in currentToAmts) {
            totalToAmt += Number(currentToAmts[token]);
        }
        return totalToAmt;
    }

    const updateSelectedTokens = token => {
        const currentSelection = { ...selectedTokens };
        currentSelection[token] = !currentSelection[token];
        setSelectedTokens(currentSelection);
        console.log(selectedTokens);
    };

    const handleAmtsChange = async (e, token) => {
        setError(false);
        if (e.target.name === 'fromAmt') {
            const currentAmts = { ...amounts };
            currentAmts.from = e.target.value;
            setAmounts(currentAmts);
        }
        else {
            const toAmt = Number(e.target.value);
            const currentAmts = { ...amounts };
            currentAmts.to[token] = toAmt;
            setAmounts(currentAmts);
            const currentToPercents = { ...toPercent };
            const percentage = (toAmt / Number(currentAmts.from)) * 100;
            currentToPercents[token] = Math.round(percentage * 100) / 100;
            setToPercent(currentToPercents);
            const tokensforEth = { ...tokensPerEth };
            const web3 = await initWeb3();
            const uniswapContract = initContract(web3, uniswap.contract.abi, uniswap.contract.address);
            const tokenExValue = await uniswapContract.methods.getAmount(["0xd0A1E359811322d97991E03f863a0C30C2cF029C", tokenAddObj[token]], (1 * Math.pow(10, 18)).toString()).call();
            const divFactor = token === 'USDC' ? Math.pow(10, 6) : Math.pow(10, 18);
            tokensforEth[token] = Number(tokenExValue[1]) / divFactor;
            setTokensPerEth(tokensforEth);
            const totaltoAmt = _getTotalToAmts(amounts);
            setTotalToAmt(totaltoAmt);
            if (totaltoAmt > Number(amounts.from)) {
                setError('Send amount can\'t be greater that from amount');
            }
        }
    }

    const handleToPercentChange = (e, token) => {
        const percentage = Math.round(Number(e.target.value) * 100) / 100;
        const currentToPercents = { ...toPercent };
        currentToPercents[token] = percentage;
        setToPercent(currentToPercents);
        const currentAmts = { ...amounts };
        const toAmt = (Number(currentAmts.from) * percentage) / 100;
        currentAmts.to[token] = Math.round(toAmt * 100000000) / 1000000000;
        setAmounts(currentAmts);
        console.log(token);
        console.log(toPercent);
        console.log(amounts);
        const totaltoAmt = _getTotalToAmts(amounts);
        setTotalToAmt(totaltoAmt);
        if (totaltoAmt > Number(amounts.from)) {
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
                        <th>Amount in ETH</th>
                        <th>Tokens Swapped</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(selectedTokens).map((token, index) => {
                        if (selectedTokens[token] !== false)
                            return <tr key={index} className="token-table-row">
                                <td className="token-cell">
                                    {token}
                                </td>
                                <td className="range-cell">
                                    <input type="range" value={toPercent[token]}
                                        min="0" max="100"
                                        onChange={e => handleToPercentChange(e, token)}
                                    />
                                    <label>{Math.round(toPercent[token] * 100) / 100}</label>
                                </td>
                                <td className="number-cell">
                                    <input type="number"
                                        min={0}
                                        value={amounts.to[token]}
                                        onChange={e => handleAmtsChange(e, token)}
                                        name="toAmt"
                                    />
                                </td>
                                <td>{tokensPerEth[token] * Number(amounts.to[token])}</td>
                            </tr>
                    })}
                    <tr className="token-table-header">
                        <td>Total</td>
                        <td colSpan="5" style={totalToAmt > Number(amounts.from) ? { color: 'red' } : {}}> {totalToAmt}</td>
                    </tr>
                </tbody>

            </table>
        }
        <div className="error-div">{error}</div>
    </div>
}

export default UniswapDash;