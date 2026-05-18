import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import type { User } from "firebase/auth";

const ADMIN_EMAILS = ["kirchner.andre@gmail.com"];

export interface NotificationPrefs {
  flashcardsVencidos: boolean;
  lembreteEstudo: boolean;
  atualizacoesConteudo: boolean;
}

export type SituacaoAcademica =
  | "r1" | "r2" | "r3"
  | "pos-graduacao" | "mestrado" | "doutorado"
  | "staff" | "outro";

export const SITUACAO_LABEL: Record<SituacaoAcademica, string> = {
  "r1":           "R1 — Residente",
  "r2":           "R2 — Residente",
  "r3":           "R3 — Residente",
  "pos-graduacao":"Pós-graduação",
  "mestrado":     "Mestrado",
  "doutorado":    "Doutorado",
  "staff":        "Staff / Docente",
  "outro":        "Outro",
};

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plano: "free" | "pro";
  role: "admin" | "user";
  moduloAtivo: "adulto" | "infancia" | "forense" | "psicogeriatria" | "interconsulta";
  crm?: string;
  situacaoAcademica?: SituacaoAcademica;
  notificacoes?: NotificationPrefs;
  createdAt: DocumentData;
  updatedAt: DocumentData;
}

export async function upsertUserProfile(user: User): Promise<void> {
  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);
  const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");

  if (!snap.exists()) {
    await setDoc(ref, {
      uid:         user.uid,
      email:       user.email,
      displayName: user.displayName,
      photoURL:    user.photoURL,
      plano:       "free",
      role:        isAdmin ? "admin" : "user",
      moduloAtivo: "adulto",
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp(),
    } satisfies Omit<UserProfile, "crm">);
  } else {
    const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (isAdmin && snap.data()?.role !== "admin") updates.role = "admin";
    await setDoc(ref, updates, { merge: true });
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "usuarios", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, "usuarios"));
  return snap.docs.map((d) => d.data() as UserProfile);
}

export async function updateUserRole(uid: string, role: "admin" | "user"): Promise<void> {
  await setDoc(doc(db, "usuarios", uid), { role, updatedAt: serverTimestamp() }, { merge: true });
}

export async function updateUserPlan(uid: string, plano: "free" | "pro"): Promise<void> {
  await setDoc(doc(db, "usuarios", uid), { plano, updatedAt: serverTimestamp() }, { merge: true });
}

export async function updateUserProfileData(
  uid: string,
  data: Partial<Pick<UserProfile, "displayName" | "crm" | "moduloAtivo" | "situacaoAcademica">>
): Promise<void> {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  await setDoc(doc(db, "usuarios", uid), { ...clean, updatedAt: serverTimestamp() }, { merge: true });
}

export async function updateNotificationPrefs(
  uid: string,
  prefs: NotificationPrefs
): Promise<void> {
  await setDoc(doc(db, "usuarios", uid), { notificacoes: prefs, updatedAt: serverTimestamp() }, { merge: true });
}
