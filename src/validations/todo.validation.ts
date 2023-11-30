import Joi from 'joi';
import { objectId } from './custom.validation';

const createTodoBody = {
  title: Joi.string().required()
}
const updateTodoBody = {
  title: Joi.string()
}
const updateTodoParams = {
  todoId: Joi.string().custom(objectId)
}

export const createTodo = {
  body: Joi.object().keys(createTodoBody)
}

export const updateTodo = {
  params: Joi.object().keys(updateTodoParams),
  body: Joi.object().keys(updateTodoBody).min(1)
}