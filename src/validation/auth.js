import Joi from 'joi';
import { emailRegexp } from '../constants/auth.js';

export const authRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 20 characters long',
    'any.required': 'Name is required',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.pattern.base': 'Email has an invalid format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(20).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password must be at most 20 characters long',
    'any.required': 'Password is required',
  }),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.pattern.base': 'Email has an invalid format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(20).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password must be at most 20 characters long',
    'any.required': 'Password is required',
  }),
});
