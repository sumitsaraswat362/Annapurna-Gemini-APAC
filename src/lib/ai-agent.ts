// ============================================================
// ANNAPURNA — Agentic AI Decision Engine (Gemini LLM Powered)
// ============================================================
//
// This module integrates with the Gemini API to perform autonomous 
// real-time reasoning on live truck telemetry (temperature, humidity, ethylene).
// Gemini is the PRIMARY decision engine.
// Architecture: The Gemini LLM generates structured JSON containing the 
// recommendation, confidence score, reasoning, and suggested market.
// If the API is unavailable, times out (>5s), or returns invalid JSON,
// the engine gracefully falls back to a deterministic rules engine.
// ============================================================

import { Cargo, AIDecision, Market } from "./types";
import { calculateSpoilageTime } from "./simulator";
import { ai, DEFAULT_MODEL } from "./vertex-client";

/**
 * The Agentic AI analyzes the cargo's current state and makes an
 * autonomous decision: continue delivery, or emergency reroute.
 */
export async function makeDecision(cargo: Cargo): Promise<AIDecision> {
  const { telemetry, safeTemperatureMax, etaMinutes, reroutableMarkets } = cargo;
  const spoilageMinutes = calculateSpoilageTime(
    telemetry.temperature,
    safeTemperatureMax,
    telemetry.ethyleneLevel
  );

  let geminiDecision: any = null;
  
  try {
    const prompt = `Analyze the cargo telemetry and make a routing decision.
Cargo ID: ${cargo.id}
Original Destination: ${cargo.originalDestination?.name || "destination"} (ETA: ${etaMinutes} min)
Telemetry: Temperature ${telemetry.temperature}°C, Humidity ${telemetry.humidity}%, Ethylene ${telemetry.ethyleneLevel}
Safe Temperature Max: ${safeTemperatureMax}°C
Estimated Spoilage Time: ${spoilageMinutes} min

Available Markets for Rerouting:
${JSON.stringify(reroutableMarkets, null, 2)}

Return a JSON object with this exact structure:
{
  "recommendation": "continue" | "reroute" | "emergency_sell",
  "confidence": number,
  "reasoning": "string explanation",
  "suggestedMarketName": "string or null"
}`;

    // Simple timeout promise
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 5000)
    );

    const apiCall = ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result: any = await Promise.race([apiCall, timeout]);
    
    if (result && result.text) {
        geminiDecision = JSON.parse(result.text);
    }
  } catch (e) {
    console.warn("Gemini API failed or timed out, falling back to deterministic rules:", e);
  }

  if (geminiDecision && (geminiDecision.recommendation === 'continue' || geminiDecision.recommendation === 'reroute' || geminiDecision.recommendation === 'emergency_sell')) {
      let suggestedMarket: Market | null = null;
      let estimatedRecoveryPercent = 100;
      let estimatedRecoveryValue = cargo.estimatedCargoValue;
      
      if (geminiDecision.suggestedMarketName && reroutableMarkets) {
          suggestedMarket = reroutableMarkets.find(m => m.name === geminiDecision.suggestedMarketName) || null;
          if (suggestedMarket) {
             estimatedRecoveryPercent = calculateRecoveryPercent(suggestedMarket, spoilageMinutes);
             estimatedRecoveryValue = Math.round(cargo.estimatedCargoValue * (estimatedRecoveryPercent / 100));
          }
      }

      if (geminiDecision.recommendation === 'emergency_sell' && !suggestedMarket) {
          estimatedRecoveryPercent = 20;
          estimatedRecoveryValue = Math.round(cargo.estimatedCargoValue * 0.2);
      } else if (geminiDecision.recommendation === 'continue') {
          if (spoilageMinutes > (etaMinutes ?? 999)) {
             estimatedRecoveryPercent = 90;
             estimatedRecoveryValue = Math.round(cargo.estimatedCargoValue * 0.9);
          } else {
             estimatedRecoveryPercent = 100;
             estimatedRecoveryValue = cargo.estimatedCargoValue;
          }
      }

      return {
        cargoId: cargo.id,
        timestamp: Date.now(),
        reasoning: geminiDecision.reasoning,
        recommendation: geminiDecision.recommendation,
        suggestedMarket: suggestedMarket,
        estimatedRecoveryPercent: estimatedRecoveryPercent,
        estimatedRecoveryValue: estimatedRecoveryValue,
        confidence: geminiDecision.confidence,
      };
  }

  // --- Deterministic Rules Logic ---
  if (telemetry.temperature <= safeTemperatureMax) {
    return {
      cargoId: cargo.id,
      timestamp: Date.now(),
      reasoning: `All systems nominal. Temperature ${telemetry.temperature}°C is within safe range (≤${safeTemperatureMax}°C). Humidity at ${telemetry.humidity}%. Ethylene levels: ${telemetry.ethyleneLevel}. Continuing delivery to ${cargo.originalDestination?.name || "its destination"}.`,
      recommendation: "continue",
      suggestedMarket: null,
      estimatedRecoveryPercent: 100,
      estimatedRecoveryValue: cargo.estimatedCargoValue,
      confidence: 0.95,
    };
  }

  if (spoilageMinutes > (etaMinutes ?? 999)) {
    return {
      cargoId: cargo.id,
      timestamp: Date.now(),
      reasoning: `WARNING: Temperature ${telemetry.temperature}°C exceeds safe limit of ${safeTemperatureMax}°C. However, estimated spoilage in ${spoilageMinutes} minutes. ETA to ${cargo.originalDestination?.name || "its destination"}: ${etaMinutes} minutes. Cargo will survive transit. Continuing delivery with elevated monitoring.`,
      recommendation: "continue",
      suggestedMarket: null,
      estimatedRecoveryPercent: 90,
      estimatedRecoveryValue: Math.round(cargo.estimatedCargoValue * 0.9),
      confidence: 0.75,
    };
  }

  const nearestMarket = findNearestViableMarket(reroutableMarkets, spoilageMinutes);

  if (!nearestMarket) {
    return {
      cargoId: cargo.id,
      timestamp: Date.now(),
      reasoning: `CRITICAL: Cold chain failure detected. Temperature ${telemetry.temperature}°C far exceeds safe limit of ${safeTemperatureMax}°C. Ethylene levels: ${telemetry.ethyleneLevel.toUpperCase()}. Estimated spoilage in ${spoilageMinutes} minutes. ETA to ${cargo.originalDestination?.name || "its destination"}: ${etaMinutes} minutes. NO viable markets found within spoilage window. Cargo at severe risk.`,
      recommendation: "emergency_sell",
      suggestedMarket: null,
      estimatedRecoveryPercent: 20,
      estimatedRecoveryValue: Math.round(cargo.estimatedCargoValue * 0.2),
      confidence: 0.6,
    };
  }

  const recoveryPercent = calculateRecoveryPercent(nearestMarket, spoilageMinutes);
  const recoveryValue = Math.round(cargo.estimatedCargoValue * (recoveryPercent / 100));

  return {
    cargoId: cargo.id,
    timestamp: Date.now(),
    reasoning: `COLD CHAIN FAILURE DETECTED\n\nCurrent temperature: ${telemetry.temperature}°C — exceeds safe limit of ${safeTemperatureMax}°C\nHumidity: ${telemetry.humidity}% | Ethylene: ${telemetry.ethyleneLevel.toUpperCase()}\nETA to ${cargo.originalDestination?.name || "its destination"}: ${etaMinutes} min\nEstimated spoilage in: ${spoilageMinutes} min\n\nCargo WILL NOT survive transit to original destination.\n\nRECOMMENDATION: Emergency reroute to ${nearestMarket.name}\n   Distance: ${nearestMarket.distanceKm} km (${nearestMarket.etaMinutes} min)\n   Estimated value recovery: ₹${recoveryValue.toLocaleString("en-IN")} of ₹${cargo.estimatedCargoValue.toLocaleString("en-IN")} (${recoveryPercent}%)\n\nBroadcasting to nearby wholesalers for immediate purchase.`,
    recommendation: "reroute",
    suggestedMarket: nearestMarket,
    estimatedRecoveryPercent: recoveryPercent,
    estimatedRecoveryValue: recoveryValue,
    confidence: 0.88,
  };
}

function findNearestViableMarket(
  markets: Market[],
  spoilageMinutes: number
): Market | null {
  const viable = markets
    .filter((m) => m.etaMinutes < spoilageMinutes - 10) // 10 min safety buffer
    .sort((a, b) => a.etaMinutes - b.etaMinutes);

  return viable.length > 0 ? viable[0] : null;
}

function calculateRecoveryPercent(market: Market, spoilageMinutes: number): number {
  const timeBuffer = spoilageMinutes - market.etaMinutes;
  if (timeBuffer > 60) return 85;
  if (timeBuffer > 30) return 80;
  if (timeBuffer > 15) return 70;
  return 55;
}
