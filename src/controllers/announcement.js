import { db } from "../db/index.js";

export const getAnnouncementsByChain = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM announcements_info WHERE chain_name = $1 ORDER BY id DESC LIMIT 50",
      [req.params.chainName.toLowerCase()]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching announcements:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMetaAddressesByChain = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM meta_addresses WHERE chain_name = $1 ORDER BY id DESC LIMIT 50",
      [req.params.chainName.toLowerCase()]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching meta addresses:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
