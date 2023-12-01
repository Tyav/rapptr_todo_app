import { CustomHelpers } from 'joi';

// Custom validation for strings to match mongoose ObjectId format
export const objectId = (value: string, helpers: CustomHelpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({ custom: '"{{#label}}" must be a valid mongo id' });
  }
  return value;
};

export const usernameValidator = (value: string, helpers: CustomHelpers) => {
  if (value.match(/[\s]/)) {
    return helpers.message({ custom: '"{{#lebel}}" must not have a space'})
  }
  return value
}