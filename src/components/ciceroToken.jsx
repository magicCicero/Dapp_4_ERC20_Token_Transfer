import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { CICERO_TOKEN, CICERO_TOKEN_ADDRESS, provider } from "../web3";
import { Box, Typography, Button, TextField, CircularProgress, Snackbar, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions,} from "@mui/material";

const CiceroToken = ({ account }) => {
  const [balance, setBalance] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferStatus, setTransferStatus] = useState({ success: null, message: "" });
  const [gasFee, setGasFee] = useState(null); 
  const [showModal, setShowModal] = useState(false); 

  const isAddressValid = (address) => ethers.utils.isAddress(address);

  const getBalanceAndClaimed = async (account) => {
    const ciceroToken = CICERO_TOKEN.connect(provider);
    const [balance] = await Promise.all([
      ciceroToken.balanceOf(account),
    ]);
    return [ethers.utils.formatEther(balance)];
  };

  const addCiceroTokenToMetaMask = async () => {
    if (!window.ethereum) {
      setTransferStatus({ success: false, message: "MetaMask is not available." });
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
      setTransferStatus({ success: true, message: "Cicero Token added to MetaMask!" });
    } catch (error) {
      console.error(error);
      setTransferStatus({ success: false, message: "Failed to add token to MetaMask." });
    }
  };

  const estimateGasFee = async () => {
    try {
      const signer = provider.getSigner();
      const ciceroToken = CICERO_TOKEN.connect(signer);

      const gasEstimate = await ciceroToken.estimateGas.transfer(
        receiverAddress,
        ethers.utils.parseEther(tokenAmount)
      );

      const gasPrice = await provider.getGasPrice();
      const gasFee = gasEstimate.mul(gasPrice);
      setGasFee(ethers.utils.formatEther(gasFee));
      setShowModal(true); 
    } catch (error) {
      console.error("Gas estimation failed:", error);
      setTransferStatus({ success: false, message: "Failed to estimate gas fee." });
    }
  };

  const transferToken = async () => {
    setShowModal(false);

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
      setTransferStatus({ success: true, message: "Transfer successful!" });
      setReceiverAddress("");
      setTokenAmount("");
    } catch (error) {
      console.error(error);
      setTransferStatus({ success: false, message: "Transfer failed. Check the console for details." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getBalanceAndClaimed(account)
      .then(([balance]) => {
        if (isMounted) setBalance(balance);
        setBalance(balance);
      })
      .catch(console.error);
      
      return () => {
        isMounted = false; // Cleanup
      };
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
          sx={{ mb: 2 }}
        />
        {!isAddressValid(receiverAddress) && receiverAddress && (
          <Typography color="error" sx={{ mb:2, mt:-1 }}>
            Invalid Ethereum address
          </Typography>
        )}
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
          onClick={estimateGasFee}
          disabled={loading || !receiverAddress || !isAddressValid(receiverAddress) || !tokenAmount || parseFloat(tokenAmount) <= 0
          }
          >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Transfer"}
        </Button>
      </Box>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle sx={{ color: "#000" }} >Confirm Transfer</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 3 }}>
            Estimated Gas Fee: <strong style={{ color: "#000" }}>{gasFee} ETH</strong>
          </Typography>
          <Typography>
            Receiver: <strong style={{ color: "#000" }}>{receiverAddress}</strong>
          </Typography>
          <Typography>
            Amount: <strong style={{ color: "#000" }}>{tokenAmount} CSTK</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => setShowModal(false)} // Close modal without transferring
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={transferToken} // Proceed with the transfer
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={transferStatus.message !== ""}
        autoHideDuration={4000}
        onClose={() => setTransferStatus({ success: null, message: "" })}
      >
        <Alert
          onClose={() => setTransferStatus({ success: null, message: "" })}
          severity={transferStatus.success ? "success" : "error"}
        >
          {transferStatus.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default CiceroToken;
