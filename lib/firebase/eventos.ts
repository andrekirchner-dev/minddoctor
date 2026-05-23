import {
  collection, addDoc, deleteDoc, doc,
  query, where, getDocs, serverTimestamp, type Timestamp,
} from "firebase/firestore";
import { db } from "./config";

const cache = new Map<string, Evento[]>();

export function clearEventosCache(): void { cache.clear(); }

export type TipoEvento =
  | "consulta"
  | "retorno"
  | "escala"
  | "plantao"
  | "supervisao"
  | "outro";

export const TIPO_LABEL: Record<TipoEvento, string> = {
  consulta:    "Consulta",
  retorno:     "Retorno",
  escala:      "Aplicação de Escala",
  plantao:     "Plantão",
  supervisao:  "Supervisão",
  outro:       "Outro",
};

export const TIPO_COLOR: Record<TipoEvento, string> = {
  consulta:   "#4A6CF7",
  retorno:    "#7B5EA7",
  escala:     "#06B6D4",
  plantao:    "#D62828",
  supervisao: "#F4A261",
  outro:      "#6B7280",
};

export interface Evento {
  id: string;
  userId: string;
  data: string;       // "YYYY-MM-DD"
  hora: string;       // "HH:MM"
  titulo: string;
  tipo: TipoEvento;
  pacienteNome?: string;
  createdAt: Timestamp;
}

type NewEvento = Omit<Evento, "id" | "createdAt">;

export async function saveEvento(data: NewEvento): Promise<string> {
  cache.delete(data.userId);
  const ref = await addDoc(collection(db, "eventos"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteEvento(id: string, userId: string): Promise<void> {
  cache.delete(userId);
  await deleteDoc(doc(db, "eventos", id));
}

export async function getEventos(userId: string): Promise<Evento[]> {
  if (cache.has(userId)) return cache.get(userId)!;
  const snap = await getDocs(
    query(collection(db, "eventos"), where("userId", "==", userId))
  );
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Evento));
  docs.sort((a, b) => a.data.localeCompare(b.data) || a.hora.localeCompare(b.hora));
  cache.set(userId, docs);
  return docs;
}
