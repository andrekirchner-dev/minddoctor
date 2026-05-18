import {
  collection, addDoc, updateDoc, deleteDoc, doc, getDoc,
  query, where, getDocs, serverTimestamp, getCountFromServer, Timestamp,
} from "firebase/firestore";
import { db } from "./config";

// Session-level cache — survives client-side navigations, cleared on write.
const cache = new Map<string, ConsultaRecord[]>();

export function clearConsultasCache(): void { cache.clear(); }

export interface ConsultaRecord {
  id: string;
  userId: string;
  patientName: string;
  tipo: string;
  diagnosticoPrincipal: string;
  nivelRisco: string;
  condutaFarma: string;
  prontuarioBase: string;
  state: Record<string, unknown>;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type NewConsulta = Omit<ConsultaRecord, "id" | "createdAt" | "updatedAt">;

export async function saveConsulta(data: NewConsulta): Promise<string> {
  cache.delete(data.userId);
  const ref = await addDoc(collection(db, "consultas"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateConsulta(id: string, data: Partial<NewConsulta>): Promise<void> {
  cache.clear();
  await updateDoc(doc(db, "consultas", id), { ...data, updatedAt: serverTimestamp() });
}

export async function getConsultas(userId: string): Promise<ConsultaRecord[]> {
  if (cache.has(userId)) return cache.get(userId)!;
  const snap = await getDocs(
    query(collection(db, "consultas"), where("userId", "==", userId))
  );
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ConsultaRecord));
  const sorted = docs.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
  cache.set(userId, sorted);
  return sorted;
}

export async function getConsulta(id: string): Promise<ConsultaRecord | null> {
  const snap = await getDoc(doc(db, "consultas", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ConsultaRecord;
}

export async function deleteConsulta(id: string): Promise<void> {
  cache.clear();
  await deleteDoc(doc(db, "consultas", id));
}

export async function getAllConsultasCount(): Promise<{ total: number; mes: number }> {
  const col = collection(db, "consultas");
  const startOfMonth = Timestamp.fromDate(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [totalSnap, mesSnap] = await Promise.all([
    getCountFromServer(col),
    getCountFromServer(query(col, where("createdAt", ">=", startOfMonth))),
  ]);
  return { total: totalSnap.data().count, mes: mesSnap.data().count };
}
