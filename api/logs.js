const { readVotes } = require("./_store");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const data = readVotes();
  const recent = data.votes.slice(-200).reverse();
  return res.json({ ok: true, votes: recent });
};
