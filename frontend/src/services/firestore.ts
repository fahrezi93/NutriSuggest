import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { FoodItem } from './api';

export interface RecommendationData {
  timestamp: Date;
  ingredients: string[];
  recommendation_result: {
    foods: FoodItem[];
    nutrition_analysis: {
      total_calories: number;
      protein_percentage: number;
      carb_percentage: number;
      fat_percentage: number;
      fiber_content: number;
      sugar_content: number;
    };
    health_advice: string[];
  };
}

export interface SavedRecommendation {
  id: string;
  timestamp: Date;
  ingredients: string[];
  recommendation_result: {
    foods: FoodItem[];
    nutrition_analysis: {
      total_calories: number;
      protein_percentage: number;
      carb_percentage: number;
      fat_percentage: number;
      fiber_content: number;
      sugar_content: number;
    };
    health_advice: string[];
  };
}

class FirestoreService {
  // Save recommendation to Firestore
  async saveRecommendation(userId: string, data: RecommendationData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'users', userId, 'recommendations'), {
        timestamp: serverTimestamp(),
        ingredients: data.ingredients,
        recommendation_result: data.recommendation_result
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving recommendation:', error);
      throw new Error('Gagal menyimpan rekomendasi');
    }
  }

  // Get user's recommendation history
  async getRecommendationHistory(userId: string, limitCount: number = 10): Promise<SavedRecommendation[]> {
    try {
      const q = query(
        collection(db, 'users', userId, 'recommendations'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const recommendations: SavedRecommendation[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        recommendations.push({
          id: doc.id,
          timestamp: data.timestamp?.toDate() || new Date(),
          ingredients: data.ingredients || [],
          recommendation_result: data.recommendation_result || {}
        });
      });
      
      return recommendations;
    } catch (error) {
      console.error('Error getting recommendation history:', error);
      throw new Error('Gagal mengambil riwayat rekomendasi');
    }
  }

  // Get recommendation by ID
  async getRecommendationById(userId: string, recommendationId: string): Promise<SavedRecommendation | null> {
    try {
      const docRef = doc(db, 'users', userId, 'recommendations', recommendationId);
      const docSnap = await getDocs(collection(db, 'users', userId, 'recommendations'));
      
      const recommendation = docSnap.docs.find(doc => doc.id === recommendationId);
      
      if (recommendation) {
        const data = recommendation.data();
        return {
          id: recommendation.id,
          timestamp: data.timestamp?.toDate() || new Date(),
          ingredients: data.ingredients || [],
          recommendation_result: data.recommendation_result || {}
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting recommendation by ID:', error);
      throw new Error('Gagal mengambil rekomendasi');
    }
  }
}

export const firestoreService = new FirestoreService();
export default firestoreService; 