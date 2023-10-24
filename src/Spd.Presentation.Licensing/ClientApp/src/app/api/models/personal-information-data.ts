/* tslint:disable */
/* eslint-disable */
import { GenderCode } from './gender-code';
export interface PersonalInformationData {
  dateOfBirth?: null | string;
  genderCode?: GenderCode;
  givenName?: null | string;
  middleName1?: null | string;
  middleName2?: null | string;
  oneLegalName?: null | boolean;
  surname?: null | string;
}
