import { Role, UserStatus } from './auth';

export interface User {
  userId: string;
  email: string;
  nickname: string;
  roles: Role[];
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
} 