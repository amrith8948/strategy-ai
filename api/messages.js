/**
 * Vercel Serverless Function — Anthropic API Proxy
 * Route: /api/v1/messages  →  https://api.anthropic.com/v1/messages
 *
 * This exists because browsers can't call Anthropic directly from a
 * deployed Vercel app (no proxy like Vite's devServer provides locally).
 * The API key is passed from the client in the x-api-key header.
 */
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Grab the API key the client sent
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ error: "Missing x-api-key header" });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": req.headers["anthropic-version"] || "2023-06-01",
        // forward the direct-browser-access header if present
        ...(req.headers["anthropic-dangerous-direct-browser-access"] && {
          "anthropic-dangerous-direct-browser-access":
            req.headers["anthropic-dangerous-direct-browser-access"],
        }),
      },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();

    // Mirror Anthropic's status code
    return res.status(upstream.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Proxy request failed", detail: err.message });
  }
}
