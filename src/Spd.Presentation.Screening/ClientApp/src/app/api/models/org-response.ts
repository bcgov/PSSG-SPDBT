/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from './boolean-type-code';
import { EmployeeOrganizationTypeCode } from './employee-organization-type-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
import { VolunteerOrganizationTypeCode } from './volunteer-organization-type-code';
export interface OrgResponse {
  accessCode?: null | string;
  addressCity?: null | string;
  addressCountry?: null | string;
  addressLine1?: null | string;
  addressLine2?: null | string;
  addressPostalCode?: null | string;
  addressProvince?: null | string;
  contractorsNeedVulnerableSectorScreening?: BooleanTypeCode;
  email?: null | string;
  employeeOrganizationTypeCode?: EmployeeOrganizationTypeCode;
  genericUploadEnabled?: boolean;
  id?: string;
  licenseesNeedVulnerableSectorScreening?: BooleanTypeCode;
  organizationLegalName?: null | string;
  organizationName?: null | string;
  payerPreference?: PayerPreferenceTypeCode;
  phoneNumber?: null | string;
  volunteerOrganizationTypeCode?: VolunteerOrganizationTypeCode;
}
