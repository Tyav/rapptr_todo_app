import setupTestDB, { createAndAuthUser } from './setupDB';
import supertest from 'supertest';
setupTestDB();
import app from '../src/app';
import { ErrorCode } from '../src/interfaces/error.interface';
import todoService from '../src/services/todo.service';
import TodoModel from '../src/models/todo.model';
/**
 * All test should be written.
 * However this is for demo purposes and not all cases will be covered
 */
describe('Test for Todo', () => {
  describe('Create TODO POST: /api/v1/todos', () => {
    test('Server should create Todo if title is passed', async () => {
      const { user, token } = await createAndAuthUser('test_user');
      await supertest(app)
        .post('/api/v1/todos')
        .set({
          'x-auth-token': token,
        })
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
              isDeleted: false,
              isCompleted: false,
              creator: user.id
            },
          });
        });
    });
    test('Server should return validation error response if there is no title', async () => {
      const { token } = await createAndAuthUser('test_user');

      await supertest(app)
        .post('/api/v1/todos')
        .set({
          'x-auth-token': token,
        })
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Invalid fields',
            code: ErrorCode.BAD_REQUEST,
            data: {
              title: 'title is required',
            },
          });
        });
    });
    test('Server should return auth error response user is not authed', async () => {
      await supertest(app)
        .post('/api/v1/todos')
        .send({})
        .expect(401)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Please authenticate',
            code: ErrorCode.UNAUTHORIZED_ACCESS,
          });
        });
    });
  });
  describe('Update TODO PATCH: /api/v1/todos/{todoId}', () => {
    test('Server should update Todo if title is passed', async () => {
      const { user, token } = await createAndAuthUser('test_user');

      const todo = await todoService.createTodo('First todo', user.id);
      await supertest(app)
        .patch(`/api/v1/todos/${todo.id}`)
        .set({
          'x-auth-token': token,
        })
        .send({ title: 'Changed todo' })
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Todo updated successfully',
            data: {
              title: 'Changed todo',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              id: expect.stringMatching(/^[a-f0-9]{24}$/),
              isDeleted: false,
              isCompleted: false,
              creator: user.id
            },
          });
        });
      const updateTodo = await todoService.getTodoById(todo.id);
      expect(updateTodo?.title).toBe('Changed todo');
    });
    test('Server should update Todo if isCompleted flag is passed', async () => {
      const { user, token } = await createAndAuthUser('test_user');

      const todo = await todoService.createTodo('First todo', user.id);
      await supertest(app)
        .patch(`/api/v1/todos/${todo.id}`)
        .set({
          'x-auth-token': token,
        })
        .send({ isCompleted: true })
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Todo updated successfully',
            data: {
              title: 'First todo',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              id: expect.stringMatching(/^[a-f0-9]{24}$/),
              isDeleted: false,
              isCompleted: true,
              creator: user.id
            },
          });
        });
      const updateTodo = await todoService.getTodoById(todo.id);
      expect(updateTodo?.isCompleted).toBe(true);
    });
    test('Server should update Todo and isCompleted field to false', async () => {
      const { user, token } = await createAndAuthUser('test_user');

      const todo = await TodoModel.create({
        title: 'First todo',
        isCompleted: true,
      });
      await supertest(app)
        .patch(`/api/v1/todos/${todo.id}`)
        .set({
          'x-auth-token': token,
        })
        .send({ isCompleted: false, title: 'Second' })
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Todo updated successfully',
            data: {
              title: 'Second',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              id: expect.stringMatching(/^[a-f0-9]{24}$/),
              isDeleted: false,
              isCompleted: false,
            },
          });
        });
      const updateTodo = await todoService.getTodoById(todo.id);
      expect(updateTodo?.isCompleted).toBe(false);
      expect(updateTodo?.title).toBe('Second');
    });
    test('Server should return validation error response if there is no title', async () => {
      const { user, token } = await createAndAuthUser('test_user');

      const todo = await todoService.createTodo('First todo', user.id);
      await supertest(app)
        .patch(`/api/v1/todos/${todo.id}`)
        .set({
          'x-auth-token': token,
        })
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Invalid fields',
            code: ErrorCode.BAD_REQUEST,
            data: {
              body: 'body must have at least 1 key',
            },
          });
        });
    });
    test('Server should return validation error if todo id is not a valid id format', async () => {
      const { user, token } = await createAndAuthUser('test_user');

      const todo = await todoService.createTodo('First todo', user.id);
      await supertest(app)
        .patch(`/api/v1/todos/${todo.title}`)
        .set({
          'x-auth-token': token,
        })
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Invalid fields',
            code: ErrorCode.BAD_REQUEST,
            data: {
              body: 'body must have at least 1 key',
              todoId: 'todoId must be a valid mongo id',
            },
          });
        });
    });
    test('Server should return no found error if todo does not exist', async () => {
      const { user, token } = await createAndAuthUser('test_user');

      await supertest(app)
        .patch(`/api/v1/todos/65681286e276dea4a21fdce8`)
        .set({
          'x-auth-token': token,
        })
        .send({ title: 'Errored Todo' })
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Todo does not exist',
            code: ErrorCode.RESOURCE_NOT_FOUND,
            data: {
              todoId: '65681286e276dea4a21fdce8',
            },
          });
        });
    });
  });
  describe('Delete TODO DELETE: /api/v1/todos/{todoId}', () => {
    test('Server should update Todo if title is passed', async () => {
      const { user, token } = await createAndAuthUser('test_user');

      const todo = await todoService.createTodo('First todo', user.id);
      await supertest(app)
        .delete(`/api/v1/todos/${todo.id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Todo deleted successfully',
          });
        });
      const deletedTodo = await todoService.getTodoById(todo.id);
      expect(deletedTodo).toBeNull();
    });
    test('Server should return no found error if todo does not exist', async () => {
      await supertest(app)
        .delete(`/api/v1/todos/65681286e276dea4a21fdce8`)
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Todo does not exist',
            code: ErrorCode.RESOURCE_NOT_FOUND,
            data: {
              todoId: '65681286e276dea4a21fdce8',
            },
          });
        });
    });
  });
  describe('Get all TODO GET: /api/v1/todos', () => {
    test('should fetch all todo in the database', async () => {
      await TodoModel.insertMany([
        { title: 'First todo' },
        { title: 'Second todo' },
      ]);
      await supertest(app)
        .get('/api/v1/todos')
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Todos retrieved successfully',
            data: {
              todos: [
                {
                  title: 'First todo',
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                  id: expect.stringMatching(/^[a-f0-9]{24}$/),
                  isDeleted: false,
                  isCompleted: false,
                },
                {
                  title: 'Second todo',
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                  id: expect.stringMatching(/^[a-f0-9]{24}$/),
                  isDeleted: false,
                  isCompleted: false,
                },
              ],
            },
          });
        });
    });
    test('should fetch all todo in the database that are not deleted', async () => {
      await TodoModel.insertMany([
        { title: 'First todo', isDeleted: true },
        { title: 'Second todo' },
      ]);
      await supertest(app)
        .get('/api/v1/todos')
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Todos retrieved successfully',
            data: {
              todos: [
                {
                  title: 'Second todo',
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                  id: expect.stringMatching(/^[a-f0-9]{24}$/),
                  isDeleted: false,
                  isCompleted: false,
                },
              ],
            },
          });
        });
    });
    test('should return empty list if there are only deleted records in database', async () => {
      await TodoModel.insertMany([
        { title: 'First todo', isDeleted: true },
        { title: 'Second todo', isDeleted: true },
      ]);
      await supertest(app)
        .get('/api/v1/todos')
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Todos retrieved successfully',
            data: {
              todos: [],
            },
          });
        });
    });
  });
  describe('Get a TODO GET: /api/v1/todos/{todoId}', () => {
    test('Server should return Todo if id matches', async () => {
      const { user, token } = await createAndAuthUser('test_user');

      const todo = await todoService.createTodo('First todo', user.id);
      await supertest(app)
        .get(`/api/v1/todos/${todo.id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Todo retrieved successfully',
            data: {
              title: 'First todo',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              id: expect.stringMatching(/^[a-f0-9]{24}$/),
              isDeleted: false,
              isCompleted: false,
              creator: user.id
            },
          });
        });
    });
    test('Server should return validation error if todo id is not a valid id format', async () => {
      const { user, token } = await createAndAuthUser('test_user');

      const todo = await todoService.createTodo('First todo', user.id);
      await supertest(app)
        .get(`/api/v1/todos/${todo.title}`)
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Invalid fields',
            code: ErrorCode.BAD_REQUEST,
            data: {
              todoId: 'todoId must be a valid mongo id',
            },
          });
        });
    });
    test('Server should return no found error if todo does not exist or is deleted', async () => {
      const { user, token } = await createAndAuthUser('test_user');

      const todo = await todoService.createTodo('First todo', user.id);
      await todoService.deleteTodo(todo);
      await supertest(app)
        .get(`/api/v1/todos/${todo.id}`)
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({
            message: 'Todo does not exist',
            code: ErrorCode.RESOURCE_NOT_FOUND,
            data: {
              todoId: todo.id,
            },
          });
        });
    });
  });
});
