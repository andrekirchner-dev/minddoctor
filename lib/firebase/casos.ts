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

export type StatusCaso = "ativo" | "acompanhamento" | "alta" | "encerrado";

export interface CasoClinico {
  id: string;
  userId: string;
  titulo: string;
  idade: number | null;
  sexo: "M" | "F" | "outro" | "";
  diagnosticoCID: string;
  hipotese: string;
  historico: string;
  historicoFamiliar: string;
  exameMental: string;
  medicamentosAtuais: string;
  conduta: string;
  observacoesEstudo: string;
  tags: string[];
  status: StatusCaso;
  // AES-GCM encrypted (base64)
  identificador_enc: string;
  dataNascimento_enc: string;
  contato_enc: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type NewCaso = Omit<CasoClinico, "id" | "createdAt" | "updatedAt">;

export async function getCasos(userId: string): Promise<CasoClinico[]> {
  const snap = await getDocs(
    query(collection(db, "casos"), where("userId", "==", userId))
  );
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CasoClinico));
  return docs.sort((a, b) => {
    const ta = a.updatedAt?.seconds ?? 0;
    const tb = b.updatedAt?.seconds ?? 0;
    return tb - ta;
  });
}

export async function saveCaso(caso: NewCaso): Promise<string> {
  const ref = await addDoc(collection(db, "casos"), {
    ...caso,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCaso(id: string, caso: Partial<NewCaso>): Promise<void> {
  await updateDoc(doc(db, "casos", id), { ...caso, updatedAt: serverTimestamp() });
}

export async function deleteCaso(id: string): Promise<void> {
  await deleteDoc(doc(db, "casos", id));
}
