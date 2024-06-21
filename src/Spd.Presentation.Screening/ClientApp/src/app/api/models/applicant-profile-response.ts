/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { GenderCode } from '../models/gender-code';
import { IdentityProviderTypeCode } from '../models/identity-provider-type-code';
export interface ApplicantProfileResponse {
  applicantId?: string;
  birthDate?: string;
  email?: string | null;
  firstName?: string | null;
  gender?: GenderCode;
  identityProviderTypeCode?: IdentityProviderTypeCode;
  lastName?: string | null;
  middleName1?: string | null;
  middleName2?: string | null;
  residentialAddress?: Address;
  sub?: string | null;
}
