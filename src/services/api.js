import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {
    'Accept': 'application/json',
  },
});

export const apiService = {
  getBaseUrl: () => API_BASE_URL,

  /**
   * Ping backend health endpoint
   * GET /health
   */
  async checkHealth() {
    const startTime = performance.now();
    try {
      const response = await apiClient.get('/health');
      const latency = Math.round(performance.now() - startTime);
      return {
        online: true,
        latency,
        data: response.data,
      };
    } catch (error) {
      return {
        online: false,
        latency: null,
        error: error.message || 'Cannot reach FastAPI backend server',
      };
    }
  },

  /**
   * Fetch list of supported crop classes
   * GET /classes
   */
  async getClasses() {
    const response = await apiClient.get('/classes');
    return response.data;
  },

  /**
   * Send leaf image for deep learning prediction
   * POST /predict with FormData field 'file'
   */
  async predictDisease(imageFile) {
    if (!imageFile) {
      throw new Error('Please select or drop an image file to analyze.');
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await apiClient.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Generate Grad-CAM saliency explainability heatmap
   * POST /explain with FormData field 'file'
   */
  async explainPrediction(imageFile) {
    if (!imageFile) {
      throw new Error('Please select an image file to generate Grad-CAM explanation.');
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await apiClient.post('/explain', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Fetch actual model metrics and confusion matrix
   * GET /metrics
   */
  async getModelMetrics() {
    const response = await apiClient.get('/metrics');
    return response.data;
  },
};

export default apiClient;
