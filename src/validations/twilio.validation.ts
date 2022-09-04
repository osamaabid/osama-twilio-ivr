import Joi from 'joi';

const create = Joi.object({
  callId: Joi.string().required(),
  callStatus: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  callType: Joi.string().required(),
  forwardedCallBridged: Joi.string().required(),
  forwardedCallDuration: Joi.string().required(),
  forwardedCallStatus: Joi.string().required(),
  recordingId: Joi.string().required(),
  recordingUrl: Joi.string().required(),
  recordingDuration: Joi.string().required(),
});

export default { create };
