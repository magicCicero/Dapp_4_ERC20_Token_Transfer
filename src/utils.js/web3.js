import { ethers } from "ethers";
import CiceroTokenABI from "../../abi/dummyToken.abi.json";

function getWeb3Provider() {
    if (window.ethereum) {
        return new ethers.providers.Web3Provider(window.ethereum);
    }
    return null;
}

export const provider = getWeb3Provider();

export const CICERO_TOKEN_ADDRESS = import.meta.env.VITE_CICERO_TOKEN_ADDRESS;
export const CICERO_TOKEN = new ethers.Contract(
    CICERO_TOKEN_ADDRESS,
    CiceroTokenABI
);
