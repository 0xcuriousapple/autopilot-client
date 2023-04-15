import axios from "axios";
import { ethers } from "ethers";

export const importEtherscanTX = async (link) => {
  const res = await getTransactionDetails(link);
  console.log({ res });
};

const API_KEY = "V7H5EGUF556B4BEWT4UWNAW8PD2FPIMXD2";

async function getContractAbi(contractAddress) {
  const apiUrl = `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    if (response.data.status === "1") {
      return JSON.parse(response.data.result);
    } else {
      console.log("Failed to fetch ABI:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching contract ABI:", error);
    return null;
  }
}

async function getTransactionDetails(etherscanTransactionLink) {
  const txHash = etherscanTransactionLink.split("/").pop();
  const apiUrl = `https://api-goerli.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const transaction = response.data.result;

    if (transaction) {
      const contractAddress = transaction.to;
      const contractAbi = await getContractAbi(contractAddress, API_KEY);

      const inputData = transaction.input;
      const functionSelector = inputData.slice(0, 10);
      const paramsData = inputData.slice(10);
      const functionParams = [];

      for (let i = 0; i < paramsData.length; i += 64) {
        functionParams.push(paramsData.slice(i, i + 64));
      }

      if (contractAbi) {
        const contractInterface = new ethers.utils.Interface(contractAbi);
        const functionFragment =
          contractInterface.getFunction(functionSelector);
        console.log("Function Name:", functionFragment.name);
        console.log(
          "Function Parameters:",
          contractInterface.decodeFunctionData(functionFragment, inputData)
        );
        // TODO: handle result
      } else {
        console.log(
          "Unable to fetch ABI for contract address",
          contractAddress
        );
      }

      console.log("Target (To Address):", transaction.to);
      console.log("Value (ETH):", parseInt(transaction.value, 16) / 10 ** 18);
      console.log("Input Data:", inputData);
      console.log("Function Selector:", functionSelector);
    } else {
      console.log("Transaction not found");
    }
  } catch (error) {
    console.error("Error fetching transaction details:", error);
  }
}
