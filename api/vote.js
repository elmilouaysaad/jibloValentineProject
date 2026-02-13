const { readVotes, writeVotes, computeStats } = require("./_store");

module.exports = (req, res) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

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
};
