import { ethers } from "ethers";
import { parseAndStoreLog } from "../events/handler.js";
import dotenv from "dotenv";
dotenv.config();

export function startPolkadotListener() {
  (async () => {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL_POLKADOT, 420420421);

    const abi = [
      "event Announcement(uint256 indexed schemeId, address indexed stealthAddress, address indexed caller, bytes ephemeralPubKey, bytes metadata)",
      "event MetaAddressRegistered(string indexed id, bytes indexed metaAddress)"
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS_POLKADOT, abi, provider);
    const iface = new ethers.Interface(abi);
    const chain = "polkadot";

    let lastBlockChecked = await provider.getBlockNumber();
    console.log("📡 Polling Polkadot logs...");

    setInterval(async () => {
      try {
        const currentBlock = await provider.getBlockNumber();

        const announcementLogs = await contract.queryFilter("Announcement", lastBlockChecked + 1, currentBlock);
        for (const log of announcementLogs) {
          await parseAndStoreLog(log, iface, chain);
        }

        const metaAddressLogs = await contract.queryFilter("MetaAddressRegistered", lastBlockChecked + 1, currentBlock);
        for (const log of metaAddressLogs) {
          await parseAndStoreLog(log, iface, chain);
        }

        lastBlockChecked = currentBlock;
      } catch (err) {
        console.error(`Polkadot polling error: ${err.message}`);
      }
    }, 10_000);
  })();
}
