import Joi from 'joi';

const createTodoBody = {
  title: Joi.string().required()
}
export const createTodo = {
  body: Joi.object().keys(createTodoBody)
}
