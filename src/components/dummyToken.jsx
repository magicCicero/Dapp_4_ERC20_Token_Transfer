import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { DUMMY_TOKEN, DUMMY_TOKEN_ADDRESS, provider } from "../web3";

const getBalanceAndClaimed = async account => {
    const dummyToken = DUMMY_TOKEN.connect(provider);
    const [balance] = await Promise.all([
        dummyToken.balanceOf(account)
    ]);
    return [ethers.utils.formatEther(balance)];
};

const addDummyTokenToMetaMask = async () => {
    if (!window.ethereum) {
        return false;
    }
    try {
        await window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC20",
                options: {
                    address: DUMMY_TOKEN_ADDRESS,
                    symbol: "CSTK",
                    decimals: 18,
                },
            },
        });
    } catch (error) {
        console.error(error);
    }
};

const DummyToken = ({ account }) => {
    const [balance, setBalance] = useState("");
    const [claimed, setClaimed] = useState(false);
    const [receiverAddress, setReceiverAddress] = useState("");
    const [tokenAmount, setTokenAmount] = useState("");
    
    const transferToken = async () => {
        const signer = provider.getSigner();
        const dummyToken = DUMMY_TOKEN.connect(signer);
        // const amount = ethers.utils.formatEther(tokenAmount, "wei");
        const tx = await dummyToken.transfer(receiverAddress, tokenAmount.toString());
        const receipt = await tx.wait();
        console.log(receipt);

        getBalanceAndClaimed(account, provider)
            .then(([balance, claimed]) => {
                setBalance(balance);
                setClaimed(claimed);
            })
            .catch(console.error);
    };

    useEffect(() => {
        getBalanceAndClaimed(account, provider)
            .then(([balance, claimed]) => {
                setBalance(balance);
                setClaimed(claimed);
            })
            .catch(console.error);
    }, [provider, account]);

    if (!balance) {
        return (
            <div>
                <h2>Dummy Token</h2>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Dummy Token</h2>

            <div>
                <p>
                    <strong>DummyToken balance:</strong> {balance} CSTK
                </p>
                
                <button onClick={addDummyTokenToMetaMask}>Add to MetaMask</button>
            </div>

            <div>
                <p>
                    <strong>Token transfer:</strong>
                </p>
                <input onChange={(e) => setReceiverAddress(e.target.value)} /> address
                <input onChange={(e) => setTokenAmount(e.target.value)} /> amount
                <button onClick={transferToken}>Transfer</button>
            </div>
        </div>
    );
};

export default DummyToken;
