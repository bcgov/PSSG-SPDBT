/* tslint:disable */
/* eslint-disable */
import { EmployerOrganizationTypeCode } from './employer-organization-type-code';
import { RegistrationTypeCode } from './registration-type-code';
export interface OrgRegistrationCreateRequest {
  agreeToTermsAndConditions?: null | boolean;
  checkFeePayer?: null | string;
  contactDateOfBirth?: null | string;
  contactEmail?: null | string;
  contactGivenName?: null | string;
  contactJobTitle?: null | string;
  contactPhoneNumber?: null | string;
  contactSurname?: null | string;
  employeeInteractionFlag?: null | string;
  employerOrganizationTypeCode?: EmployerOrganizationTypeCode;
  genericEmail?: null | string;
  genericEmailConfirmation?: null | string;
  genericPhoneNumber?: null | string;
  hasPhoneOrEmail?: null | string;
  mailingAddressLine1?: null | string;
  mailingAddressLine2?: null | string;
  mailingCity?: null | string;
  mailingCountry?: null | string;
  mailingPostalCode?: null | string;
  mailingProvince?: null | string;
  operatingBudgetFlag?: null | string;
  organizationName?: null | string;
  organizationType?: null | string;
  registrationTypeCode?: RegistrationTypeCode;
  screeningsCount?: null | string;
}
