import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production'],
    }),
    PORT: port({ default: 3000 }),
    MONGO_URI: str(),
    TWILIO_ACCOUNT_SID: str(),
    TWILIO_AUTH_TOKEN: str(),
    TWILIO_PHONE_NUMBER: str(),
  });
}

export default validateEnv;
