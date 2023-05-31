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
  contactEmail?: null | string;
  contactGivenName?: null | string;
  contactSurname?: null | string;
  employeeOrganizationTypeCode?: null | string;
  jobTitle?: null | string;
  orgEmail?: null | string;
  orgId?: string;
  orgName?: null | string;
  orgPhoneNumber?: null | string;
  payeeType?: PayeePreferenceTypeCode;
  validCrc?: null | boolean;
  volunteerOrganizationTypeCode?: null | string;
  worksWith?: null | string;
}
