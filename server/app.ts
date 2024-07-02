import express from "express";
import cors from "cors";
import crypto from "crypto";
import fs from "fs";

const PORT = 8080;
const app = express();
const database = { data: "Hello World", hash: "" };

const generateHash = (data: string) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

const backupData = () => {
  fs.writeFileSync('backup.json', JSON.stringify(database));
};

const restoreData = () => {
  const backup = JSON.parse(fs.readFileSync('backup.json', 'utf8'));
  database.data = backup.data;
  database.hash = backup.hash;
};

database.hash = generateHash(database.data);

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  database.data = req.body.data;
  database.hash = generateHash(database.data);
  backupData();
  res.sendStatus(200);
});

app.get("/verify", (req, res) => {
  const currentHash = generateHash(database.data);
  res.json({ valid: currentHash === database.hash });
});

app.post("/recover", (req, res) => {
  restoreData();
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
