import { getSimpleAccount } from "./simpleAccount";
import { ethers } from "ethers";
import config from "./config.json";

const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);

const getAddress = async () => {
  const accountAPI = getSimpleAccount(
    provider,
    config.signingKey,
    config.entryPoint,
    config.simpleAccountFactory
  );
  const address = await accountAPI.getCounterFactualAddress();
  return address;
};

const isContractAddress = async (address) => {
  try {
    // Validate the address
    ethers.utils.getAddress(address);

    // Get the contract bytecode at the given address
    const bytecode = await provider.getCode(address);

    // Return true if the bytecode is non-empty, indicating a contract address
    return bytecode !== "0x";
  } catch (error) {
    console.error("Error checking if address is a contract:", error);
    return false;
  }
};

const getAccountBalance = async (address) => {
  try {
    // Validate the address
    ethers.utils.getAddress(address);

    // Get the balance in wei (smallest unit of Ether)
    const balanceWei = await provider.getBalance(address);
    const balanceEth = ethers.utils.formatEther(balanceWei);

    return balanceEth;
  } catch (error) {
    console.error("Error getting Ether balance:", error);
    return null;
  }
};
export { getAddress, isContractAddress, getAccountBalance };
