import Joi from 'joi';

const createCall = Joi.object({
  CallSid: Joi.string().required(),
  Caller: Joi.string().required(),
});

export default { createCall };
