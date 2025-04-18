// src/services/firestoreService.ts
import { db } from '../firebaseConfig'; // Adjust the import path if necessary
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

// --- Orders ---

export const getOrders = async () => {
  const querySnapshot = await getDocs(collection(db, 'orders'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getOrder = async (id: string) => {
  const docRef = doc(db, 'orders', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const createOrder = async (tableNumber: number) => {
  const docRef = await addDoc(collection(db, 'orders'), {
    tableNumber,
    status: 'PENDING',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    items: [],
  });
  return docRef.id;
};

export const updateOrder = async (id: string, data: any) => { // Consider defining a more specific type for order updates
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
};

export const deleteOrder = async (id: string) => {
  const docRef = doc(db, 'orders', id);
  await deleteDoc(docRef);
};

// --- Menu ---

export const getMenu = async () => {
  const docRef = doc(db, 'menu', 'main'); // Assuming a single document with ID 'main'
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

export const updateMenu = async (data: any) => { // Consider defining a more specific type for menu updates
  const docRef = doc(db, 'menu', 'main');
  await updateDoc(docRef, data);
};

// --- Dishes ---

export const getDishes = async () => {
  const querySnapshot = await getDocs(collection(db, 'dishes'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDish = async (id: string) => {
  const docRef = doc(db, 'dishes', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const createDish = async (data: any) => {  // Consider defining a more specific type for dish creation
  const docRef = await addDoc(collection(db, 'dishes'), data);
  return docRef.id;
};

export const updateDish = async (id: string, data: any) => { // Consider defining a more specific type for dish updates
  const docRef = doc(db, 'dishes', id);
  await updateDoc(docRef, data);
};

export const deleteDish = async (id: string) => {
  const docRef = doc(db, 'dishes', id);
  await deleteDoc(docRef);
};