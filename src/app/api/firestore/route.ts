import { Firestore } from "@google-cloud/firestore";
import { NextResponse } from "next/server";

// Use the service account credentials already configured in .env.local
const firestore = new Firestore({
  projectId: process.env.GCP_PROJECT_ID || "project-a9c284f8-6bca-440a-a0c",
});

// GET - Read all cargos and bids
export async function GET() {
  try {
    const [cargosSnap, bidsSnap] = await Promise.all([
      firestore.collection("cargos").get(),
      firestore.collection("bids").get(),
    ]);

    const cargos = cargosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const bids = bidsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ cargos, bids });
  } catch (error: any) {
    console.error("Firestore GET error:", error.message);
    return NextResponse.json({ cargos: [], bids: [], error: error.message }, { status: 200 });
  }
}

// POST - Write a cargo or bid to Firestore
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === "cargo") {
      await firestore.collection("cargos").doc(data.id).set(data, { merge: true });
    } else if (type === "bid") {
      await firestore.collection("bids").doc(data.id).set(data, { merge: true });
    } else if (type === "delete_cargo") {
      await firestore.collection("cargos").doc(data.id).delete();
      // Also delete associated bids
      const bidsSnap = await firestore.collection("bids").where("cargoId", "==", data.id).get();
      const batch = firestore.batch();
      bidsSnap.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Firestore POST error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
