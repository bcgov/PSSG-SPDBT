/* tslint:disable */
/* eslint-disable */
import { GenderCode } from '../models/gender-code';
export interface ApplicantUserInfo {
  age?: string | null;
  birthDate?: string | null;
  displayName?: string | null;
  email?: string | null;
  emailVerified?: boolean | null;
  firstName?: string | null;
  genderCode?: GenderCode;
  lastName?: string | null;
  middleName1?: string | null;
  middleName2?: string | null;
  sub?: string | null;
}
