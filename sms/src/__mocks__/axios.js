// src/__mocks__/axios.js
const mockAxios = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
  };
  
  mockAxios.post.mockImplementation((url, data, config = {}) => {
    if (url === 'http://206.189.142.249:8050/auth/signup' || url === 'http://206.189.142.249:8050/auth/login') {
      return Promise.resolve({ status: 200, data: { success: true, data: {} } });
    }
    return Promise.resolve({ status: 200, data: { success: true, data: {} } });
  });
  
  mockAxios.get.mockResolvedValue({ status: 200, data: { success: true, data: {} } });
  
  export default mockAxios;