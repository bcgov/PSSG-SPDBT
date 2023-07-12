/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from './boolean-type-code';
import { EmployeeInteractionTypeCode } from './employee-interaction-type-code';
import { EmployeeOrganizationTypeCode } from './employee-organization-type-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
import { ScreeningTypeCode } from './screening-type-code';
import { ServiceTypeCode } from './service-type-code';
import { VolunteerOrganizationTypeCode } from './volunteer-organization-type-code';
export interface AppOrgResponse {
  appInviteId?: null | string;
  contractorsNeedVulnerableSectorScreening?: BooleanTypeCode;
  emailAddress?: null | string;
  employeeOrganizationTypeCode?: EmployeeOrganizationTypeCode;
  givenName?: null | string;
  jobTitle?: null | string;
  licenseesNeedVulnerableSectorScreening?: BooleanTypeCode;
  orgAddressLine1?: null | string;
  orgAddressLine2?: null | string;
  orgCity?: null | string;
  orgCountry?: null | string;
  orgEmail?: null | string;
  orgId?: string;
  orgName?: null | string;
  orgPhoneNumber?: null | string;
  orgPostalCode?: null | string;
  orgProvince?: null | string;
  payeeType?: PayerPreferenceTypeCode;
  screeningType?: ScreeningTypeCode;
  serviceType?: ServiceTypeCode;
  surname?: null | string;
  volunteerOrganizationTypeCode?: VolunteerOrganizationTypeCode;
  worksWith?: EmployeeInteractionTypeCode;
}
