import express from "express";
import cors from "cors";
import crypto from "crypto";
import fs from "fs";

const PORT = 8080;
const DATABASE_FILE = 'database.json';
const BACKUP_FILE = 'backup.json';
const app = express();

app.use(cors());
app.use(express.json());

interface Database {
  data: string;
  hash: string;
}

const readDatabase = (): Database => {
  const data = fs.readFileSync(DATABASE_FILE, 'utf8');
  return JSON.parse(data);
};

const writeDatabase = (database: Database): void => {
  fs.writeFileSync(DATABASE_FILE, JSON.stringify(database, null, 2));
};

const readBackup = (): Database => {
  const data = fs.readFileSync(BACKUP_FILE, 'utf8');
  return JSON.parse(data);
};

const writeBackup = (database: Database): void => {
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(database, null, 2));
};

const generateHash = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

const initializeDatabase = (): void => {
  let database = readDatabase();
  if (!database.hash) {
    database.hash = generateHash(database.data);
    writeDatabase(database);
  }
  
  let backup = readBackup();
  if (!backup.hash) {
    backup.data = database.data;
    backup.hash = database.hash;
    writeBackup(backup);
  }
};

initializeDatabase();

// Routes

app.get("/", (req, res) => {
  const database = readDatabase();
  res.json(database);
});

app.post("/", (req, res) => {
  const database = readDatabase();
  database.data = req.body.data;
  database.hash = generateHash(database.data);
  writeDatabase(database);
  
  const backup = readBackup();
  backup.data = database.data;
  backup.hash = database.hash;
  writeBackup(backup);
  
  res.sendStatus(200);
});

app.get("/verify", (req, res) => {
  const database = readDatabase();
  const currentHash = generateHash(database.data);
  res.json({ valid: currentHash === database.hash });
});

app.post("/recover", (req, res) => {
  const backup = readBackup();
  const database = readDatabase();
  
  database.data = backup.data;
  database.hash = backup.hash;
  writeDatabase(database);
  
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
