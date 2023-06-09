/* tslint:disable */
/* eslint-disable */
import { GenderCode } from './gender-code';
export interface ApplicantProfileResponse {
  age?: null | string;
  birthDate?: null | string;
  displayName?: null | string;
  email?: null | string;
  emailVerified?: null | boolean;
  firstName?: null | string;
  genderCode?: GenderCode;
  lastName?: null | string;
  sub?: null | string;
}
