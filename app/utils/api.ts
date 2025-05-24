import { API_ENDPOINTS, ERROR_MESSAGES } from './constants';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface ApiError {
  message: string;
  status?: number;
}

const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      message: error.response.data?.message || ERROR_MESSAGES.SERVER_ERROR,
      status: error.response.status,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
    };
  }
};

const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: handleApiError(error).message };
  }
};

// Boards API
export const boardsApi = {
  getAll: () => fetchApi(API_ENDPOINTS.BOARDS),
  getById: (id: string) => fetchApi(`${API_ENDPOINTS.BOARDS}/${id}`),
  create: (data: any) =>
    fetchApi(API_ENDPOINTS.BOARDS, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${id}`, {
      method: 'DELETE',
    }),
};

// Tasks API
export const tasksApi = {
  getAll: (boardId: string) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${boardId}/tasks`),
  getById: (boardId: string, taskId: string) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${boardId}/tasks/${taskId}`),
  create: (boardId: string, data: any) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${boardId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (boardId: string, taskId: string, data: any) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${boardId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (boardId: string, taskId: string) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${boardId}/tasks/${taskId}`, {
      method: 'DELETE',
    }),
  updateStatus: (boardId: string, taskId: string, status: string) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${boardId}/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  updatePriority: (boardId: string, taskId: string, priority: string) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${boardId}/tasks/${taskId}/priority`, {
      method: 'PATCH',
      body: JSON.stringify({ priority }),
    }),
};

// Tags API
export const tagsApi = {
  getAll: (boardId: string) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${boardId}/tags`),
  getById: (boardId: string, tagId: string) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${boardId}/tags/${tagId}`),
  create: (boardId: string, data: any) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${boardId}/tags`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (boardId: string, tagId: string, data: any) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${boardId}/tags/${tagId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (boardId: string, tagId: string) =>
    fetchApi(`${API_ENDPOINTS.BOARDS}/${boardId}/tags/${tagId}`, {
      method: 'DELETE',
    }),
};

// Users API
export const usersApi = {
  getCurrent: () => fetchApi(`${API_ENDPOINTS.USERS}/me`),
  updatePreferences: (data: any) =>
    fetchApi(`${API_ENDPOINTS.USERS}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}; 