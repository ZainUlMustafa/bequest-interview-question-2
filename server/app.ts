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

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
