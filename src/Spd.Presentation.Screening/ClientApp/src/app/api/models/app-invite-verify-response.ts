/* tslint:disable */
/* eslint-disable */
import { EmployeeInteractionTypeCode } from './employee-interaction-type-code';
import { EmployeeOrganizationTypeCode } from './employee-organization-type-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
import { VolunteerOrganizationTypeCode } from './volunteer-organization-type-code';
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
  employeeOrganizationTypeCode?: EmployeeOrganizationTypeCode;
  jobTitle?: null | string;
  orgEmail?: null | string;
  orgId?: string;
  orgName?: null | string;
  orgPhoneNumber?: null | string;
  payeeType?: PayerPreferenceTypeCode;
  validCrc?: null | boolean;
  volunteerOrganizationTypeCode?: VolunteerOrganizationTypeCode;
  worksWith?: EmployeeInteractionTypeCode;
}
