/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { GenderCode } from './gender-code';
import { IdentityProviderTypeCode } from './identity-provider-type-code';
export interface ApplicantProfileResponse {
  applicantId?: string;
  birthDate?: string;
  email?: null | string;
  firstName?: null | string;
  gender?: GenderCode;
  identityProviderTypeCode?: IdentityProviderTypeCode;
  lastName?: null | string;
  middleName1?: null | string;
  middleName2?: null | string;
  residentialAddress?: Address;
  sub?: null | string;
}
