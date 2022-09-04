import { Router, Request, Response, NextFunction } from 'express';
import { client, twilio } from '../config/twilio';
import Controller from '../utils/interfaces/controller.interface';
import HttpException from '../utils/exceptions/http.exception';
import vaidationMiddleware from '../middleware/validation.middleware';
import twilioValidate from '../validations/twilio.validation';
import TwilioService from '../services/twilio.service';
import validationMiddleware from '../middleware/validation.middleware';

class TwilioController implements Controller {
  public path = '/twilio';
  public router = Router();
  public VoiceResponse = twilio.twiml.VoiceResponse;
  private TwilioService = new TwilioService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/call-activity-records`,
      //   validationMiddleware(twilioValidate.create),
      this.callActivity
    );

    this.router.post(
      `${this.path}/`,
      twilio.webhook({ validate: false }),
      //   validationMiddleware(twilioValidate.create),
      this.createCall
    );

    this.router.post(
      `${this.path}/call-process`,
      twilio.webhook({ validate: false }),
      //   validationMiddleware(twilioValidate.create),
      this.processCall
    );

    this.router.post(
      `${this.path}/call-forwarding`,
      twilio.webhook({ validate: false }),
      //   validationMiddleware(twilioValidate.create),
      this.forwardCall
    );

    this.router.post(
      `${this.path}/call-record`,
      twilio.webhook({ validate: false }),
      //   validationMiddleware(twilioValidate.create),
      this.recordCall
    );

    this.router.post(
      `${this.path}/record-completed`,
      twilio.webhook({ validate: false }),
      //   validationMiddleware(twilioValidate.create),
      this.recordComplete
    );
  }

  private createCall = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      console.log(
        `the body for this ${req.url} is ${JSON.stringify(req.body)}`
      );
      const { CallSid, Caller } = req.body;

      const newCall = await this.TwilioService.createCall(CallSid, Caller);

      res.type('text/xml');
      res.status(201).send(newCall);
    } catch (error: any) {
      console.log('the error is ', error);
      next(new HttpException(400, error.message));
    }
  };

  private processCall = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      console.log(
        `the body for this ${req.url} is ${JSON.stringify(req.body)}`
      );
      const { CallSid, Digits } = req.body;

      const newCallProcess = await this.TwilioService.processCall(
        CallSid,
        Digits
      );

      res.type('text/xml');
      res.status(200).send(newCallProcess);
    } catch (error: any) {
      console.log('the error is ', error);
      next(new HttpException(400, error.message));
    }
  };

  private forwardCall = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      console.log(
        `the body for this ${req.url} is ${JSON.stringify(req.body)}`
      );
      const {
        CallSid,
        DialCallStatus,
        DialCallDuration,
        DialBridged,
        CallStatus,
      } = req.body;

      const callForwarding = await this.TwilioService.forwardCall(
        CallSid,
        DialCallStatus,
        DialCallDuration,
        DialBridged,
        CallStatus
      );

      res.type('text/xml');
      res.status(200).send(callForwarding);
    } catch (error: any) {
      console.log('the error is ', error);
      next(new HttpException(400, error.message));
    }
  };

  private recordCall = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      console.log(
        `the body for this ${req.url} is ${JSON.stringify(req.body)}`
      );
      const { CallSid } = req.body;

      const callRecording = await this.TwilioService.recordCall(CallSid);

      res.type('text/xml');
      res.status(200).send(callRecording);
    } catch (error: any) {
      console.log('the error is ', error);
      next(new HttpException(400, error.message));
    }
  };

  private recordComplete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      console.log(
        `the body for this ${req.url} is ${JSON.stringify(req.body)}`
      );
      const { CallSid, RecordingSid, RecordingUrl, RecordingDuration } =
        req.body;

      const callRecording = await this.TwilioService.recordingComplete(
        CallSid,
        RecordingSid,
        RecordingUrl,
        RecordingDuration
      );

      res.type('text/xml');
      res.status(200).send(callRecording);
    } catch (error: any) {
      console.log('the error is ', error);
      next(new HttpException(400, error.message));
    }
  };

  private callActivity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const calls = await this.TwilioService.callActivity();
      res.status(200).send(calls);
    } catch (error: any) {
      console.log('the error is ', error);
      next(new HttpException(400, error.message));
    }
  };
}

export default TwilioController;
