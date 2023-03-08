/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from './boolean-type-code';
import { EmployeeInteractionTypeCode } from './employee-interaction-type-code';
import { EmployerOrganizationTypeCode } from './employer-organization-type-code';
import { FundsFromBcGovtExceedsThresholdCode } from './funds-from-bc-govt-exceeds-threshold-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
import { PortalUserIdentityTypeCode } from './portal-user-identity-type-code';
import { RegistrationTypeCode } from './registration-type-code';
import { ScreeningsCountTypeCode } from './screenings-count-type-code';
import { VolunteerOrganizationTypeCode } from './volunteer-organization-type-code';
export interface OrgRegistrationCreateRequest {
  agreeToTermsAndConditions?: null | boolean;
  contactDateOfBirth?: null | string;
  contactEmail?: null | string;
  contactGivenName?: null | string;
  contactJobTitle?: null | string;
  contactPhoneNumber?: null | string;
  contactSurname?: null | string;
  employeeInteractionFlag?: EmployeeInteractionTypeCode;
  employeeMonetaryCompensationFlag?: BooleanTypeCode;
  employerOrganizationTypeCode?: EmployerOrganizationTypeCode;
  genericEmail?: null | string;
  genericEmailConfirmation?: null | string;
  genericPhoneNumber?: null | string;
  hasPhoneOrEmail?: BooleanTypeCode;
  loginIdentityGuid?: null | string;
  loginIdentityProvider?: null | string;
  loginPortalUserIdentityGuid?: PortalUserIdentityTypeCode;
  mailingAddressLine1?: null | string;
  mailingAddressLine2?: null | string;
  mailingCity?: null | string;
  mailingCountry?: null | string;
  mailingPostalCode?: null | string;
  mailingProvince?: null | string;
  operatingBudgetFlag?: FundsFromBcGovtExceedsThresholdCode;
  organizationName?: null | string;
  payerPreference?: PayerPreferenceTypeCode;
  registrationTypeCode?: RegistrationTypeCode;
  screeningsCount?: ScreeningsCountTypeCode;
  volunteerOrganizationTypeCode?: VolunteerOrganizationTypeCode;
}
