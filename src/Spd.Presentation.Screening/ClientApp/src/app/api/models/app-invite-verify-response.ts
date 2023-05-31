/* tslint:disable */
/* eslint-disable */
import { PayeePreferenceTypeCode } from './payee-preference-type-code';
export interface AppInviteVerifyResponse {
  addressCity?: null | string;
  addressCountry?: null | string;
  addressLine1?: null | string;
  addressLine2?: null | string;
  addressPostalCode?: null | string;
  addressProvince?: null | string;
  emailAddress?: null | string;
  employeeOrganizationTypeCode?: null | string;
  givenName?: null | string;
  jobTitle?: null | string;
  orgEmail?: null | string;
  orgId?: string;
  orgName?: null | string;
  orgPhoneNumber?: null | string;
  payeeType?: PayeePreferenceTypeCode;
  surname?: null | string;
  validCrc?: null | boolean;
  volunteerOrganizationTypeCode?: null | string;
}
