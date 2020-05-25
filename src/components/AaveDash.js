import React from 'react';
// Material-UI imports
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import aaveIcon from '../icons/pools/aave.png';

function AaveDash({transactSelected, setTransactSelected, fields, setFields, error}) {

    const handleTransactSelected = e => {
        setTransactSelected({...transactSelected,[e.target.name]:e.target.checked});
        if(!e.target.checked) {
            const value = e.target.name==='lend-amt' ? 0 : ""
            setFields({...fields, [e.target.name]:value});
        }
    };

    const handleFieldChange = e => {
        if(e.target.name==='lend-amt')
            setFields({...fields, lend:e.target.value});
        else
            setFields({...fields, stream:e.target.value});
    }

    return <div className="selected-pool" >
                <img className="pool-img" src={aaveIcon} alt="aave-pool-icon" />
                <div>
                    {/* Material-UI switch start */}
                    <FormControl component="fieldset">
                    <FormLabel component="legend"
                            style={{color:'#fff', fontSize:'18px', marginBottom:'12px'}}
                    >
                        Select Transaction(s)
                    </FormLabel>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={transactSelected.lend} onChange={handleTransactSelected} name="lend" />}
                            label={<span style={{color:'#fff', fontSize:'20px' }}>Lend</span>}
                        />
                        {transactSelected.lend && 
                            <input type="number" min={0}
                                className="lend-borrow-amt-input"
                                onChange={handleFieldChange}
                                value={fields.lend}
                                name="lend-amt"
                            />
                        }
                        <FormControlLabel
                            control={<Switch checked={transactSelected.stream} onChange={handleTransactSelected} name="stream" />}
                            label={<span style={{color:'#fff', fontSize:'20px' }}>Stream</span>}
                        />
                        {transactSelected.stream && 
                            <input type="text"
                                className="lend-borrow-amt-input"
                                onChange={handleFieldChange}
                                value={fields.stream}
                                name="stream-add"
                            />
                        }
                    </FormGroup>
                    <FormHelperText style={{color:'#fff', fontSize:'12px'}}>Choose one or both</FormHelperText>
                    </FormControl>
                    {/* Material-UI switch end */}
                    <div className="error-div">{error}</div>
                </div>
            </div>
}

export default AaveDash;