const { readVotes, writeVotes, computeStats } = require("./_store");

async function parseJsonBody(req) {
  if (req.body) {
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch (err) {
        return null;
      }
    }
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  if (!chunks.length) {
    return null;
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

module.exports = async (req, res) => {
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

  const body = await parseJsonBody(req);
  const choice = body?.choice;
  if (choice !== "yes" && choice !== "no") {
    return res.status(400).json({ ok: false, error: "invalid_choice" });
  }

  const timestamp = body?.timestamp || new Date().toISOString();
  const meta = body?.meta ?? null;
  const entry = { choice, timestamp, meta };

  const data = readVotes();
  data.votes.push(entry);
  writeVotes(data);

  return res.json({ ok: true, stats: computeStats(data.votes) });
};
