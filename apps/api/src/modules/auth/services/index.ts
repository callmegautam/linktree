import { Profile } from '@/models/profile';
import { User } from '@/models/users';
import { createProfileService } from '@/modules/profile/services';
import { ThemeModel } from '@/models/theme';
import { Links } from '@/models/links';
import { generateToken, hashPassword, verifyPassword } from '@/utils';
import { fail, ok, Result } from '@/utils/result';
import { RegisterBody, LoginBody, UserResponse, ChangePasswordBody } from '@linktree/validation';

export const registerService = async (
  data: RegisterBody,
): Promise<Result<UserResponse>> => {
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

    await createProfileService({
      user_id: user._id.toString(),
      display_name: user.name,
      bio: '',
      avatar_url: '',
    });

    const response: UserResponse = {
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
  data: LoginBody,
): Promise<Result<UserResponse>> => {
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

    const response: UserResponse = {
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


export const deleteUserService = async (userId: string): Promise<Result<string>> => {
  try {
    const user = await User.findOneAndDelete({ _id: userId });
    if (!user) {
      return fail('NOT_FOUND', 'User not found');
    }
    await Profile.findOneAndDelete({ user_id: userId });
    await ThemeModel.findOneAndDelete({ user_id: userId });
    await Links.deleteMany({ user_id: userId });
    
    return ok('User deleted successfully' as const);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to delete user');
  }
}
