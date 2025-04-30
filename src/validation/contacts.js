import Joi from 'joi';
import { typeList } from '../constants/contacts.js ';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be at most 20 characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Phone number must be a string',
    'string.min': 'Phone number must be at least 3 characters',
    'string.max': 'Phone number must be at most 20 characters',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().min(3).max(20).email().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.min': 'Email must be at least 3 characters',
    'string.max': 'Email must be at most 20 characters',
    'string.email': 'Please enter a valid email address',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite must be true or false',
  }),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList)
    .required()
    .messages({
      'string.base': 'Contact type must be a string',
      'string.empty': 'Contact type cannot be empty',
      'string.min': 'Contact type must be at least 3 characters',
      'string.max': 'Contact type must be at most 20 characters',
      'any.required': 'Contact type is required',
      'any.only': `Contact type must be one of the following: ${typeList.join(
        ', ',
      )}`,
    }),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be at most 20 characters',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'Phone number must be a string',
    'string.min': 'Phone number must be at least 3 characters',
    'string.max': 'Phone number must be at most 20 characters',
  }),
  email: Joi.string().min(3).max(20).email().messages({
    'string.base': 'Email must be a string',
    'string.min': 'Email must be at least 3 characters',
    'string.max': 'Email must be at most 20 characters',
    'string.email': 'Please enter a valid email address',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite must be true or false',
  }),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList)
    .messages({
      'string.base': 'Contact type must be a string',
      'string.min': 'Contact type must be at least 3 characters',
      'string.max': 'Contact type must be at most 20 characters',
      'any.only': `Contact type must be one of the following: ${typeList.join(
        ', ',
      )}`,
    }),
});
