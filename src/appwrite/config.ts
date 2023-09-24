import config from '@/config/config';
import { Client, Account, ID } from 'appwrite';

// create types
type CreateUserAccount = {
  email: string;
  password: string;
  name: string;
};

type LoginUserAccount = {
  email: string;
  password: string;
};

const appwriteClient = new Client();

appwriteClient
  .setEndpoint(config.appwriteUrl)
  .setProject(config.appwriteProjectId);

export const account = new Account(appwriteClient);

export class AppwriteService {
  // create a new record of user inside appwrite
  async createUserAccount({ email, password, name }: CreateUserAccount) {
    try {
      const userAccount = await account.create(
        ID.unique(),
        email,
        password,
        name,
      );

      if (userAccount) {
        await this.sendVerificationEmail();
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error: any) {
      throw error;
    }
  }

  async sendVerificationEmail() {
    const promise = account.createVerification('http://localhost:3000/verify');

    promise.then(
      function (response) {
        console.log(response);
      },
      function (error) {
        console.log(error);
      },
    );
  }

  async updateVerificationEmail(userId: string, secret: string) {
    try {
      const response = await account.updateVerification(userId, secret);

      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async updateEmail(newEmail: string, newPassword: string) {
    try {
      const response = await account.updateEmail(newEmail, newPassword);

      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async isEmailVerified(): Promise<boolean> {
    try {
      const user = await account.get();
      return user.emailVerification;
    } catch (error: any) {
      throw error;
    }
  }

  async login({ email, password }: LoginUserAccount) {
    try {
      return await account.createEmailSession(email, password);
    } catch (error: any) {
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const data = await this.getCurrentUser();
      return Boolean(data);
    } catch (error: any) {}

    return false;
  }

  async getCurrentUser() {
    try {
      return account.get();
    } catch (error: any) {
      console.log('getCurrentUser error: ', error);
    }
  }

  async logout() {
    try {
      return account.deleteSession('current');
    } catch (error: any) {
      console.log('logout error: ', error);
    }
  }
}

const appwriteService = new AppwriteService();

export default appwriteService;
