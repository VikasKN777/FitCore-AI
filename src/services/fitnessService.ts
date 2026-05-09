import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  deleteDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { UserProfile, Goal, Workout, WorkoutLog } from '../types/fitness';

export const fitnessService = {
  // User Profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const path = `users/${userId}`;
    try {
      const docSnap = await getDoc(doc(db, path));
      return docSnap.exists() ? docSnap.data() as UserProfile : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async createUserProfile(profile: UserProfile): Promise<void> {
    const path = `users/${profile.uid}`;
    try {
      await setDoc(doc(db, path), {
        ...profile,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    const path = `users/${userId}`;
    try {
      await updateDoc(doc(db, path), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // Goals
  subscribeToGoals(userId: string, callback: (goals: Goal[]) => void) {
    const path = `users/${userId}/goals`;
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
      callback(goals);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async addGoal(userId: string, goal: Omit<Goal, 'id' | 'createdAt'>): Promise<void> {
    const path = `users/${userId}/goals`;
    try {
      const newGoalRef = doc(collection(db, path));
      await setDoc(newGoalRef, {
        ...goal,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Workouts
  async getWorkoutForDate(userId: string, date: string): Promise<Workout | null> {
    const path = `users/${userId}/workouts`;
    try {
      const q = query(collection(db, path), where('date', '==', date));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Workout;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async saveWorkout(userId: string, workout: Workout): Promise<void> {
    const path = `users/${userId}/workouts`;
    try {
      const newWorkoutRef = doc(collection(db, path));
      await setDoc(newWorkoutRef, {
        ...workout,
        generatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Logs
  async logWorkout(userId: string, log: Omit<WorkoutLog, 'id' | 'date'>): Promise<void> {
    const path = `users/${userId}/logs`;
    try {
      const newLogRef = doc(collection(db, path));
      await setDoc(newLogRef, {
        ...log,
        date: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  subscribeToLogs(userId: string, callback: (logs: WorkoutLog[]) => void) {
    const path = `users/${userId}/logs`;
    const q = query(collection(db, path), orderBy('date', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutLog));
      callback(logs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  }
};
