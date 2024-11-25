import { ethers } from "ethers";
import DummyTokenABI from "../abi/dummyToken.abi.json";

function getWeb3Provider() {
    if (window.ethereum) {
        return new ethers.providers.Web3Provider(window.ethereum);
    }
    return null;
}

export const provider = getWeb3Provider();

export const DUMMY_TOKEN_ADDRESS = import.meta.env.VITE_DUMMY_TOKEN_ADDRESS;
export const DUMMY_TOKEN = new ethers.Contract(
    DUMMY_TOKEN_ADDRESS,
    DummyTokenABI
);
