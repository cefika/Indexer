import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = {
  query: (...args) => pool.query(...args),

  insertAnnouncement: async ({ schemeId, stealthAddress, caller, R, metadata, chainName }) => {
    try {
      await pool.query(
        `INSERT INTO announcements_info (scheme_id, stealth_address, caller, R, metadata, chain_name)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [schemeId, stealthAddress, caller, R, metadata, chainName]
      );
    } catch (err) {
      console.error("❌ Error inserting announcement:", err.message);
    }
  },

  insertMetaAddress: async ({ id, metaAddress, chainName }) => {
    try {
      await pool.query(
        `INSERT INTO meta_addresses (id, meta_address, chain_name)
         VALUES ($1, $2, $3)`,
        [id, metaAddress, chainName]
      );
    } catch (err) {
      console.error("❌ Error inserting meta address:", err.message);
    }
  },
};
