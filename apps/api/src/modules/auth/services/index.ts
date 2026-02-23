import mongoose from 'mongoose';
import { User } from '@/models/users';
import { generateToken, hashPassword, verifyPassword } from '@/utils';
import { fail, ok, Result } from '@/utils/result';
import { CreateUser, LoginUser } from '@linktree/validation';
import { AuthResponse } from '@linktree/shared-types';

export const registerService = async (
  data: CreateUser,
): Promise<Result<AuthResponse>> => {
  try {
    const { name, username, email, password } = data;

    const isEmailExists = await User.findOne({ email }).lean();
    const isUsernameExists = await User.findOne({ username }).lean();

    if (isUsernameExists) {
      return fail('ALREADY_EXISTS', 'Username already taken');
    }

    if (isEmailExists) {
      return fail('ALREADY_EXISTS', 'Email already exists');
    }

    const passwordHash = await hashPassword(password);

    const [user] = await User.create([
      {
        name,
        username,
        email,
        passwordHash,
      },
    ]);

    await user.save();

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    const response: AuthResponse = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      token,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to register user');
  }
};

export const loginService = async (
  data: LoginUser,
): Promise<Result<AuthResponse>> => {
  try {
    const { email, password } = data;

    const user = await User.findOne({ email }).lean().select('+passwordHash');

    if (!user) {
      return fail('UNAUTHORIZED', 'Invalid email or password');
    }

    const isPasswordCorrect = await verifyPassword(password, user.passwordHash);
    console.log('checkpoint');

    if (!isPasswordCorrect) {
      return fail('UNAUTHORIZED', 'Invalid email or password');
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    const response: AuthResponse = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      token,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to login user');
  }
};
