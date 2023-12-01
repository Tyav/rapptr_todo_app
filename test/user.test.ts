process.env.JWT_EXPIRES = '5';
process.env.JWT_SECRET = 'repptr';
import setupTestDB from './setupDB';
import supertest from 'supertest';
setupTestDB();
import app from '../src/app';
import { ErrorCode } from '../src/interfaces/error.interface';
import userService from '../src/services/user.service';

describe('User login and register test', () => {
  describe('Register logic', () => {
    test('should create a user', async () => {
      await supertest(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'test_user',
        })
        .expect(201)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'User created successfully',
            // data: {
            //   user: {
            //     username: 'test_user',
            //     createdAt: expect.any(String),
            //     updatedAt: expect.any(String),
            //     id: expect.stringMatching(/^[a-f0-9]{24}$/)
            //   },
            // }
          });
        });
    });
    test('should error if username is alrady taken', async () => {
      await userService.createUser('test_user');
      await supertest(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'test_user',
        })
        .expect(409)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Username is taken',
            code: ErrorCode.CONFLICT,
            data: {
              username: 'test_user',
            },
          });
        });
    });
  });

  describe('Login logic', () => {
    test('should create a user', async () => {
      await userService.createUser('test_user');
      await supertest(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'test_user',
        })
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'User logged in successfully',
            data: {
              user: {
                username: 'test_user',
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                id: expect.stringMatching(/^[a-f0-9]{24}$/),
              },
              token: expect.any(String),
            },
          });
        });
    });
    test('should return error response if username has not been created', async () => {
      await supertest(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'test_user',
        })
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({
            code: 'RESOURCE_NOT_FOUND',
            message: 'User does not exist',
            data: {
              username: 'test_user',
            },
          });
        });
    });
  });
});
