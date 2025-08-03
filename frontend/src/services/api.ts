const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface FoodItem {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  health_score: number;
  health_labels: string[];
  suitable_for: string[];
  region: string;
  description: string;
  recommendation_score?: number;
}

export interface NutritionAnalysis {
  total_calories: number;
  protein_percentage: number;
  carb_percentage: number;
  fat_percentage: number;
  fiber_content: number;
  sugar_content: number;
}

export interface RecommendationResult {
  success: boolean;
  recommended_foods: FoodItem[];
  nutrition_analysis: NutritionAnalysis;
  health_advice: string[];
  meal_plans: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all foods
  async getFoods(): Promise<ApiResponse<FoodItem[]>> {
    return this.request<ApiResponse<FoodItem[]>>('/foods');
  }

  // Get food categories
  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.request<ApiResponse<string[]>>('/categories');
  }

  // Get foods by category
  async getFoodsByCategory(category: string): Promise<ApiResponse<FoodItem[]>> {
    return this.request<ApiResponse<FoodItem[]>>(`/foods/category/${encodeURIComponent(category)}`);
  }

  // Get health conditions
  async getHealthConditions(): Promise<ApiResponse<string[]>> {
    return this.request<ApiResponse<string[]>>('/health-conditions');
  }

  // Get recommendations
  async getRecommendations(data: {
    health_conditions: string[];
    available_ingredients: string[];
    target_calories?: number;
  }): Promise<RecommendationResult> {
    return this.request<RecommendationResult>('/recommendations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    return this.request<{ status: string; message: string; timestamp: string }>('/health');
  }

  // Save recommendation to backend
  async saveRecommendation(data: {
    userId: string;
    ingredients: string[];
    recommendation_result: any;
  }): Promise<{ success: boolean; message: string; recommendationId?: string }> {
    return this.request<{ success: boolean; message: string; recommendationId?: string }>('/save-recommendation', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
export default apiService; 