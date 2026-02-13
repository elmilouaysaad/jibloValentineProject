const { readVotes, computeStats } = require("./_store");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const data = readVotes();
  return res.json({ ok: true, stats: computeStats(data.votes) });
};
