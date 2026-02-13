const fs = require("fs");
const path = require("path");

const dataFile = path.join(process.env.VERCEL ? "/tmp" : path.join(__dirname, "..", "server", "data"), "votes.json");

function ensureDataFile() {
  const dir = path.dirname(dataFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ votes: [] }, null, 2));
  }
}

function readVotes() {
  try {
    ensureDataFile();
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
  ensureDataFile();
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

module.exports = {
  readVotes,
  writeVotes,
  computeStats
};
