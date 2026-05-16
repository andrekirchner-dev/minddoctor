import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";

// AppConfig document stored at appConfig/main in Firestore
export interface AppConfig {
  manutencao: boolean;
  iaHabilitada: boolean;
  registroAberto: boolean;
  maxConsultasFree: number;
  banner: {
    ativo: boolean;
    tipo: "info" | "warning" | "error" | "success";
    mensagem: string;
    link: string;
    linkLabel: string;
  };
  updatedAt?: unknown;
  updatedBy?: string;
}

export const DEFAULT_CONFIG: AppConfig = {
  manutencao: false,
  iaHabilitada: true,
  registroAberto: true,
  maxConsultasFree: 999,
  banner: { ativo: false, tipo: "info", mensagem: "", link: "", linkLabel: "" },
};

export async function getAppConfig(): Promise<AppConfig> {
  const snap = await getDoc(doc(db, "appConfig", "main"));
  if (!snap.exists()) return DEFAULT_CONFIG;
  return { ...DEFAULT_CONFIG, ...(snap.data() as Partial<AppConfig>) };
}

export async function updateAppConfig(
  updates: Partial<AppConfig>,
  updatedBy: string
): Promise<void> {
  await setDoc(
    doc(db, "appConfig", "main"),
    { ...updates, updatedAt: serverTimestamp(), updatedBy },
    { merge: true }
  );
}

// Announcements collection: "comunicados"
export interface Anuncio {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "info" | "warning" | "success";
  ativo: boolean;
  createdAt: { seconds: number } | null;
}

export async function getAnuncios(): Promise<Anuncio[]> {
  const snap = await getDocs(
    query(collection(db, "comunicados"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Anuncio, "id">),
  }));
}

export async function createAnuncio(
  data: Omit<Anuncio, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "comunicados"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function toggleAnuncio(id: string, ativo: boolean): Promise<void> {
  await setDoc(doc(db, "comunicados", id), { ativo }, { merge: true });
}

export async function deleteAnuncio(id: string): Promise<void> {
  await deleteDoc(doc(db, "comunicados", id));
}
