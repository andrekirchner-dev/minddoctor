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
  const ref = await addDoc(collection(db, "leitos"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateLeito(id: string, data: Partial<NewLeito>): Promise<void> {
  await updateDoc(doc(db, "leitos", id), { ...data, updatedAt: serverTimestamp() });
}

export async function getLeitos(userId: string): Promise<Leito[]> {
  const snap = await getDocs(
    query(collection(db, "leitos"), where("userId", "==", userId))
  );
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Leito));
  return docs.sort((a, b) => {
    if (a.dataInternacao < b.dataInternacao) return 1;
    if (a.dataInternacao > b.dataInternacao) return -1;
    return 0;
  });
}

export async function deleteLeito(id: string): Promise<void> {
  await deleteDoc(doc(db, "leitos", id));
}
