import setupTestDB from './setupDB';
import supertest from 'supertest';
setupTestDB();
import app from '../src/app';
import { ErrorCode } from '../src/interfaces/error.interface';
/**
 * All test should be written, however this is for demo purposes
 */
describe('Test for Todo', () => {
  describe('Create TODO POST: /api/v1/todos', () => {
    test('Server should create Todo if title is passed', async () => {
      await supertest(app)
        .post('/api/v1/todos')
        .send({ title: 'First todo' })
        .expect(201)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Todo created',
            data: {
              title: 'First todo',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              id: expect.stringMatching(/^[a-f0-9]{24}$/),
            },
          });
        });

        
    });
    test('Server should return validation error response if there is no title', async () => {
      await supertest(app)
        .post('/api/v1/todos')
        .send({ })
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Invalid fields',
            code: ErrorCode.BAD_REQUEST,
            data: {
              title: 'title is required'
            },
          });
        });
    });
  });
});
