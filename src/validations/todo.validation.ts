import Joi from 'joi';
import { objectId } from './custom.validation';

const createTodoBody = {
  title: Joi.string().required(),
};
const updateTodoBody = {
  title: Joi.string(),
  isCompleted: Joi.boolean(),
};
const updateAndDeleteTodoParams = {
  todoId: Joi.string().custom(objectId),
};

export const createTodo = {
  body: Joi.object().keys(createTodoBody),
};

export const updateTodo = {
  params: Joi.object().keys(updateAndDeleteTodoParams),
  body: Joi.object().keys(updateTodoBody).min(1),
};

export const deleteTodo = {
  params: Joi.object().keys(updateAndDeleteTodoParams),
};

export const getATodo = {
  params: Joi.object().keys({ todoId: Joi.string().custom(objectId) }),
};
