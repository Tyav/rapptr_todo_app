import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import userService from '../src/services/user.service';
import tokenService from '../src/services/token.service';

let mongoServer: MongoMemoryServer;

const setupTestDB = () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany({})));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
};

export const createAndAuthUser = async (username: string) => {
  const user = await userService.createUser(username);
  const token = await tokenService.generateToken(user.id)
  return {
    user, token
  }
}

export default setupTestDB;
