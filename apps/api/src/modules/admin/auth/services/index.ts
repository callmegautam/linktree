import { AdminLogin, AdminResponse, CreateAdminBody,  } from "@linktree/validation";
import { fail, generateToken, hashPassword, ok, Result, verifyPassword } from "@/utils";
import { Admin } from "@/models/admin";

export const adminLoginService = async (data: AdminLogin): Promise<Result<AdminResponse>> => {
  try {
    const { email, password } = data;

    const admin = await Admin.findOne({ email }).lean().select('+passwordHash');

    if (!admin) {
      return fail('UNAUTHORIZED', 'Invalid email or password');
    }

    const isPasswordCorrect = await verifyPassword(password, admin.passwordHash);

    if (!isPasswordCorrect) {
      return fail('UNAUTHORIZED', 'Invalid email or password');
    }

    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
    });

    const response: AdminResponse = {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      token,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to login admin');
  }
}


export const adminRegisterService = async (data: CreateAdminBody): Promise<Result<AdminResponse>> => {
  try {
    const { name, email, password, role } = data;

    const isEmailExists = await Admin.findOne({ email }).lean();
    if (isEmailExists) {
      return fail('ALREADY_EXISTS', 'Email already exists');
    }

    const passwordHash = await hashPassword(password);
    const admin = await Admin.create({ name, email, passwordHash, role });

    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
    });

    const response: AdminResponse = {
      id: admin._id.toString(),
      name: admin.name,
      token,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to register admin');
  }
}