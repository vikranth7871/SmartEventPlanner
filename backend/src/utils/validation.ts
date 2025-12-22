import Joi from 'joi';

export const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  role: Joi.string().valid('attendee', 'organizer', 'admin').default('attendee')
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const eventSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().optional(),
  venue: Joi.string().min(3).required(),
  date_time: Joi.date().greater('now').required(),
  category: Joi.string().required(),
  capacity: Joi.number().integer().min(1).required(),
  ticket_price: Joi.number().min(0).default(0),
  image_url: Joi.string().uri().optional()
});

export const bookingSchema = Joi.object({
  event_id: Joi.number().integer().required(),
  tickets_booked: Joi.number().integer().min(1).required()
});

export const eventUpdateSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  description: Joi.string().optional(),
  venue: Joi.string().min(3).optional(),
  date_time: Joi.date().greater('now').optional(),
  category: Joi.string().optional(),
  capacity: Joi.number().integer().min(1).optional(),
  ticket_price: Joi.number().min(0).optional(),
  image_url: Joi.string().uri().optional()
});