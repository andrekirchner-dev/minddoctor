import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, getDocs, serverTimestamp, type Timestamp,
} from "firebase/firestore";
import { db } from "./config";

const cache = new Map<string, PlanoCrise[]>();

export function clearPlanosCriseCache(): void { cache.clear(); }

export type StatusPlanoCrise = "ativo" | "revisado" | "arquivado";

export interface PlanoCrise {
  id: string;
  userId: string;
  pacienteNome: string;
  consultaId?: string;
  sinaisAlerta: string[];
  medidasImediatas: string[];
  contatoEmergencia: string;
  textoCompleto: string;
  status: StatusPlanoCrise;
  criadoEm: Timestamp;
  updatedAt: Timestamp;
}

type NewPlano = Omit<PlanoCrise, "id" | "criadoEm" | "updatedAt">;

export async function savePlanoCrise(data: NewPlano): Promise<string> {
  const key = `${data.userId}:${data.pacienteNome}`;
  cache.delete(key);
  const ref = await addDoc(collection(db, "planosCrise"), {
    ...data,
    criadoEm: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePlanoCrise(id: string, data: Partial<NewPlano>): Promise<void> {
  cache.clear();
  await updateDoc(doc(db, "planosCrise", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deletePlanoCrise(id: string, userId: string, pacienteNome: string): Promise<void> {
  const key = `${userId}:${pacienteNome}`;
  cache.delete(key);
  await deleteDoc(doc(db, "planosCrise", id));
}

export async function getPlanosCrise(userId: string, pacienteNome: string): Promise<PlanoCrise[]> {
  const key = `${userId}:${pacienteNome}`;
  if (cache.has(key)) return cache.get(key)!;
  const snap = await getDocs(
    query(
      collection(db, "planosCrise"),
      where("userId", "==", userId),
      where("pacienteNome", "==", pacienteNome),
    )
  );
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as PlanoCrise));
  // Sort: "ativo" first, then by criadoEm descending
  docs.sort((a, b) => {
    if (a.status === "ativo" && b.status !== "ativo") return -1;
    if (a.status !== "ativo" && b.status === "ativo") return 1;
    return (b.criadoEm?.seconds ?? 0) - (a.criadoEm?.seconds ?? 0);
  });
  cache.set(key, docs);
  return docs;
}
