const uniswap={};
uniswap.contract={
    
    address:'0xdf5C7B397B1132f4dDBf3CC232191fA40489Fc98',
    abi:[
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address[]",
                    "name": "path",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256",
                    "name": "amountInEth",
                    "type": "uint256"
                }
            ],
            "name": "swap",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address[]",
                    "name": "path",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256",
                    "name": "amountInEth",
                    "type": "uint256"
                }
            ],
            "name": "getAmount",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address[]",
                    "name": "path",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256",
                    "name": "amountInEth",
                    "type": "uint256"
                }
            ],
            "name": "getHash",
            "outputs": [
                {
                    "internalType": "bytes",
                    "name": "",
                    "type": "bytes"
                }
            ],
            "payable": false,
            "stateMutability": "pure",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "uniswapRouterAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
}

export {uniswap};