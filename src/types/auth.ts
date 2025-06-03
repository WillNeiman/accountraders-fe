export enum Role {
  USER = 'ROLE_USER',
  BUYER = 'ROLE_BUYER',
  SELLER = 'ROLE_SELLER',
  ADMIN = 'ROLE_ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  WITHDRAWN = 'WITHDRAWN'
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  roles: Role[];
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
} 