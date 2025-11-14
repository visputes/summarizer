import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize text");
      }

      setSummary(data.summary || "No summary generated.");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "50px auto", fontFamily: "Arial" }}>
      <h1>🧠 Text Summarizer</h1>
      <textarea
        rows="8"
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        placeholder="Paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <button
        onClick={handleSummarize}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          ⚠️ {error}
        </p>
      )}

      {summary && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
