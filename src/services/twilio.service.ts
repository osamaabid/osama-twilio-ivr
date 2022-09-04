import { Call } from '../models/call.model.';
import Twilio from '../interfaces/twilio.interface';
import { client, twilio } from '../config/twilio';

class TwilioService {
  private call = Call;
  public VoiceResponse = twilio.twiml.VoiceResponse;

  //Create New Call
  public async createCall(
    callId: string,
    phoneNumber: string
  ): Promise<String> {
    try {
      const call = await this.call.create({
        callId,
        phoneNumber,
        callStatus: 'in-progress',
      });
      const bot = new this.VoiceResponse();
      const botResponse = bot.gather({
        numDigits: 1,
        action: '/api/v1/twilio/call-process',
        method: 'POST',
      });
      botResponse.say(
        'Hello. Press 1 to call Osama. Press 2 to leave a voicemail.'
      );

      return bot.toString();
    } catch (error) {
      throw new Error('Unable to Call');
    }
  }

  //Process Call
  public async processCall(callId: string, digits: string): Promise<String> {
    try {
      const callType: any = { 1: 'Call Forwarding', 2: 'Voicemail' };
      await Call.updateOne(
        { callId: callId },
        { callType: callType[digits] ?? 'Wrong Option' }
      );
      const bot = new this.VoiceResponse();
      if (digits) {
        switch (digits) {
          case '1':
            bot.say("Connecting you to Osama's phone Number.");
            bot.dial(
              {
                action: '/api/v1/twilio/call-forwarding',
                method: 'POST',
              },
              '+923223419894'
            );
            break;
          case '2':
            bot.say('Please leave a message after the beep.');
            bot.record({
              timeout: 5,
              maxLength: 5,
              method: 'POST',
              action: '/api/v1/twilio/call-record',
              recordingStatusCallbackMethod: 'POST',
              recordingStatusCallbackEvent: ['completed'],
              recordingStatusCallback: '/api/v1/twilio/record-completed',
            });
            break;
          default:
            //if any other number is dialed, the call would again ask to Press 1 or 2
            bot.redirect('/api/v1/twilio/');
        }
      }
      return bot.toString();
    } catch (error) {
      throw new Error('Unable to Call');
    }
  }

  public async forwardCall(
    callId: string,
    callStatus: string,
    forwardedCallBridged: string,
    forwardedCallDuration: string,
    forwardedCallStatus: string
  ): Promise<String> {
    try {
      const bot = new this.VoiceResponse();
      await Call.updateOne(
        { callId },
        {
          callStatus,
          forwardedCallBridged,
          forwardedCallDuration,
          forwardedCallStatus,
        }
      );
      if (callStatus === 'in-progress') {
        return bot.toString();
      } else {
        bot.hangup();
        return bot.toString();
      }
    } catch (error) {
      throw new Error('Unable to Forward Call');
    }
  }

  public async recordCall(callId: string): Promise<String> {
    try {
      const bot = new this.VoiceResponse();
      await Call.updateOne({ callId }, { callStatus: 'completed' });
      bot.hangup();
      return bot.toString();
    } catch (error) {
      throw new Error('Unable to Record Call');
    }
  }

  public async recordingComplete(
    callId: string,
    recordingId: string,
    recordingUrl: string,
    recordingDuration: string
  ): Promise<String> {
    try {
      const bot = new this.VoiceResponse();

      await Call.updateOne(
        { callId },
        {
          recordingId,
          recordingUrl: `${recordingUrl}.mp3`,
          recordingDuration,
        }
      );
      return bot.toString();
    } catch (error) {
      throw new Error('Unable to Update Recorded Call');
    }
  }

  public async callActivity(): Promise<any> {
    try {
      const calls = await Call.find({});
      return calls;
    } catch (error) {
      throw new Error('Unable to Fetch Calls Activity');
    }
  }
}

export default TwilioService;
