# **ERC-20 Token DApp: CiceroToken**

This project is a decentralized application (DApp) that allows users to connect their wallet, view their balance, and transfer ERC-20 tokens.

---

## **Features**
1. **ERC-20 Token Deployment**:
   - A custom ERC-20 token (CSTK) is deployed on the **Sepolia Testnet** or another testnet of your choice.

2. **Wallet Connection**:
   - Users can connect and disconnect their wallet via MetaMask.
   - Wallet state persists across page refreshes.

3. **Balance Display**:
   - Users can view both their native Ethereum balance (`ETH`) and their custom ERC-20 token balance (`CSTK`).

4. **Token Transfers**:
   - Users can transfer tokens to any valid Ethereum address.
   - Includes validation for recipient address and token amount.

5. **Gas Fee Estimation**:
   - Gas fees are estimated before executing a transfer.
   - Users are shown a confirmation modal with the estimated gas fee before proceeding.

6. **Error Handling**:
   - Graceful error handling for wallet connection, gas fee estimation, and token transfers.
   - Feedback is displayed via Snackbar notifications.

---

## **Tech Stack**
- **Frontend**: React, Material-UI
- **Blockchain Library**: ethers.js
- **Wallet Integration**: MetaMask
- **Backend**: ERC-20 token deployed on Sepolia Testnet

---

## **Getting Started**

### **Prerequisites**
1. **Node.js**:
   - Ensure you have Node.js installed on your system. [Download Node.js](https://nodejs.org/)
   - Check installation:
     ```bash
     node -v
     npm -v
     ```

2. **MetaMask Wallet**:
   - Install the MetaMask browser extension from [here](https://metamask.io/).
   - Create a wallet if you don't already have one and connect to the **Sepolia Testnet** (or the testnet you used for deployment).

---

### **Setup Instructions**
Follow these steps to run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/magicCicero/Dapp_4_ERC20_Token_Transfer.git
   cd Dapp_4_ERC20_Token_Transfer

2. Install dependencies:
   ```bash
   npm install

3. Start the application:
   ```bash
   npm run dev

4. Open your browser and navigate to:
  http://localhost:5173/

### **How to Use**

1. **Connect Wallet**:
   - Open the application and click **"Connect Wallet"**.
   - Ensure your wallet is connected to the **Sepolia Testnet**.

2. **View Balances**:
   - After connecting, you can view your ETH balance and CSTK token balance.

3. **Send Tokens**:
   - Enter the recipient's Ethereum address and the token amount.
   - Click **"Transfer"**.
   - Review the estimated gas fee in the confirmation modal and confirm the transaction.

4. **Disconnect Wallet**:
   - Click **"Disconnect Wallet"** to log out and clear your wallet session.
