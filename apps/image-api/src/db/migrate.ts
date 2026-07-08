import fs from "fs";
import path from "path";
import pg from "pg";
import { config } from "../config";

async function migrate() {
  const sql = fs.readFileSync(
    path.join(__dirname, "migrations", "001_init.sql"),
    "utf8",
  );
  const client = new pg.Client({ connectionString: config.databaseUrl });
  await client.connect();
  await client.query(sql);

  const admin = config.adminGithubUsername;
  await client.query(
    `INSERT INTO users (github_username, role)
     VALUES ($1, 'admin')
     ON CONFLICT (github_username) DO UPDATE SET role = 'admin'`,
    [admin],
  );

  await client.end();
  console.log("Migrations applied.");
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
