import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import DummyToken from "./components/dummyToken";
import { provider } from "./web3";
import { Button, Box, Typography, CircularProgress } from "@mui/material";

const Balance = ({ account }) => {
    const [balance, setBalance] = useState("");

    useEffect(() => {
        const getBalance = async () => {
            const balance = await provider.getBalance(account);
            return ethers.utils.formatEther(balance);
        };
        getBalance().then(setBalance).catch(console.error);
    }, [account]);

    if (!balance) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} />
                <Typography>Loading balance...</Typography>
            </Box>
        );
    }
    return (
        <Typography variant="body1" sx={{ mt: 2 }}>
            Balance: <strong>{balance}</strong> tETH
        </Typography>
    );
};

function App() {
    const [account, setAccount] = useState(null);

    const checkAccounts = async () => {
        if (!window.ethereum) {
            return null;
        }
        const [account] = await window.ethereum.request({
            method: "eth_accounts",
        });
        window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0]);
        });
        return account;
    };

    const requestAccounts = async () => {
        if (!window.ethereum) {
            return null;
        }
        const [account] = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        return account;
    };

    useEffect(() => {
        checkAccounts().then(setAccount).catch(console.error);
    }, []);

    return (
        <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Dapp for ERC-20 Token Transfer
            </Typography>

            {account ? (
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Account: <code>{account}</code>
                </Typography>
            ) : (
                <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={requestAccounts}
                    sx={{ mb: 3 }}
                >
                    Request Accounts
                </Button>
            )}

            {provider && account && (
                <Box sx={{ mt: 4 }}>
                    <Balance account={account} />
                    <DummyToken account={account} />
                </Box>
            )}
        </Box>
    );
}

export default App;
