/**
 * Client service to communicate with CarbonIQ's server-side Groq AI endpoints
 * (Only GROQ_API_KEY is used for AI generation).
 */

export interface GroqStatus {
  configured: boolean;
  model: string;
  provider: string;
}

export async function checkGroqStatus(): Promise<GroqStatus> {
  try {
    const res = await fetch('/api/groq/status');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      configured: false,
      model: 'llama-3.3-70b-versatile',
      provider: 'Groq Cloud',
    };
  }
}

export async function fetchGroqOptimizationInsights(params: {
  budget: number;
  actions: any[];
  totalCost: number;
  totalCo2Saved: number;
}): Promise<{ success: boolean; insights: string; error?: string }> {
  try {
    const res = await fetch('/api/groq/optimize-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      insights: '',
      error: err.message || 'Failed to reach Groq endpoint',
    };
  }
}

export async function fetchGroqSteelAnalysis(params: {
  usageKwh: number;
  lagReactKvarh: number;
  leadReactKvarh: number;
  lagPowerFactor: number;
  loadType: string;
  predictedCo2: number;
}): Promise<{ success: boolean; advice: string; error?: string }> {
  try {
    const res = await fetch('/api/groq/steel-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      advice: '',
      error: err.message || 'Failed to reach Groq endpoint',
    };
  }
}

export async function fetchGroqAuditSummary(params: {
  facility: string;
  scope1Tons: number;
  scope2Tons: number;
  scope3Tons: number;
  totalTons: number;
  logCount: number;
}): Promise<{ success: boolean; statement: string; error?: string }> {
  try {
    const res = await fetch('/api/groq/audit-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      statement: '',
      error: err.message || 'Failed to reach Groq endpoint',
    };
  }
}
