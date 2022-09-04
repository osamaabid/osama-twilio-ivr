import 'dotenv/config';
import validateEnv from './utils/validateEnv';
import App from './app';
import TwilioController from './controllers/twilio.controller';

validateEnv();

const app = new App([new TwilioController()], Number(process.env.PORT));

app.listen();
