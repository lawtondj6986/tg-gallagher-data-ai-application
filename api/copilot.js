/* =============================================================================
   /api/copilot — optional live AI endpoint (Vercel serverless function).
   The site works fully WITHOUT this (the frontend falls back to grounded,
   pre-written answers). Deploy to Vercel and set ANTHROPIC_API_KEY to make the
   Project Copilot answer for real, grounded in the platform context below.
   ========================================================================== */

const SYSTEM = `You are "Project Copilot", an executive data assistant for TG Gallagher,
a ~$250-300M New England mechanical contractor (HVAC, plumbing, fire protection).
You answer questions about the enterprise data & AI platform prototype and its
illustrative portfolio data. Be concise, executive, and specific. Use construction
language (WIP, job cost, cost codes, change orders, margin, field productivity).
When you state a number, name a plausible source system (Vista, Procore, Trimble,
the semantic layer). Keep answers under 130 words. If asked something outside the
platform/portfolio, steer back to data, AI, or the roadmap.

Key illustrative facts you may use:
- Signed backlog $412.6M; projected gross margin 18.7%; under-billed WIP $9.42M;
  open change orders $5.85M; field productivity index 1.06x.
- At-risk jobs: Northeastern ISEC II (Critical, margin 11.7% vs 16.5% bid),
  Moderna Norwood (At Risk, 14.1% vs 17.5%), Takeda Process Utilities (Watch).
- Largest unfavorable cost-code variance: 23 64 Chilled Water Plant, -4.7%.
- Architecture: governed medallion (bronze/silver/gold) + semantic layer on
  Snowflake; RAG copilots; row-level security throughout.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { res.status(200).json({ answer: null }); return; } // signal fallback

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const question = (body && body.question ? String(body.question) : "").slice(0, 600);
  if (!question) { res.status(400).json({ error: "no question" }); return; }

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
        max_tokens: 400,
        system: SYSTEM,
        messages: [{ role: "user", content: question }],
      }),
    });
    if (!resp.ok) { res.status(200).json({ answer: null }); return; }
    const data = await resp.json();
    const answer = (data.content || []).map((b) => b.text || "").join("").trim();
    res.status(200).json({ answer: answer || null, cite: "Claude · live · grounded to platform context" });
  } catch (e) {
    res.status(200).json({ answer: null });
  }
};
