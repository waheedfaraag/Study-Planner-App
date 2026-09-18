import axios from 'axios';

const BASE_URL = 'https://web-production-2f6b.up.railway.app';

// توكين تجريبي (حساب Waheed Test)
// لاحقاً هيتحط من Login / AsyncStorage
const API_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MCIsImV4cCI6MTc4OTY5NjU2MX0.2zUEmm8crzAQ1HZH-ccS__AACYoj8V1gykwvsmS2bVw';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const apiTasks = {
  // GET /tasks/
  getTasks: async () => {
    const res = await api.get('/tasks/');
    return res.data;
  },

  // POST /tasks/
  createTask: async (task) => {
    const res = await api.post('/tasks/', task);
    return res.data;
  },

  // GET /tasks/{id}
  getTaskById: async (id) => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  // PUT /tasks/{id}
  updateTask: async (id, task) => {
    const res = await api.put(`/tasks/${id}`, task);
    return res.data;
  },

  // DELETE /tasks/{id}
  deleteTask: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

  // PATCH /tasks/{id}/complete
  completeTask: async (id) => {
    const res = await api.patch(`/tasks/${id}/complete`);
    return res.data;
  },

  // PATCH /tasks/{id}/undo
  undoTask: async (id) => {
    const res = await api.patch(`/tasks/${id}/undo`);
    return res.data;
  },
};

// Categories 
export const apiCategories = {
  getCategories: async () => {
    const res = await api.get('/categories/');
    return res.data;
  },
  createCategory: async (name) => {
    const res = await api.post('/categories/', { name });
    return res.data;
  },
};