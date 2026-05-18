import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./config";

const cache = new Map<string, Leito[]>();

export type LeitoStatus = "estavel" | "atencao" | "critico" | "alta";

export interface Evolucao {
  id: string;
  data: string;
  texto: string;
}

export interface Leito {
  id: string;
  userId: string;
  numero: string;
  paciente: string;
  idade?: number;
  sexo?: "M" | "F";
  diagnostico: string;
  dataInternacao: string;
  status: LeitoStatus;
  medicacoes: string[];
  alertas: string[];
  evolucoes: Evolucao[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type NewLeito = Omit<Leito, "id" | "createdAt" | "updatedAt">;

export async function saveLeito(data: NewLeito): Promise<string> {
  cache.delete(data.userId);
  const ref = await addDoc(collection(db, "leitos"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateLeito(id: string, data: Partial<NewLeito>): Promise<void> {
  cache.clear();
  await updateDoc(doc(db, "leitos", id), { ...data, updatedAt: serverTimestamp() });
}

export async function getLeitos(userId: string): Promise<Leito[]> {
  if (cache.has(userId)) return cache.get(userId)!;
  const snap = await getDocs(
    query(collection(db, "leitos"), where("userId", "==", userId))
  );
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Leito));
  const sorted = docs.sort((a, b) => {
    if (a.dataInternacao < b.dataInternacao) return 1;
    if (a.dataInternacao > b.dataInternacao) return -1;
    return 0;
  });
  cache.set(userId, sorted);
  return sorted;
}

export async function deleteLeito(id: string): Promise<void> {
  cache.clear();
  await deleteDoc(doc(db, "leitos", id));
}
