import React from 'react';
import './UserInfo.css';
import UserHoldingChart from '../UserHoldingChart';

function UserInfo({address, balances}) {

    return <div id="user-container">
                <div id="wallet-div">
                    <h3 className="title">Wallet</h3>
                    <p class="content">{address ? address: <span style={{color:'red'}}>Wallet not connected</span>}</p>
                    <p class="content">{address ? (Math.round(balances['ETH']*10000)/10000)+'ETH' : ""}</p>
                </div>
                <div id="token-balances-container">
                    <div id="balances-div">
                        <h3 className="title">Holdings</h3>
                        {Object.keys(balances).map((token, index) => {
                                return <p className="content" key={index}>{token} : {balances[token]}</p>
                        }
                        )}
                    </div>
                    <div id="user-holding-chart-div">
                       {address && <UserHoldingChart balances={balances} />}
                    </div>
                </div>
           </div>;
}

export default UserInfo;













