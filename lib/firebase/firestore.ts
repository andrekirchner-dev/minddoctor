import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import type { User } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plano: "free" | "pro";
  moduloAtivo: "adulto" | "infancia" | "forense" | "psicogeriatria" | "interconsulta";
  crm?: string;
  createdAt: DocumentData;
  updatedAt: DocumentData;
}

export async function upsertUserProfile(user: User): Promise<void> {
  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid:          user.uid,
      email:        user.email,
      displayName:  user.displayName,
      photoURL:     user.photoURL,
      plano:        "free",
      moduloAtivo:  "adulto",
      createdAt:    serverTimestamp(),
      updatedAt:    serverTimestamp(),
    } satisfies Omit<UserProfile, "crm">);
  } else {
    await setDoc(
      ref,
      { updatedAt: serverTimestamp() },
      { merge: true }
    );
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "usuarios", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}
