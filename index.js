const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "*";

const dataDir = path.join(__dirname, "server", "data");
const dataFile = path.join(dataDir, "votes.json");

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ votes: [] }, null, 2));
  }
}

function readVotes() {
  try {
    const raw = fs.readFileSync(dataFile, "utf8");
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.votes)) {
      return { votes: [] };
    }
    return data;
  } catch (err) {
    return { votes: [] };
  }
}

function writeVotes(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function computeStats(votes) {
  let yes = 0;
  let no = 0;
  for (const vote of votes) {
    if (vote.choice === "yes") {
      yes += 1;
    } else if (vote.choice === "no") {
      no += 1;
    }
  }
  return {
    yes,
    no,
    total: yes + no
  };
}

ensureDataFile();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

app.use(express.json({ limit: "100kb" }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.post("/api/vote", (req, res) => {
  const choice = req.body?.choice;
  if (choice !== "yes" && choice !== "no") {
    return res.status(400).json({ ok: false, error: "invalid_choice" });
  }

  const timestamp = req.body?.timestamp || new Date().toISOString();
  const meta = req.body?.meta ?? null;
  const entry = { choice, timestamp, meta };

  const data = readVotes();
  data.votes.push(entry);
  writeVotes(data);

  return res.json({ ok: true, stats: computeStats(data.votes) });
});

app.get("/api/stats", (req, res) => {
  const data = readVotes();
  return res.json({ ok: true, stats: computeStats(data.votes) });
});

app.get("/api/logs", (req, res) => {
  const data = readVotes();
  const recent = data.votes.slice(-200).reverse();
  return res.json({ ok: true, votes: recent });
});

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
  return res.sendFile(path.join(__dirname, "admin.html"));
});

app.listen(PORT, () => {
  console.log(`Vote server running at http://localhost:${PORT}`);
});
