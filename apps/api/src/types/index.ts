// import { Role } from "@/types/role-permissions";

// Environment for some libraries
export const NodeEnv = {
  DEVELOPMENT: 'DEVELOPMENT',
  PRODUCTION: 'PRODUCTION',
} as const;

export type NodeEnv = (typeof NodeEnv)[keyof typeof NodeEnv];

// HttpStatus for response
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,

  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];


// ApiResponse for utils
// export type ApiResponse<T> = {
//   data?: T;
//   error?: string;
// };


// AuthContext for authorization
export type AuthContext = {
  id?: string;
  email?: string
  // workspaceId?: string;
  // role?: Role;
};

declare module 'express' {
  interface Request {
    auth?: AuthContext;
  }
}

