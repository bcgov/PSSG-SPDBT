/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from '../models/boolean-type-code';
import { EmployeeInteractionTypeCode } from '../models/employee-interaction-type-code';
import { EmployeeOrganizationTypeCode } from '../models/employee-organization-type-code';
import { PayerPreferenceTypeCode } from '../models/payer-preference-type-code';
import { ScreeningTypeCode } from '../models/screening-type-code';
import { ServiceTypeCode } from '../models/service-type-code';
import { VolunteerOrganizationTypeCode } from '../models/volunteer-organization-type-code';
export interface AppOrgResponse {
  appInviteId?: string | null;
  contractorsNeedVulnerableSectorScreening?: BooleanTypeCode;
  emailAddress?: string | null;
  employeeOrganizationTypeCode?: EmployeeOrganizationTypeCode;
  givenName?: string | null;
  jobTitle?: string | null;
  licenseesNeedVulnerableSectorScreening?: BooleanTypeCode;
  orgAddressLine1?: string | null;
  orgAddressLine2?: string | null;
  orgCity?: string | null;
  orgCountry?: string | null;
  orgEmail?: string | null;
  orgId?: string;
  orgName?: string | null;
  orgPhoneNumber?: string | null;
  orgPostalCode?: string | null;
  orgProvince?: string | null;
  payeeType?: PayerPreferenceTypeCode;
  screeningType?: ScreeningTypeCode;
  serviceType?: ServiceTypeCode;
  surname?: string | null;
  volunteerOrganizationTypeCode?: VolunteerOrganizationTypeCode;
  worksWith?: EmployeeInteractionTypeCode;
}
