import { ethers } from "ethers";
import { getSimpleAccount } from "./simpleAccount";

import config from "./config.json";
import { HttpRpcClient } from "@account-abstraction/sdk/dist/src/HttpRpcClient";

import autopilotABI from "../abi/autopilot.json";
import { formatBytes32String } from "ethers/lib/utils";

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

const authorise = async (t, botAddress, nodes) => {
  console.log({ nodes });
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);

  const wallet = new ethers.Wallet(config.signingKey, provider);
  const signer = wallet.provider.getSigner(wallet.address);

  const accountAPI = getSimpleAccount(
    provider,
    config.signingKey,
    config.entryPoint,
    config.simpleAccountFactory
  );

  const autopilotInterface = new ethers.utils.Interface(autopilotABI);
  const target = ethers.utils.getAddress(t);
  const contract = new ethers.Contract(target, autopilotABI, signer);
  const authedBot = await contract.bot();

  if (authedBot !== botAddress) {
    const op = await accountAPI.createSignedUserOp({
      target,
      value: 0,
      data: autopilotInterface.encodeFunctionData("setBot", [botAddress]),
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
  }

  let cadenceNode,
    customNodes = [];
  for (const node of nodes) {
    if (!node.type || node.type === "TRIGGER") {
      continue;
    }
    if (node.type === "CADENCE") {
      cadenceNode = node;
      continue;
    }
    customNodes.push(node);
  }
  let callHash;

  if (customNodes && customNodes.length) {
    console.log({ customNodes });
    for (const customNode of customNodes) {
      const {
        data: {
          target: transferTarget,
          value: transferValue,
          functionSelector,
        },
      } = customNode;
      const {
        data: { count, cadence },
      } = cadenceNode;
      const mult = strToTS(cadence);
      autopilotInterface.encodeFunctionData("setBot", [botAddress]);
      const encoded = ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256", "bytes"],
        [transferTarget, transferValue, functionSelector]
      );

      callHash = ethers.utils.keccak256(encoded);
      console.log({ callHash });

      const op = await accountAPI.createSignedUserOp({
        target,
        value: 0,
        data: autopilotInterface.encodeFunctionData("addAllowedCall", [
          callHash,
          count,
          mult,
        ]),
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
    }
  }
};

const strToTS = (str) => {
  const [amountStr, type] = str.split("-");
  const amount = parseInt(amountStr);
  console.log({ amount, type });
  let mult;
  switch (type) {
    case "s":
      mult = 1;
      break;
    case "m":
      mult = 60;
      break;
    case "h":
      mult = 60 * 60;
      break;
    case "d":
      mult = 60 * 60 * 24;
      break;
    case "w":
      mult = 60 * 60 * 24 * 7;
      break;
    case "mo":
      mult = 60 * 60 * 24 * 30;
      break;
    case "y":
      mult = 60 * 60 * 24 * 30 * 12;
      break;
    default:
      mult = 1;
      break;
  }
  return mult * amount;
};
export { transfer, authorise };
