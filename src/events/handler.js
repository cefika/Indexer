import { ethers } from "ethers";
import { db } from "../db/index.js";

export const parseAndStoreLog = async (log, iface, chainName) => {
  try {
    let parsed;

    if (log.name && log.args) {
      parsed = log; // već parsirano iz ethers `contract.on`
    } else {
      parsed = iface.parseLog(log); // klasičan log iz queryFilter
    }

    if (parsed.name === "Announcement") {
      const { schemeId, stealthAddress, caller, ephemeralPubKey, metadata } = parsed.args;

      await db.insertAnnouncement({
        schemeId: schemeId.toString(),
        stealthAddress,
        caller,
        R: ethers.hexlify(ephemeralPubKey),
        metadata: ethers.hexlify(metadata),
        chainName
      });

      console.log(`✅ [${chainName}] Stored Announcement: ${stealthAddress}`);
    }

    else if (parsed.name === "MetaAddressRegistered") {
      const { id, metaAddress } = parsed.args;

      await db.insertMetaAddress({
        id,
        metaAddress: typeof metaAddress === "object" && metaAddress.hash ? metaAddress.hash : ethers.hexlify(metaAddress),
        chainName
      });

      console.log(`✅ [${chainName}] Stored MetaAddressRegistered: ${id}`);
    }
  } catch (err) {
    console.error(`❌ Failed to parse/store log on ${chainName}:`, err.message);
  }
};
