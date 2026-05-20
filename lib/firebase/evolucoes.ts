import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, getDocs, orderBy, serverTimestamp, type Timestamp,
} from "firebase/firestore";
import { db } from "./config";

const cache = new Map<string, EvolucaoClinica[]>();

export function clearEvolucoesCache(): void { cache.clear(); }

export interface MedicamentoSnapshot {
  nome: string;
  dose: string;      // "50mg"
  doseNum: number;   // numeric value for charts
  adesao: number;    // 0-100 percentage
}

export interface SintomaSnapshot {
  nome: string;
  intensidade: number; // 0-10
}

export interface EvolucaoClinica {
  id: string;
  userId: string;
  pacienteNome: string;
  consultaId?: string;
  data: Timestamp;
  humorGeral: number;     // 0-10
  ansiedade: number;      // 0-10
  sono: number;           // 0-10
  funcionamento: number;  // 0-10
  sintomas: SintomaSnapshot[];
  medicamentos: MedicamentoSnapshot[];
  texto: string;
  proximaAvaliacao?: string; // "YYYY-MM-DD"
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type NewEvolucao = Omit<EvolucaoClinica, "id" | "createdAt" | "updatedAt">;

export async function saveEvolucao(data: NewEvolucao): Promise<string> {
  const key = `${data.userId}:${data.pacienteNome}`;
  cache.delete(key);
  const ref = await addDoc(collection(db, "evolucoes"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateEvolucao(id: string, data: Partial<NewEvolucao>): Promise<void> {
  cache.clear();
  await updateDoc(doc(db, "evolucoes", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteEvolucao(id: string, userId: string, pacienteNome: string): Promise<void> {
  const key = `${userId}:${pacienteNome}`;
  cache.delete(key);
  await deleteDoc(doc(db, "evolucoes", id));
}

export async function getEvolucoes(userId: string, pacienteNome: string): Promise<EvolucaoClinica[]> {
  const key = `${userId}:${pacienteNome}`;
  if (cache.has(key)) return cache.get(key)!;
  const snap = await getDocs(
    query(
      collection(db, "evolucoes"),
      where("userId", "==", userId),
      where("pacienteNome", "==", pacienteNome),
      orderBy("data", "desc"),
    )
  );
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as EvolucaoClinica));
  cache.set(key, docs);
  return docs;
}

export async function getAllEvolucoes(userId: string): Promise<EvolucaoClinica[]> {
  const snap = await getDocs(
    query(collection(db, "evolucoes"), where("userId", "==", userId))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EvolucaoClinica));
}
