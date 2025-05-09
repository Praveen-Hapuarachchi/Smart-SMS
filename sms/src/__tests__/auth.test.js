// src/__tests__/auth.test.js
import { registerTeacher, registerStudent, sendUserAuthRequest } from '../api-helpers/api-helpers';
import axios from 'axios';

jest.mock('axios');

describe('Authentication API Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restores console.error and other mocks
    localStorage.clear();
  });

  // Test for registerTeacher
  describe('registerTeacher', () => {
    it('should register a teacher successfully', async () => {
      const teacherData = { fullName: 'John Doe', email: 'john@example.com', password: 'password123' };
      const mockResponse = { data: { success: true, user: teacherData }, status: 200 };
      axios.post.mockResolvedValue(mockResponse);

      const result = await registerTeacher(teacherData);

      expect(axios.post).toHaveBeenCalledWith(
        'http://206.189.142.249:8050/auth/signup',
        {
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'TEACHER',
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error during teacher registration', async () => {
      const teacherData = { fullName: 'John Doe', email: 'john@example.com', password: 'password123' };
      const errorMessage = 'Server Error';
      axios.post.mockRejectedValue(new Error(errorMessage));

      const result = await registerTeacher(teacherData);

      expect(axios.post).toHaveBeenCalledWith(
        'http://206.189.142.249:8050/auth/signup',
        {
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'TEACHER',
        }
      );
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error during teacher registration:', errorMessage);
    });

    it('should handle unauthorized response', async () => {
      const teacherData = { fullName: 'John Doe', email: 'john@example.com', password: 'password123' };
      axios.post.mockResolvedValue({ status: 401, data: { error: 'Unauthorized' } });

      const result = await registerTeacher(teacherData);

      expect(result).toBeNull();
    });
  });

  // Test for registerStudent
  describe('registerStudent', () => {
    it('should register a student successfully', async () => {
      const studentData = { fullName: 'Jane Doe', email: 'jane@example.com', password: 'password123' };
      const mockResponse = { data: { success: true, user: studentData }, status: 200 };
      axios.post.mockResolvedValue(mockResponse);

      const result = await registerStudent(studentData);

      expect(axios.post).toHaveBeenCalledWith(
        'http://206.189.142.249:8050/auth/signup',
        {
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
          role: 'STUDENT',
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error during student registration', async () => {
      const studentData = { fullName: 'Jane Doe', email: 'jane@example.com', password: 'password123' };
      const errorMessage = 'Server Error';
      axios.post.mockRejectedValue(new Error(errorMessage));

      const result = await registerStudent(studentData);

      expect(axios.post).toHaveBeenCalledWith(
        'http://206.189.142.249:8050/auth/signup',
        {
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
          role: 'STUDENT',
        }
      );
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error during student registration:', errorMessage);
    });

    it('should handle unauthorized response', async () => {
      const studentData = { fullName: 'Jane Doe', email: 'jane@example.com', password: 'password123' };
      axios.post.mockResolvedValue({ status: 401, data: { error: 'Unauthorized' } });

      const result = await registerStudent(studentData);

      expect(result).toBeNull();
    });
  });

  // Test for sendUserAuthRequest (Login)
  describe('sendUserAuthRequest', () => {
    it('should login user successfully', async () => {
      const loginData = { email: 'john@example.com', password: 'password123' };
      const mockResponse = { data: { success: true, token: 'mockToken' }, status: 200 };
      axios.post.mockResolvedValue(mockResponse);

      const result = await sendUserAuthRequest(loginData);

      expect(axios.post).toHaveBeenCalledWith(
        'http://206.189.142.249:8050/auth/login',
        {
          email: 'john@example.com',
          password: 'password123',
        }
      );
      expect(localStorage.getItem('jwtToken')).toBe('mockToken');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle error during login', async () => {
      const loginData = { email: 'john@example.com', password: 'password123' };
      const errorMessage = 'Invalid credentials';
      axios.post.mockRejectedValue(new Error(errorMessage));

      const result = await sendUserAuthRequest(loginData);

      expect(axios.post).toHaveBeenCalledWith(
        'http://206.189.142.249:8050/auth/login',
        {
          email: 'john@example.com',
          password: 'password123',
        }
      );
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error during authentication:', errorMessage);
    });

    it('should handle unauthorized response', async () => {
      const loginData = { email: 'john@example.com', password: 'password123' };
      axios.post.mockResolvedValue({ status: 401, data: { error: 'Unauthorized' } });

      const result = await sendUserAuthRequest(loginData);

      expect(result).toBeNull();
      expect(localStorage.getItem('jwtToken')).toBeNull();
    });
  });
});