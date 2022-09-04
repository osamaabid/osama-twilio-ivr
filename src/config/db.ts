import mongoose from 'mongoose';

const dbUri: string = process.env.MONGO_URI!;

export const connectDb = async () => {
  try {
    const conn: any = await mongoose.connect(dbUri);
    console.log(`Db connected: ${conn.connection.host}`);
  } catch (err: any) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};
