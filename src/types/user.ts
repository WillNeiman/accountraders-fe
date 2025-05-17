interface Authority {
  authority: string;
}

export interface User {
  userId: string;
  nickname: string;
  email: string;
  userType: 'BUYER' | 'SELLER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  fullName: string;
  contactNumber: string;
  profilePictureUrl: string;
  isEnabled: boolean;
  authorities: Authority[];
} 