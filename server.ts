import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

// Lazy initialization for Groq client using GROQ_API_KEY only
let groqInstance: Groq | null = null;
function getGroq(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is required. Please add it to your .env file or environment settings.");
  }
  if (!groqInstance) {
    groqInstance = new Groq({ apiKey });
  }
  return groqInstance;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes

  // Health and Groq config status
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      aiProvider: "Groq (Llama 3 70B)",
      hasGroqApiKey: !!process.env.GROQ_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // Check Groq status
  app.get("/api/groq/status", (req, res) => {
    res.json({
      configured: !!process.env.GROQ_API_KEY,
      model: "llama3-70b-8192",
      provider: "Groq Cloud",
    });
  });

  // 1. Groq Carbon Budget & Mitigation Strategy
  app.post("/api/groq/optimize-insights", async (req, res) => {
    try {
      const { budget, actions, totalCost, totalCo2Saved } = req.body;
      const client = getGroq();

      const prompt = `You are CarbonIQ's Chief Sustainability & Linear Programming AI Engine.
The facility is running a PuLP 0-1 Knapsack budget optimization for carbon abatement with:
- Total CapEx Budget: ₹${budget || 400000}
- Allocated Cost: ₹${totalCost || 0}
- Total CO2 Abatement: ${totalCo2Saved || 0} tCO2/year
- Interventions: ${JSON.stringify(actions || [])}

Provide a concise, 3-bullet executive briefing:
1. Economic & Abatement Frontier Analysis (ROI per ton of CO2)
2. Operational priority for implementation order
3. Recommendation for un-funded actions in the next fiscal budget`;

      const completion = await client.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are an expert industrial carbon mitigation engineer and LP optimization analyst." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const reply = completion.choices[0]?.message?.content || "No insights generated.";
      res.json({ success: true, insights: reply, model: "llama3-70b-8192" });
    } catch (err: any) {
      console.error("Groq optimize error:", err?.message);
      res.status(err?.message?.includes("GROQ_API_KEY") ? 401 : 500).json({
        success: false,
        error: err?.message || "Failed to call Groq API",
      });
    }
  });

  // 2. Groq ESG Audit Commentary
  app.post("/api/groq/audit-summary", async (req, res) => {
    try {
      const { facility, scope1Tons, scope2Tons, scope3Tons, totalTons, logCount } = req.body;
      const client = getGroq();

      const prompt = `Write a formal ESG audit compliance statement for:
Facility: ${facility || "Jamshedpur Works (Plant #4)"}
Scope 1 Direct: ${scope1Tons || 0} tCO2e
Scope 2 Indirect (Electricity): ${scope2Tons || 0} tCO2e
Scope 3 Value Chain: ${scope3Tons || 0} tCO2e
Total: ${totalTons || 0} tCO2e
Total Activity Records: ${logCount || 0}
Standard: GHG Protocol Corporate Standard & BRSR Core (SEBI India)

Provide a 2-paragraph formal auditor statement assessing verification readiness, hotspot attribution, and regulatory alignment.`;

      const completion = await client.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are an ISO 14064 certified GHG inventory auditor." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 600,
      });

      const statement = completion.choices[0]?.message?.content || "Audit statement generated.";
      res.json({ success: true, statement, model: "llama3-70b-8192" });
    } catch (err: any) {
      console.error("Groq audit error:", err?.message);
      res.status(err?.message?.includes("GROQ_API_KEY") ? 401 : 500).json({
        success: false,
        error: err?.message || "Failed to call Groq API",
      });
    }
  });

  // 3. Summarize calculated activity forecasts and portfolio impact for Reports & Audit.
  app.post("/api/groq/report-summary", async (req, res) => {
    try {
      const { facility, totalKg, dailyKg, observedDays, annualSavingsTons, totalCost, selectedActions, scenarios, suggestions } = req.body;
      const client = getGroq();
      const prompt = `Create a concise executive carbon report for ${facility}. Use only these calculated workspace facts; do not invent measurements, costs, or compliance claims.
Observed emissions: ${totalKg} kgCO2e across ${observedDays} days; daily run-rate ${dailyKg} kgCO2e/day.
Optimized portfolio: ₹${totalCost}, ${annualSavingsTons} tCO2e/year, projects: ${JSON.stringify(selectedActions)}.
1-day/1-week/1-month scenarios: ${JSON.stringify(scenarios)}.
Evidence-informed recommendations: ${JSON.stringify(suggestions)}.
Give: baseline and projected reduction, lowest-cost implementation order, and one audit data-quality action. Keep it under 180 words and make clear this is a forecast.`;
      const completion = await client.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [{ role: "system", content: "You are a practical industrial decarbonization analyst. Be precise and transparent about uncertainty." }, { role: "user", content: prompt }],
        temperature: 0.2, max_tokens: 450,
      });
      res.json({ success: true, summary: completion.choices[0]?.message?.content || "No summary generated." });
    } catch (err: any) {
      console.error("Groq report summary error:", err?.message);
      res.status(err?.message?.includes("GROQ_API_KEY") ? 401 : 500).json({ success: false, error: err?.message || "Failed to call Groq API" });
    }
  });

  // Static production serving vs development Vite middleware
  const isProd = process.env.NODE_ENV === "production" || process.env.RENDER === "true";
  const distPath = path.join(process.cwd(), "dist");
  const hasBuiltDist = fs.existsSync(path.join(distPath, "index.html"));

  if (isProd && hasBuiltDist) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CarbonIQ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
