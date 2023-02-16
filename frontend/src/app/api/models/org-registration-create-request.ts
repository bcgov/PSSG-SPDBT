/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from './boolean-type-code';
import { CheckFeePayerTypeCode } from './check-fee-payer-type-code';
import { EmployeeInteractionTypeCode } from './employee-interaction-type-code';
import { EmployerOrganizationTypeCode } from './employer-organization-type-code';
import { OperatingBudgetTypeCode } from './operating-budget-type-code';
import { RegistrationTypeCode } from './registration-type-code';
import { ScreeningsCountTypeCode } from './screenings-count-type-code';
import { VolunteerOrganizationTypeCode } from './volunteer-organization-type-code';
export interface OrgRegistrationCreateRequest {
  agreeToTermsAndConditions?: null | boolean;
  checkFeePayer?: CheckFeePayerTypeCode;
  contactDateOfBirth?: null | string;
  contactEmail?: null | string;
  contactGivenName?: null | string;
  contactJobTitle?: null | string;
  contactPhoneNumber?: null | string;
  contactSurname?: null | string;
  employeeInteractionFlag?: EmployeeInteractionTypeCode;
  employerOrganizationTypeCode?: EmployerOrganizationTypeCode;
  genericEmail?: null | string;
  genericEmailConfirmation?: null | string;
  genericPhoneNumber?: null | string;
  hasPhoneOrEmail?: BooleanTypeCode;
  mailingAddressLine1?: null | string;
  mailingAddressLine2?: null | string;
  mailingCity?: null | string;
  mailingCountry?: null | string;
  mailingPostalCode?: null | string;
  mailingProvince?: null | string;
  operatingBudgetFlag?: OperatingBudgetTypeCode;
  organizationName?: null | string;
  registrationTypeCode?: RegistrationTypeCode;
  screeningsCount?: ScreeningsCountTypeCode;
  volunteerOrganizationTypeCode?: VolunteerOrganizationTypeCode;
}
