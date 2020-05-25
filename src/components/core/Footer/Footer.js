import React from 'react';
import './Footer.css';
import copyrightLogo from '../../../icons/copyright.png';

function Footer({style}) {
    return <div style={style} id="footer-div">
                <span>Copyrights</span>
                <img id="copyright-logo" src={copyrightLogo} alt="copyright-logo" />
                <span>2020 Parcel</span>
            </div>
}

export default Footer;