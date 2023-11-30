import setupTestDB from './setupDB';
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
              isDeleted: false,
            },
          });
        });
    });
    test('Server should return validation error response if there is no title', async () => {
      await supertest(app)
        .post('/api/v1/todos')
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
  });
  describe('Update TODO PATCH: /api/v1/todos/{todoId}', () => {
    test('Server should update Todo if title is passed', async () => {
      const todo = await todoService.createTodo('First todo');
      await supertest(app)
        .patch(`/api/v1/todos/${todo.id}`)
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
            },
          });
        });
      const updateTodo = await todoService.getTodoById(todo.id);
      expect(updateTodo?.title).toBe('Changed todo');
    });
    test('Server should return validation error response if there is no title', async () => {
      const todo = await todoService.createTodo('First todo');
      await supertest(app)
        .patch(`/api/v1/todos/${todo.id}`)
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
      const todo = await todoService.createTodo('First todo');
      await supertest(app)
        .patch(`/api/v1/todos/${todo.title}`)
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
      await supertest(app)
        .patch(`/api/v1/todos/65681286e276dea4a21fdce8`)
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
      const todo = await todoService.createTodo('First todo');
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

});
