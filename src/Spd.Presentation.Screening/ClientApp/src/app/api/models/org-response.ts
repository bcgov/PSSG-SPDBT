/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from '../models/boolean-type-code';
import { EmployeeInteractionTypeCode } from '../models/employee-interaction-type-code';
import { EmployeeOrganizationTypeCode } from '../models/employee-organization-type-code';
import { PayerPreferenceTypeCode } from '../models/payer-preference-type-code';
import { ServiceTypeCode } from '../models/service-type-code';
import { VolunteerOrganizationTypeCode } from '../models/volunteer-organization-type-code';
export interface OrgResponse {
  accessCode?: string | null;
  addressCity?: string | null;
  addressCountry?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  addressPostalCode?: string | null;
  addressProvince?: string | null;
  contractorsNeedVulnerableSectorScreening?: BooleanTypeCode;
  email?: string | null;
  employeeInteractionType?: EmployeeInteractionTypeCode;
  employeeOrganizationTypeCode?: EmployeeOrganizationTypeCode;
  genericUploadEnabled?: boolean;
  hasInvoiceSupport?: boolean;
  id?: string;
  licenseesNeedVulnerableSectorScreening?: BooleanTypeCode;
  organizationLegalName?: string | null;
  organizationName?: string | null;
  payerPreference?: PayerPreferenceTypeCode;
  phoneNumber?: string | null;
  serviceTypes?: Array<ServiceTypeCode> | null;
  volunteerOrganizationTypeCode?: VolunteerOrganizationTypeCode;
}
