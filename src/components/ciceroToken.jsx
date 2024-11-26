import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { DUMMY_TOKEN, DUMMY_TOKEN_ADDRESS, provider } from "../web3";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";

const getBalanceAndClaimed = async (account) => {
  const dummyToken = DUMMY_TOKEN.connect(provider);
  const [balance] = await Promise.all([
    dummyToken.balanceOf(account),
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
  const [receiverAddress, setReceiverAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const transferToken = async () => {
    try {
      setLoading(true);
      const signer = provider.getSigner();
      const dummyToken = DUMMY_TOKEN.connect(signer);
      const tx = await dummyToken.transfer(
        receiverAddress,
        ethers.utils.parseEther(tokenAmount)
      );
      await tx.wait();

      const [updatedBalance] = await getBalanceAndClaimed(account);
      setBalance(updatedBalance);
      setReceiverAddress("");
      setTokenAmount("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBalanceAndClaimed(account)
      .then(([balance]) => {
        setBalance(balance);
      })
      .catch(console.error);
  }, [account]);

  if (!balance) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dummy Token
        </Typography>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading balance...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, p: 3, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Cicero Token
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          <strong>Balance:</strong> {balance} CSTK
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={addDummyTokenToMetaMask}
        >
          Add to MetaMask
        </Button>
      </Box>

      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 10,
          backgroundColor: "background.paper",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Token Transfer
        </Typography>
        <TextField
          fullWidth
          label="Receiver Address"
          variant="filled"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          sx={{ 
            mb: 2,
         }}
        />
        <TextField
          fullWidth
          label="Amount"
          variant="filled"
          type="number"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          onClick={transferToken}
          disabled={loading || !receiverAddress || !tokenAmount}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Transfer"}
        </Button>
      </Box>
    </Box>
  );
};

export default DummyToken;
