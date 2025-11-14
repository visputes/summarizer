export default function handler(req, res) {
  return res.status(200).json({
    env_key: process.env.HF_API_KEY ? "LOADED" : "NOT LOADED",
  });
}