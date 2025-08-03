import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  deleteDoc,
  writeBatch
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

  // Delete a single recommendation by ID
  async deleteSingleRecommendation(userId: string, recommendationId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'recommendations', recommendationId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting single recommendation:', error);
      throw new Error('Gagal menghapus rekomendasi');
    }
  }

  // Delete all recommendations for a user
  async deleteRecommendationHistory(userId: string): Promise<void> {
    try {
      const q = query(collection(db, 'users', userId, 'recommendations'));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting recommendation history:', error);
      throw new Error('Gagal menghapus riwayat rekomendasi');
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

export const deleteRecommendation = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'recommendations', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting recommendation:', error);
    throw new Error('Failed to delete recommendation');
  }
};

export const getRecommendationHistory = async (): Promise<any[]> => {
  try {
    const q = query(
      collection(db, 'recommendations'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    const recommendations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
    
    return recommendations;
  } catch (error) {
    console.error('Error getting recommendation history:', error);
    // Return mock data for demo purposes
    return [
      {
        id: '1',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        healthConditions: ['diabetes', 'hipertensi'],
        availableIngredients: ['bayam', 'ayam', 'nasi merah', 'wortel', 'tomat'],
        targetCalories: 2000,
        recommendations: [
          {
            name: 'Bayam Rebus',
            health_score: 4,
            calories: 41,
            protein: 2.2,
            carbohydrates: 6.3,
            fat: 0.8
          },
          {
            name: 'Ayam Panggang',
            health_score: 4,
            calories: 302,
            protein: 18.2,
            carbohydrates: 0,
            fat: 25
          }
        ],
        nutritionAnalysis: {
          total_calories: 1571,
          protein_percentage: 36.1,
          carb_percentage: 30.7,
          fat_percentage: 34.5,
          fiber_content: 2.2,
          sugar_content: 0.4
        }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        healthConditions: ['obesitas'],
        availableIngredients: ['brokoli', 'ikan', 'kentang', 'wortel'],
        targetCalories: 1500,
        recommendations: [
          {
            name: 'Brokoli Kukus',
            health_score: 5,
            calories: 55,
            protein: 3.7,
            carbohydrates: 11.2,
            fat: 0.6
          },
          {
            name: 'Ikan Bakar',
            health_score: 4,
            calories: 206,
            protein: 22.0,
            carbohydrates: 0,
            fat: 12.0
          }
        ],
        nutritionAnalysis: {
          total_calories: 1200,
          protein_percentage: 40.2,
          carb_percentage: 25.1,
          fat_percentage: 34.7,
          fiber_content: 3.1,
          sugar_content: 1.2
        }
      }
    ];
  }
}; 