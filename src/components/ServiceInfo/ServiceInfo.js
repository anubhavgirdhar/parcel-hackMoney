import React from 'react';
import './ServiceInfo.css';
import swapIcon from '../../icons/swap.svg';
import transactionIcon from '../../icons/transaction.svg'
import compoundIcon from '../../icons/pools/compound.png';
import aaveIcon from '../../icons/pools/aave.png';
import uniswapIcon from '../../icons/pools/uniswap.png';

function ServiceInfo({serviceIconName, serviceName, serviceDesc, bgColor}) {
    const imageSource = serviceIconName==='uniswap' ? swapIcon : transactionIcon;
    let stepIcon;
    if(serviceIconName==='uniswap') 
        stepIcon=uniswapIcon;
    else if(serviceIconName==='compound')
        stepIcon=compoundIcon;
    else if(serviceIconName==='aave')
        stepIcon=aaveIcon;

    return  <div className="steps-item" style={{backgroundColor:bgColor}}>
                <div className="steps-icon"><img src={stepIcon} alt={serviceIconName} /> </div>
                <div className="steps-title">
                    <img src={imageSource} alt="service-img"/>
                    {serviceName}
                </div>
                <div className="steps-description">{serviceDesc}</div>
            </div> 
}

export default ServiceInfo;