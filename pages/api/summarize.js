export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text input is required." });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res
        .status(500)
        .json({ error: data.error || "Failed to generate summary" });
    }

    const summary = data[0]?.summary_text || "No summary generated.";
    return res.status(200).json({ summary });
  } catch (error) {
    console.error("Error summarizing:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}