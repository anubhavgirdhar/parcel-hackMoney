let config = {};
// COMPOUND
// config.contract = {
//     address: "0x03157A8cCDCE1E032f7F0CbC6a5662FF6d7f1Ad5",
//     abi: [
//         {
//             "constant": false,
//             "inputs": [],
//             "name": "deposit",
//             "outputs": [],
//             "payable": true,
//             "stateMutability": "payable",
//             "type": "function"
//         },
//         {
//             "constant": true,
//             "inputs": [],
//             "name": "getHash",
//             "outputs": [
//                 {
//                     "internalType": "bytes",
//                     "name": "",
//                     "type": "bytes"
//                 }
//             ],
//             "payable": false,
//             "stateMutability": "view",
//             "type": "function"
//         }
//     ]
// }

// UNISWAP
config.contract = {
    address: "0xE22B993e06431Ef1f88fb26aad610201acDa7Be6",
    abi: [
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
        }
    ]
}

export default config;