import { Document } from 'mongoose';

export default interface Twilio extends Document {
  callId: string;
  callStatus: string;
  phoneNumber: string;
  callType: string;
  forwardedCallBridged: string;
  forwardedCallDuration: string;
  forwardedCallStatus: string;
  recordingId: string;
  recordingUrl: string;
  recordingDuration: string;
}
