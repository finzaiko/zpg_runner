const cfg = require("../profile/config.json");
const { Pool } = require("pg");
const pool = new Pool(cfg.db);

const baseDir = `${cfg.path}`;

module.exports = { pool, baseDir };
