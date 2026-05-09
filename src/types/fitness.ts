export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  age?: number;
  weight?: number; // kg
  height?: number; // cm
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitnessGoals?: string[];
  createdAt: any;
}

export interface Goal {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: any;
  status: 'in_progress' | 'completed' | 'abandoned';
  createdAt: any;
}

export interface Exercise {
  name: string;
  reps?: string;
  sets?: number;
  duration?: string;
}

export interface Workout {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  title: string;
  exercises: Exercise[];
  difficulty: string;
  estimatedTime: number; // minutes
  generatedAt: any;
}

export interface WorkoutLog {
  id?: string;
  userId: string;
  workoutId?: string;
  title: string;
  date: any;
  duration: number;
  notes?: string;
}
