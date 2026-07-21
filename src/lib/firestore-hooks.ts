import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  type QueryConstraint,
} from "firebase/firestore";
import { getDb } from "./firebase";

export interface Row {
  id: string;
  [key: string]: unknown;
}

export function useCollection(name: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const db = getDb();
    if (!db) {
      setLoading(false);
      return;
    }
    try {
      const q = query(collection(db, name), ...constraints);
      const unsub = onSnapshot(
        q,
        (snap) => {
          setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        },
      );
      return unsub;
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return { data, loading, error };
}

export async function createDoc(name: string, data: Record<string, unknown>) {
  const db = getDb();
  if (!db) throw new Error("DB not ready");
  return addDoc(collection(db, name), { ...data, createdAt: serverTimestamp() });
}

export async function updateRow(name: string, id: string, data: Record<string, unknown>) {
  const db = getDb();
  if (!db) throw new Error("DB not ready");
  return updateDoc(doc(db, name, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteRow(name: string, id: string) {
  const db = getDb();
  if (!db) throw new Error("DB not ready");
  return deleteDoc(doc(db, name, id));
}

export { orderBy };
