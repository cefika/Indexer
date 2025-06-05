import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { getAnnouncementsByChain, getMetaAddressesByChain } from "./controllers/announcement.js";
import { startSepoliaListener } from "./chains/sepolia.js";
import { startNeonListener } from "./chains/neonevm.js";
import { startFlareListener } from "./chains/flare.js";
import { startPolkadotListener } from "./chains/polkadot.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("🟢 API is live."));
app.get("/announcements/:chainName", getAnnouncementsByChain);
app.get("/meta-addresses/:chainName", getMetaAddressesByChain);

app.listen(PORT, () => {
  console.log(`🚀 API is running on http://localhost:${PORT}`);

  // Ovde startuj sve listenere
  console.log("🔄 Starting blockchain event listeners...\n");
  startSepoliaListener();
  startNeonListener();
  startFlareListener();
  startPolkadotListener();
});
