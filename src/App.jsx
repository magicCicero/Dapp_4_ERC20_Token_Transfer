import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import CiceroToken from "./components/ciceroToken";
import { provider } from "./utils/web3";
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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <CircularProgress size={20} />
                <Typography>Loading balance...</Typography>
            </Box>
        );
    }
    return (
        <Typography variant="h6" sx={{ mt: 2 }}>
            Balance: <strong>{balance}</strong> tETH
        </Typography>
    );
};

function App() {
    const [account, setAccount] = useState(null);
    const [hasMetaMask, setHasMetaMask] = useState(true);

    const requestAccounts = async () => {
        if (!window.ethereum) {
            setHasMetaMask(false);
            return null;
        }
        try {
            const [account] = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccount(account);
            localStorage.setItem("connectedAccount", account); 
            return account;
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            alert("Could not connect to wallet. Please try again.");
            return null;
        }
    };

    const disconnectWallet = () => {
        setAccount(null); // Clear the account state
        localStorage.removeItem("connectedAccount"); // Remove saved account from localStorage
        alert("Wallet disconnected.");
    };

    useEffect(() => {
        const initialize = async () => {
            const savedAccount = localStorage.getItem("connectedAccount");
    
            if (savedAccount) {
                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                if (accounts.length === 0) {
                    localStorage.removeItem("connectedAccount");
                    setAccount(null);
                } else {
                    setAccount(savedAccount);
                }
            }
        };
        initialize().catch(console.error);
    }, []);

    return (
        <Box sx={{ p: 3, textAlign: "center", mt: 5 }}>
            <Typography variant="h3" sx={{ mb: 3 }}>
                Dapp for ERC-20 Token Transfer
            </Typography>

            {account ? (
                <>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Account: &nbsp; <code>{account}</code>
                    </Typography>
                    <Button 
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={disconnectWallet}
                        sx={{ mt: 2 }}
                    >
                        Disconnect Wallet
                    </Button>
                </>
            ) : (<Box>
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={requestAccounts}
                        sx={{ mb: 3, display: hasMetaMask ? "inline-box" : "none" }}
                    >
                        Connect Wallet
                    </Button>
                    <Typography sx={{ display: hasMetaMask ? "none" : "block", color: "red" }}>
                        Please install MetaMask to connect your wallet and try again...
                    </Typography>
                </Box>
            )}

            {provider && account && (
                <Box sx={{ mt: 4 }}>
                    <Balance account={account} />
                    <CiceroToken account={account} />
                </Box>
            )}
        </Box>
    );
}

export default App;
