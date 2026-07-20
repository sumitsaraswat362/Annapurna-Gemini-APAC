import { Cargo, Market, AIDecision } from "../types";
import { makeDecision } from "../ai-agent";
import { ai, DEFAULT_MODEL } from "../vertex-client";

const rerouteTruckDeclaration: FunctionDeclaration = {
  name: "reroute_truck",
  description: "Reroute a truck to a new destination market.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      truckId: {
        type: SchemaType.STRING,
        description: "The ID of the truck to reroute",
      },
      destination: {
        type: SchemaType.STRING,
        description: "The name of the new destination market",
      },
    },
    required: ["truckId", "destination"],
  },
};

const alertWholesalerDeclaration: FunctionDeclaration = {
  name: "alert_wholesaler",
  description: "Send an alert message to the wholesaler.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      message: {
        type: SchemaType.STRING,
        description: "The message to send to the wholesaler",
      },
    },
    required: ["message"],
  },
};

// Dummy local functions
function reroute_truck(truckId: string, destination: string) {
  return `Successfully rerouted truck ${truckId} to ${destination}.`;
}

function alert_wholesaler(message: string) {
  return `Wholesaler alerted: ${message}`;
}

// Mock Data
const MOCK_MARKETS: Market[] = [
  {
    id: "m1",
    name: "Azadpur Mandi",
    location: { lat: 28.737, lng: 77.178 },
    distanceKm: 45,
    etaMinutes: 50,
    type: "mandi",
  },
  {
    id: "m2",
    name: "Okhla Sabzi Mandi",
    location: { lat: 28.563, lng: 77.279 },
    distanceKm: 15,
    etaMinutes: 20,
    type: "wholesale_market",
  }
];

const MOCK_CARGOS: Cargo[] = [
  {
    id: "cargo-101",
    type: "tomatoes",
    quantityKg: 5000,
    truckId: "truck-001",
    truckPlate: "DL 1M 1234",
    driverName: "Rajesh Kumar",
    driverPhone: "+919876543210",
    origin: { name: "Sonipat Farms", location: { lat: 28.993, lng: 77.015 } },
    originalDestination: { name: "Chandigarh Market", location: { lat: 30.733, lng: 76.779 } },
    currentLocation: { lat: 29.5, lng: 76.9 },
    routePolyline: [],
    telemetry: {
      temperature: 4.5,
      humidity: 85,
      ethyleneLevel: "low",
      timestamp: Date.now(),
    },
    safeTemperatureMax: 10.0,
    loadedAt: Date.now() - 3600000,
    status: "in_transit",
    spoilageTimeMinutes: null,
    etaMinutes: 180,
    estimatedCargoValue: 100000,
    askingPricePerKg: null,
    reroutableMarkets: MOCK_MARKETS,
    selectedMarket: null,
  },
  {
    id: "cargo-102",
    type: "mangoes",
    quantityKg: 3000,
    truckId: "truck-002",
    truckPlate: "MH 04 AB 9876",
    driverName: "Suresh",
    driverPhone: "+919876543211",
    origin: { name: "Ratnagiri", location: { lat: 16.99, lng: 73.31 } },
    originalDestination: { name: "Mumbai APMC", location: { lat: 19.07, lng: 72.87 } },
    currentLocation: { lat: 18.5, lng: 73.0 },
    routePolyline: [],
    telemetry: {
      temperature: 18.5, // Spike!
      humidity: 90,
      ethyleneLevel: "high",
      timestamp: Date.now(),
    },
    safeTemperatureMax: 13.0,
    loadedAt: Date.now() - 7200000,
    status: "warning",
    spoilageTimeMinutes: null,
    etaMinutes: 120,
    estimatedCargoValue: 300000,
    askingPricePerKg: null,
    reroutableMarkets: MOCK_MARKETS,
    selectedMarket: null,
  },
  {
    id: "cargo-103",
    type: "fish",
    quantityKg: 2000,
    truckId: "truck-003",
    truckPlate: "KL 01 XY 5555",
    driverName: "Manoj",
    driverPhone: "+919876543212",
    origin: { name: "Kochi Port", location: { lat: 9.93, lng: 76.26 } },
    originalDestination: { name: "Bangalore Market", location: { lat: 12.97, lng: 77.59 } },
    currentLocation: { lat: 11.5, lng: 76.9 },
    routePolyline: [],
    telemetry: {
      temperature: 5.0, // Spike! Safe is 2.0
      humidity: 95,
      ethyleneLevel: "low",
      timestamp: Date.now(),
    },
    safeTemperatureMax: 2.0,
    loadedAt: Date.now() - 14400000,
    status: "in_transit",
    spoilageTimeMinutes: null,
    etaMinutes: 300,
    estimatedCargoValue: 500000,
    askingPricePerKg: null,
    reroutableMarkets: MOCK_MARKETS,
    selectedMarket: null,
  }
];

// 1. MonitorAgent
class MonitorAgent {
  static filterAtRiskCargos(cargos: Cargo[]): Cargo[] {
    return cargos.filter(cargo => cargo.telemetry.temperature > cargo.safeTemperatureMax);
  }
}

// 2. DecisionAgent
class DecisionAgent {
  static async evaluateCargos(cargos: Cargo[]): Promise<{ cargo: Cargo; decision: AIDecision }[]> {
    const results = [];
    for (const cargo of cargos) {
      const decision = await makeDecision(cargo);
      results.push({ cargo, decision });
    }
    return results;
  }
}

// 3. NotificationAgent
class NotificationAgent {
  static async sendAlerts(decisions: { cargo: Cargo; decision: AIDecision }[]) {
    const alertsSent = [];
    for (const { cargo, decision } of decisions) {
      if (decision.recommendation === "reroute" || decision.recommendation === "emergency_sell") {
        // Simulate sending to Firestore/Driver App
        alertsSent.push({
          cargoId: cargo.id,
          driverPhone: cargo.driverPhone,
          alertType: "CRITICAL_REROUTE",
          message: `URGENT: Cargo at risk. Recommended action: ${decision.recommendation}. ${
            decision.suggestedMarket ? "Head to " + decision.suggestedMarket.name : ""
          }`,
          timestamp: new Date().toISOString()
        });
      }
    }
    return alertsSent;
  }
}

/**
 * Orchestrates the autonomous monitoring cycle.
 */
export async function runAutonomousCycle() {
  console.log("[Orchestrator] Starting cycle...");
  const allCargos = MOCK_CARGOS;

  // Step 1: Monitor
  const atRiskCargos = MonitorAgent.filterAtRiskCargos(allCargos);
  console.log(`[Orchestrator] Found ${atRiskCargos.length} cargos at risk.`);

  // Step 2: Decide
  const evaluatedCargos = await DecisionAgent.evaluateCargos(atRiskCargos);
  console.log(`[Orchestrator] AI decisions completed.`);

  // Step 3: Notify
  const alerts = await NotificationAgent.sendAlerts(evaluatedCargos);
  console.log(`[Orchestrator] Sent ${alerts.length} alerts.`);

  console.log("[Orchestrator] Initiating True Function Calling test with Gemini Enterprise / Vertex AI...");
  
  const toolExecutions: any[] = [];

  for (const cargo of atRiskCargos) {
    const prompt = `Cargo ${cargo.id} (Truck ${cargo.truckId}) is at risk. SchemaType: ${cargo.type}. Temperature is ${cargo.telemetry.temperature}°C (Max safe: ${cargo.safeTemperatureMax}°C). Please reroute this truck to the nearest available market (e.g., "Okhla Sabzi Mandi") or alert the wholesaler that the cargo is spoiling.`;

    try {
      const result = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: prompt,
        config: {
          tools: [
            {
              functionDeclarations: [
                {
                  name: "reroute_truck",
                  description: "Reroute a truck to a new destination market.",
                  parameters: {
                    type: "OBJECT" as any,
                    properties: {
                      truckId: { type: "STRING" as any, description: "The ID of the truck to reroute" },
                      destination: { type: "STRING" as any, description: "The name of the new destination market" },
                    },
                    required: ["truckId", "destination"],
                  },
                },
                {
                  name: "alert_wholesaler",
                  description: "Send an alert message to the wholesaler.",
                  parameters: {
                    type: "OBJECT" as any,
                    properties: {
                      message: { type: "STRING" as any, description: "The message to send to the wholesaler" },
                    },
                    required: ["message"],
                  },
                }
              ]
            }
          ]
        }
      });

      const functionCalls = result.functionCalls;

      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
          console.log(`[Orchestrator][Nerve Center Log] Model triggered tool: ${call.name}`);
          let toolResult;
          if (call.name === "reroute_truck") {
            const args = call.args as any;
            toolResult = reroute_truck(args.truckId, args.destination);
          } else if (call.name === "alert_wholesaler") {
            const args = call.args as any;
            toolResult = alert_wholesaler(args.message);
          }
          console.log(`[Orchestrator][Nerve Center Log] Tool Execution Result: ${toolResult}`);
          toolExecutions.push({ name: call.name, args: call.args, result: toolResult });
        }
      }
    } catch (e) {
      console.error("[Orchestrator] Error during function calling test:", e);
    }
  }

  return {
    totalCargosChecked: allCargos.length,
    atRiskCount: atRiskCargos.length,
    decisionsMade: evaluatedCargos.map(e => ({
      cargoId: e.cargo.id,
      recommendation: e.decision.recommendation,
      confidence: e.decision.confidence,
    })),
    alertsSent: alerts,
    toolExecutions
  };
}
