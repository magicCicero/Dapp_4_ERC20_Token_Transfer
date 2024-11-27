import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { CICERO_TOKEN, CICERO_TOKEN_ADDRESS, provider } from "../web3";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";

const getBalanceAndClaimed = async (account) => {
  const ciceroToken = CICERO_TOKEN.connect(provider);
  const [balance] = await Promise.all([
    ciceroToken.balanceOf(account),
  ]);
  return [ethers.utils.formatEther(balance)];
};

const addCiceroTokenToMetaMask = async () => {
  if (!window.ethereum) {
    return false;
  }
  try {
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: CICERO_TOKEN_ADDRESS,
          symbol: "CSTK",
          decimals: 18,
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const CiceroToken = ({ account }) => {
  const [balance, setBalance] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const transferToken = async () => {
    try {
      setLoading(true);
      const signer = provider.getSigner();
      const ciceroToken = CICERO_TOKEN.connect(signer);
      const tx = await ciceroToken.transfer(
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
          Cicero Token
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
          onClick={addCiceroTokenToMetaMask}
        >
          Add to MetaMask
        </Button>
      </Box>

      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0px 4px 18px 3px rgb(0 0 0)",
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

export default CiceroToken;
