import { ethers } from "ethers";
import { parseAndStoreLog } from "../events/handler.js";
import dotenv from "dotenv";
dotenv.config();

export function startNeonListener() {
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL_NEON);
const abi = [
  "event Announcement(uint256 indexed schemeId, address indexed stealthAddress, address indexed caller, bytes ephemeralPubKey, bytes metadata)",
  "event MetaAddressRegistered(string indexed id, bytes indexed metaAddress)"
];
const iface = new ethers.Interface(abi);
const chain = "neon";

const txHashesToWatch = [
  "0xdb0794c1c92c161aa09d40b5822c80c98d58d92e39eed101649433871022619b"
];

const seen = new Set();

async function checkReceipts() {
  for (const txHash of txHashesToWatch) {
    if (seen.has(txHash)) continue;

    try {
      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt) return;

      for (const log of receipt.logs) {
        try {
          await parseAndStoreLog(log, iface, chain);
          seen.add(txHash);
        } catch {}
      }
    } catch (err) {
      console.error("Greška:", err.message);
    }
  }
}

setInterval(checkReceipts, 1000000);
}