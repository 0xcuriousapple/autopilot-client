import { ethers } from "ethers";
import { getSimpleAccount } from "./simpleAccount";

import config from "./config.json";
import { HttpRpcClient } from "@account-abstraction/sdk/dist/src/HttpRpcClient";

const getHttpRpcClient = async (provider, bundlerUrl, entryPointAddress) => {
  const chainId = await provider.getNetwork().then((net) => net.chainId);
  return new HttpRpcClient(bundlerUrl, entryPointAddress, chainId);
};

const toJSON = async (op) =>
  ethers.utils.resolveProperties(op).then((userOp) =>
    Object.keys(userOp)
      .map((key) => {
        let val = userOp[key];
        if (typeof val !== "string" || !val.startsWith("0x")) {
          val = ethers.utils.hexValue(val);
        }
        return [key, val];
      })
      .reduce(
        (set, [k, v]) => ({
          ...set,
          [k]: v,
        }),
        {}
      )
  );

const printOp = async (op) => {
  return toJSON(op).then((userOp) => JSON.stringify(userOp, null, 2));
};

const getGasFee = async (provider) => {
  const [fee, block] = await Promise.all([
    provider.send("eth_maxPriorityFeePerGas", []),
    provider.getBlock("latest"),
  ]);
  const tip = ethers.BigNumber.from(fee);
  const buffer = tip.div(100).mul(13);
  const maxPriorityFeePerGas = tip.add(buffer);
  const maxFeePerGas = block.baseFeePerGas
    ? block.baseFeePerGas.mul(2).add(maxPriorityFeePerGas)
    : maxPriorityFeePerGas;

  return { maxFeePerGas, maxPriorityFeePerGas };
};

const transfer = async (t, amt) => {
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);

  const accountAPI = getSimpleAccount(
    provider,
    config.signingKey,
    config.entryPoint,
    config.simpleAccountFactory
  );

  const target = ethers.utils.getAddress(t);
  const value = ethers.utils.parseEther(amt);
  const op = await accountAPI.createSignedUserOp({
    target,
    value,
    data: "0x",
    ...(await getGasFee(provider)),
  });
  console.log(`Signed UserOperation: ${await printOp(op)}`);

  const client = await getHttpRpcClient(
    provider,
    config.bundlerUrl,
    config.entryPoint
  );
  const uoHash = await client.sendUserOpToBundler(op);
  console.log(`UserOpHash: ${uoHash}`);

  console.log("Waiting for transaction...");
  const txHash = await accountAPI.getUserOpReceipt(uoHash);
  console.log(`Transaction hash: ${txHash}`);
};
export { transfer };
