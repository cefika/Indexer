import dotenv from "dotenv";
dotenv.config();

import { startSepoliaListener } from "./chains/sepolia.js";
import { startNeonListener } from "./chains/neonevm.js";
import { startFlareListener } from "./chains/flare.js";
import { startPolkadotListener } from "./chains/polkadot.js";

console.log("🚀 Starting chain event listeners...\n");

startSepoliaListener();
startNeonListener();
startFlareListener();
startPolkadotListener();
