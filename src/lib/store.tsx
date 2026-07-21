// ============================================================
// ANNAPURNA — Global State Store (React Context + useReducer)
// ============================================================

"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  Cargo,
  Bid,
  TelemetryData,
  AIDecision,
  Notification,
  CargoStatus,
  Market,
} from "./types";
import { FLEET_CARGOS } from "@/data/mock-data";

// --- State Shape ---
export interface AppState {
  cargos: Cargo[];
  bids: Bid[];
  aiDecisions: AIDecision[];
  notifications: Notification[];
  simulationRunning: boolean;
  simulationStep: number;
}

const initialState: AppState = {
  cargos: FLEET_CARGOS,
  bids: [],
  aiDecisions: [],
  notifications: [],
  simulationRunning: false,
  simulationStep: 0,
};

// --- Actions ---
type Action =
  | { type: "UPDATE_TELEMETRY"; cargoId: string; telemetry: TelemetryData }
  | { type: "UPDATE_CARGO_STATUS"; cargoId: string; status: CargoStatus; spoilageMinutes?: number }
  | { type: "SET_ASKING_PRICE"; cargoId: string; pricePerKg: number }
  | { type: "ADD_AI_DECISION"; decision: AIDecision }
  | { type: "ADD_BID"; bid: Bid }
  | { type: "UPDATE_BID_STATUS"; bidId: string; status: Bid["status"]; counterPrice?: number }
  | { type: "ACCEPT_BID"; bidId: string; cargoId: string }
  | { type: "ADD_NOTIFICATION"; notification: Notification }
  | { type: "MARK_NOTIFICATION_READ"; notificationId: string }
  | { type: "START_SIMULATION" }
  | { type: "ADVANCE_SIMULATION" }
  | { type: "SET_CARGO_REROUTE"; cargoId: string; market: Market }
  | { type: "BROADCAST_TO_MARKETPLACE"; cargoId: string }
  | { type: "ADD_CARGO"; cargo: Cargo }
  | { type: "TRIGGER_MANUAL_EMERGENCY"; cargoId: string; newTemperature: number }
  | { type: "SET_CARGOS"; cargos: Cargo[] }
  | { type: "SET_BIDS"; bids: Bid[] }
  | { type: "MARK_DELIVERED"; cargoId: string }
  | { type: "DELETE_CARGO"; cargoId: string }
  | { type: "SET_FULL_STATE"; state: AppState };

// --- Reducer ---
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "UPDATE_TELEMETRY":
      return {
        ...state,
        cargos: state.cargos.map((c) =>
          c.id === action.cargoId ? { ...c, telemetry: action.telemetry } : c
        ),
      };

    case "UPDATE_CARGO_STATUS":
      return {
        ...state,
        cargos: state.cargos.map((c) =>
          c.id === action.cargoId
            ? {
                ...c,
                status: action.status,
                spoilageTimeMinutes: action.spoilageMinutes ?? c.spoilageTimeMinutes,
              }
            : c
        ),
      };

    case "SET_ASKING_PRICE":
      return {
        ...state,
        cargos: state.cargos.map((c) =>
          c.id === action.cargoId
            ? { ...c, askingPricePerKg: action.pricePerKg }
            : c
        ),
      };

    case "ADD_AI_DECISION":
      return {
        ...state,
        aiDecisions: [...state.aiDecisions, action.decision],
      };

    case "ADD_BID":
      return {
        ...state,
        bids: [...state.bids, action.bid],
      };

    case "UPDATE_BID_STATUS":
      return {
        ...state,
        bids: state.bids.map((b) =>
          b.id === action.bidId
            ? {
                ...b,
                status: action.status,
                counterPricePerKg: action.counterPrice,
              }
            : b
        ),
      };

    case "ACCEPT_BID": {
      const acceptedBid = state.bids.find((b) => b.id === action.bidId);
      const targetCargo = state.cargos.find((c) => c.id === action.cargoId);
      if (!acceptedBid || !targetCargo) return state;

      const isPartial = acceptedBid.requestedQuantityKg < targetCargo.quantityKg;

      return {
        ...state,
        bids: state.bids.map((b) =>
          b.id === action.bidId
            ? { ...b, status: "accepted" as const }
            : (!isPartial && b.cargoId === action.cargoId)
            ? { ...b, status: "rejected" as const }
            : b
        ),
        cargos: state.cargos.map((c) =>
          c.id === action.cargoId
            ? {
                ...c,
                quantityKg: Math.max(0, c.quantityKg - acceptedBid.requestedQuantityKg),
                status: isPartial ? c.status : ("rerouting" as const),
                originalDestination: {
                  name: acceptedBid.wholesalerLocation,
                  location: acceptedBid.wholesalerCoords || {
                    lat: c.origin.location.lat - 0.5,
                    lng: c.origin.location.lng - 0.5
                  }
                },
                selectedMarket: isPartial ? c.selectedMarket : (acceptedBid
                  ? {
                      id: acceptedBid.wholesalerId,
                      name: acceptedBid.wholesalerLocation,
                      location: acceptedBid.wholesalerCoords || {
                        lat: c.origin.location.lat - 0.5,
                        lng: c.origin.location.lng - 0.5
                      },
                      distanceKm: acceptedBid.distanceKm,
                      etaMinutes: acceptedBid.etaMinutes,
                      type: "wholesale_market" as const,
                    }
                  : null),
              }
            : c
        ),
      };
    }

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.notification, ...state.notifications],
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.notificationId ? { ...n, read: true } : n
        ),
      };

    case "START_SIMULATION":
      return { ...state, simulationRunning: true, simulationStep: 0 };

    case "ADVANCE_SIMULATION":
      return { ...state, simulationStep: state.simulationStep + 1 };

    case "SET_CARGO_REROUTE":
      return {
        ...state,
        cargos: state.cargos.map((c) =>
          c.id === action.cargoId
            ? { ...c, selectedMarket: action.market, status: "rerouting" }
            : c
        ),
      };

    case "BROADCAST_TO_MARKETPLACE":
      return {
        ...state,
        cargos: state.cargos.map((c) =>
          c.id === action.cargoId
            ? { ...c, status: "emergency" }
            : c
        ),
        notifications: [
          {
            id: `notif-broadcast-${Date.now()}`,
            type: "new_cargo",
            title: "Emergency Cargo Broadcast",
            message: `Distress cargo ${action.cargoId} sent to nearby wholesalers. Awaiting bids.`,
            timestamp: Date.now(),
            read: false,
          },
          ...state.notifications,
        ],
      };

    case "ADD_CARGO":
      return {
        ...state,
        cargos: [action.cargo, ...state.cargos],
        notifications: [
          {
            id: `notif-add-${Date.now()}`,
            type: "system",
            title: "New Consignment Added",
            message: `Truck ${action.cargo.truckPlate} added to active fleet tracking.`,
            timestamp: Date.now(),
            read: false,
          },
          ...state.notifications,
        ],
      };

    case "TRIGGER_MANUAL_EMERGENCY":
      return {
        ...state,
        cargos: state.cargos.map((c) =>
          c.id === action.cargoId
            ? { 
                ...c, 
                status: "emergency", 
                telemetry: { ...c.telemetry, temperature: action.newTemperature } 
              }
            : c
        ),
      };

    case "SET_CARGOS":
      return { ...state, cargos: action.cargos };
      
    case "SET_BIDS":
      return { ...state, bids: action.bids };

    case "MARK_DELIVERED":
      return {
        ...state,
        cargos: state.cargos.map((c) =>
          c.id === action.cargoId
            ? { ...c, status: "delivered" as CargoStatus }
            : c
        ),
      };

    case "DELETE_CARGO":
      return {
        ...state,
        cargos: state.cargos.filter((c) => c.id !== action.cargoId),
      };

    case "SET_FULL_STATE":
      return action.state;

    default:
      return state;
  }
}

// --- Helper: Push state to server-side Firestore via API route ---
async function syncToFirestore(type: string, data: any) {
  try {
    await fetch("/api/firestore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data }),
    });
  } catch (err) {
    // Silently fail — localStorage fallback handles cross-tab sync
  }
}

// --- Context ---
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // On mount: fetch from Firestore via API, then set up localStorage fallback & polling
  React.useEffect(() => {
    // 1. Fetch initial data from Firestore (server-side, uses service account)
    const fetchFromFirestore = async () => {
      try {
        const res = await fetch("/api/firestore");
        if (res.ok) {
          const data = await res.json();
          if (data.cargos && data.cargos.length > 0) {
            dispatch({ type: "SET_CARGOS", cargos: data.cargos });
          }
          if (data.bids && data.bids.length > 0) {
            dispatch({ type: "SET_BIDS", bids: data.bids });
          }
        }
      } catch (err) {
        // Firestore unavailable, fall through to localStorage
      }
    };
    fetchFromFirestore();

    // 2. Poll Firestore every 3 seconds for real-time-like sync across devices
    const pollInterval = setInterval(fetchFromFirestore, 3000);

    // 3. LocalStorage cross-tab sync (instant sync for same-browser tabs)
    const saved = localStorage.getItem('annapurna_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.cargos && parsed.cargos.length > 0) {
          dispatch({ type: 'SET_FULL_STATE', state: parsed });
        }
      } catch(e) {}
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'annapurna_state' && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          dispatch({ type: 'SET_FULL_STATE', state: newState });
        } catch(e) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Persist state changes to localStorage
  React.useEffect(() => {
    if (state.cargos.length > 0 || state.bids.length > 0) {
      const newStateStr = JSON.stringify(state);
      if (localStorage.getItem('annapurna_state') !== newStateStr) {
        localStorage.setItem('annapurna_state', newStateStr);
      }
    }
  }, [state]);

  // Middleware Dispatch — updates local state + pushes to Firestore via server API
  const asyncDispatch = async (action: Action) => {
    dispatch(action); // Optimistic UI update

    try {
      if (action.type === 'ADD_CARGO') {
        await syncToFirestore("cargo", { ...action.cargo, createdAt: Date.now() });
      } else if (action.type === 'SET_ASKING_PRICE') {
        const cargo = state.cargos.find((c) => c.id === action.cargoId);
        if (cargo) {
          await syncToFirestore("cargo", { ...cargo, askingPricePerKg: action.pricePerKg });
        }
      } else if (action.type === 'BROADCAST_TO_MARKETPLACE') {
        const cargo = state.cargos.find((c) => c.id === action.cargoId);
        if (cargo) {
          await syncToFirestore("cargo", { ...cargo, status: "emergency", createdAt: Date.now() });
        }
      } else if (action.type === 'UPDATE_CARGO_STATUS') {
        const cargo = state.cargos.find((c) => c.id === action.cargoId);
        if (cargo) {
          await syncToFirestore("cargo", { ...cargo, status: action.status, spoilageTimeMinutes: action.spoilageMinutes });
        }
      } else if (action.type === 'TRIGGER_MANUAL_EMERGENCY') {
        const cargo = state.cargos.find((c) => c.id === action.cargoId);
        if (cargo) {
          await syncToFirestore("cargo", { ...cargo, status: "emergency", telemetry: { ...cargo.telemetry, temperature: action.newTemperature } });
        }
      } else if (action.type === 'ADD_BID') {
        await syncToFirestore("bid", { ...action.bid, createdAt: Date.now() });
      } else if (action.type === 'UPDATE_BID_STATUS') {
        const bid = state.bids.find((b) => b.id === action.bidId);
        if (bid) {
          await syncToFirestore("bid", { ...bid, status: action.status, counterPricePerKg: action.counterPrice });
        }
      } else if (action.type === 'ACCEPT_BID') {
        const bid = state.bids.find(b => b.id === action.bidId);
        const oldCargo = state.cargos.find(c => c.id === action.cargoId);
        if (bid && oldCargo) {
          // Accept this bid
          await syncToFirestore("bid", { ...bid, status: "accepted" });
          // Update cargo
          const isPartial = bid.requestedQuantityKg < oldCargo.quantityKg;
          const newQuantity = Math.max(0, oldCargo.quantityKg - bid.requestedQuantityKg);
          await syncToFirestore("cargo", {
            ...oldCargo,
            status: isPartial ? oldCargo.status : "rerouting",
            quantityKg: newQuantity,
          });
        }
      } else if (action.type === 'MARK_DELIVERED') {
        const cargo = state.cargos.find((c) => c.id === action.cargoId);
        if (cargo) {
          await syncToFirestore("cargo", { ...cargo, status: "delivered" });
        }
      } else if (action.type === 'DELETE_CARGO') {
        await syncToFirestore("delete_cargo", { id: action.cargoId });
      }
    } catch (err) {
      console.error("Firestore Sync Error:", err);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch: asyncDispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
}
