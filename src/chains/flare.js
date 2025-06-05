import { ethers } from "ethers";
import { parseAndStoreLog } from "../events/handler.js";
import dotenv from "dotenv";
dotenv.config();

export function startFlareListener() {
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL_FLARE);
const abi = [
  "event Announcement(uint256 indexed schemeId, address indexed stealthAddress, address indexed caller, bytes ephemeralPubKey, bytes metadata)",
  "event MetaAddressRegistered(string indexed id, bytes indexed metaAddress)"
];

const iface = new ethers.Interface(abi);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS_FLARE, abi, provider);
const chain = "flare";

console.log("👂 Listening for contract events on Flare...\n");

contract.on("Announcement", async (schemeId, stealthAddress, caller, ephemeralPubKey, metadata) => {
  try {
    await parseAndStoreLog({
      name: "Announcement",
      args: { schemeId, stealthAddress, caller, ephemeralPubKey, metadata }
    }, null, chain);
  } catch (err) {
    console.error(`❌ Failed to parse/store log on ${chain}:`, err.message);
  }
});

contract.on("MetaAddressRegistered", async (id, metaAddress) => {
  try {
    await parseAndStoreLog({
      name: "MetaAddressRegistered",
      args: { id, metaAddress }
    }, null, chain);
  } catch (err) {
    console.error(`❌ Failed to parse/store log on ${chain}:`, err.message);
  }
});
}