import React from 'react';
// Material-UI imports
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import compoundIcon from '../icons/pools/compound.png';

function CompoundDash({transactSelected, setTransactSelected, amounts, setAmounts, error, setTransactionCount}) {

    const handleTransactSelected = e => {
        setTransactSelected({...transactSelected,[e.target.name]:e.target.checked});
        if(!e.target.checked) {
            setAmounts({...amounts, [e.target.name]:0});
        }
    };

    const handleAmtsChange = e => {
        if(e.target.name==='lend-amt')
            setAmounts({...amounts, lend:e.target.value});
        else
            setAmounts({...amounts, borrow:e.target.value});
    }

    return <div className="selected-pool" >
                <img className="pool-img" src={compoundIcon} alt="compound-pool-icon" />
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
                                onChange={handleAmtsChange}
                                value={amounts.lend}
                                name="lend-amt"
                            />
                        }
                        <FormControlLabel
                            control={<Switch checked={transactSelected.borrow} onChange={handleTransactSelected} name="borrow" />}
                            label={<span style={{color:'#fff', fontSize:'20px' }}>Borrow</span>}
                        />
                        {transactSelected.borrow && 
                            <input type="number" min={0}
                                className="lend-borrow-amt-input"
                                onChange={handleAmtsChange}
                                value={amounts.borrow}
                                name="borrow-amt"
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

export default CompoundDash;