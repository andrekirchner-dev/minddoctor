import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, getDocs, serverTimestamp, type Timestamp,
} from "firebase/firestore";
import { db } from "./config";

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
  const ref = await addDoc(collection(db, "consultas"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateConsulta(id: string, data: Partial<NewConsulta>): Promise<void> {
  await updateDoc(doc(db, "consultas", id), { ...data, updatedAt: serverTimestamp() });
}

export async function getConsultas(userId: string): Promise<ConsultaRecord[]> {
  const snap = await getDocs(
    query(collection(db, "consultas"), where("userId", "==", userId))
  );
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ConsultaRecord));
  return docs.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
}

export async function deleteConsulta(id: string): Promise<void> {
  await deleteDoc(doc(db, "consultas", id));
}
