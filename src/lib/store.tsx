// ============================================================
// ANNAPURNA — Global State Store (React Context + useReducer)
// ============================================================

"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { db } from "./firebase";
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, writeBatch, getDocs, where, orderBy, getDoc } from "firebase/firestore";
import {
  Cargo,
  Bid,
  TelemetryData,
  AIDecision,
  Notification,
  CargoStatus,
  Market,
} from "./types";

// --- State Shape ---
export interface AppState {
  cargos: Cargo[];
  bids: Bid[];
  aiDecisions: AIDecision[];
  notifications: Notification[];
  simulationRunning: boolean;
  simulationStep: number;
}

import { FLEET_CARGOS } from "@/data/mock-data";

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

// --- Context ---
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const isInitialized = React.useRef(false);

  React.useEffect(() => {
    // 1. Real-time Subscriptions (Firebase)
    // Firestore onSnapshot automatically fetches initial data AND listens for updates
    const cargosRef = collection(db, 'cargos');
    const bidsRef = collection(db, 'bids');

    let unsubscribeCargos = () => {};
    let unsubscribeBids = () => {};

    try {
      unsubscribeCargos = onSnapshot(cargosRef, (snapshot) => {
        if (!snapshot.empty) {
          const mappedCargos = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as Cargo[];
          dispatch({ type: 'SET_CARGOS', cargos: mappedCargos });
        }
      }, (err) => console.log("Firestore cargo sync error", err));

      unsubscribeBids = onSnapshot(bidsRef, (snapshot) => {
        if (!snapshot.empty) {
          const mappedBids = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as Bid[];
          dispatch({ type: 'SET_BIDS', bids: mappedBids });
        }
      }, (err) => console.log("Firestore bid sync error", err));
    } catch (e) {
      console.log("Firebase not configured correctly, relying on localStorage fallback.");
    }

    // 2. LocalStorage cross-tab sync (fallback for when Firebase is unconfigured)
    const saved = localStorage.getItem('annapurna_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'SET_FULL_STATE', state: parsed });
      } catch(e) {}
    }
    isInitialized.current = true;

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
      unsubscribeCargos();
      unsubscribeBids();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Persist state changes to localStorage safely
  React.useEffect(() => {
    // Prevent overwriting a populated localStorage with an empty initial state on mount
    if (state.cargos.length > 0 || state.bids.length > 0) {
      const newStateStr = JSON.stringify(state);
      if (localStorage.getItem('annapurna_state') !== newStateStr) {
        localStorage.setItem('annapurna_state', newStateStr);
      }
    }
  }, [state]);

  // Middleware Dispatch to push to Firestore
  const asyncDispatch = async (action: Action) => {
    dispatch(action); // Optimistic UI update

    try {
      if (action.type === 'ADD_CARGO') {
        await setDoc(doc(db, 'cargos', action.cargo.id), {
          ...action.cargo,
          createdAt: Date.now()
        });
      } else if (action.type === 'TRIGGER_MANUAL_EMERGENCY') {
        // Fetch current telemetry first
        const cargoRef = doc(db, 'cargos', action.cargoId);
        const cargoSnap = await getDoc(cargoRef);
        if (cargoSnap.exists()) {
          const data = cargoSnap.data();
          await updateDoc(cargoRef, {
            status: 'emergency',
            telemetry: { ...data.telemetry, temperature: action.newTemperature }
          });
        }
      } else if (action.type === 'SET_ASKING_PRICE') {
        await updateDoc(doc(db, 'cargos', action.cargoId), {
          askingPricePerKg: action.pricePerKg
        });
      } else if (action.type === 'BROADCAST_TO_MARKETPLACE') {
        await updateDoc(doc(db, 'cargos', action.cargoId), {
          status: 'emergency'
        });
      } else if (action.type === 'UPDATE_TELEMETRY') {
        await updateDoc(doc(db, 'cargos', action.cargoId), {
          telemetry: action.telemetry
        });
      } else if (action.type === 'UPDATE_CARGO_STATUS') {
        await updateDoc(doc(db, 'cargos', action.cargoId), {
          status: action.status,
          spoilageTimeMinutes: action.spoilageMinutes
        });
      } else if (action.type === 'ADD_BID') {
        await setDoc(doc(db, 'bids', action.bid.id), {
          ...action.bid,
          createdAt: Date.now()
        });
      } else if (action.type === 'UPDATE_BID_STATUS') {
        const updateData: any = { status: action.status };
        if (action.counterPrice !== undefined) {
          updateData.counterPricePerKg = action.counterPrice;
        }
        await updateDoc(doc(db, 'bids', action.bidId), updateData);
      } else if (action.type === 'ACCEPT_BID') {
        const bid = state.bids.find(b => b.id === action.bidId);
        const oldCargo = state.cargos.find(c => c.id === action.cargoId);
        if (bid && oldCargo) {
          const isPartial = bid.requestedQuantityKg < oldCargo.quantityKg;
          const newStatus = isPartial ? oldCargo.status : "rerouting";
          const newQuantity = Math.max(0, oldCargo.quantityKg - bid.requestedQuantityKg);
          
          const newOriginalDestination = {
            name: bid.wholesalerLocation,
            location: bid.wholesalerCoords || {
              lat: oldCargo.origin.location.lat - 0.5,
              lng: oldCargo.origin.location.lng - 0.5
            }
          };

          const newSelectedMarket = isPartial ? oldCargo.selectedMarket : {
            id: bid.wholesalerId,
            name: bid.wholesalerLocation,
            location: bid.wholesalerCoords || {
              lat: oldCargo.origin.location.lat - 0.5,
              lng: oldCargo.origin.location.lng - 0.5
            },
            distanceKm: bid.distanceKm,
            etaMinutes: bid.etaMinutes,
            type: "wholesale_market" as const,
          };

          const batch = writeBatch(db);
          // Accept the current bid
          batch.update(doc(db, 'bids', action.bidId), { status: 'accepted' });
          
          // If the cargo was fully bought out, reject other bids
          if (newQuantity <= 0) {
            const otherBidsSnap = await getDocs(query(collection(db, 'bids'), where('cargoId', '==', action.cargoId)));
            otherBidsSnap.forEach(bDoc => {
              if (bDoc.id !== action.bidId) {
                batch.update(bDoc.ref, { status: 'rejected' });
              }
            });
          }
          
          batch.update(doc(db, 'cargos', action.cargoId), {
            status: newStatus,
            quantityKg: newQuantity,
            selectedMarket: newSelectedMarket,
            originalDestination: newOriginalDestination
          });

          await batch.commit();
        }
      } else if (action.type === 'MARK_DELIVERED') {
        await updateDoc(doc(db, 'cargos', action.cargoId), { status: 'delivered' });
      } else if (action.type === 'DELETE_CARGO') {
        await deleteDoc(doc(db, 'cargos', action.cargoId));
        // Also delete bids
        const bidsSnap = await getDocs(query(collection(db, 'bids'), where('cargoId', '==', action.cargoId)));
        const batch = writeBatch(db);
        bidsSnap.forEach(bDoc => batch.delete(bDoc.ref));
        await batch.commit();
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
