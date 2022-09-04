import { Schema, model } from 'mongoose';
import Twilio from '../interfaces/twilio.interface';

const callSchema = new Schema(
  {
    callId: {
      type: String,
    },
    callStatus: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    callType: {
      type: String,
    },
    forwardedCallBridged: {
      type: Boolean,
    },
    forwardedCallDuration: {
      type: String,
    },
    forwardedCallStatus: {
      type: String,
    },
    recordingId: {
      type: String,
    },
    recordingUrl: {
      type: String,
    },
    recordingDuration: {
      type: String,
    },
  },
  { timestamps: true }
);

const Call = model<Twilio>('call', callSchema);

export { Call };
