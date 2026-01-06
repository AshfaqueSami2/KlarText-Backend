export const USER_ROLE = {
  ADMIN: 'admin',
  STUDENT: 'student',
} as const;

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const GERMAN_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;