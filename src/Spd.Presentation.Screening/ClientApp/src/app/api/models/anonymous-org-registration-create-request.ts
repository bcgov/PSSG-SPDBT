/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from './boolean-type-code';
import { EmployeeInteractionTypeCode } from './employee-interaction-type-code';
import { EmployeeOrganizationTypeCode } from './employee-organization-type-code';
import { FundsFromBcGovtExceedsThresholdCode } from './funds-from-bc-govt-exceeds-threshold-code';
import { IdentityProviderTypeCode } from './identity-provider-type-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
import { RegistrationTypeCode } from './registration-type-code';
import { ScreeningsCountTypeCode } from './screenings-count-type-code';
import { VolunteerOrganizationTypeCode } from './volunteer-organization-type-code';
export interface AnonymousOrgRegistrationCreateRequest {
  agreeToTermsAndConditions?: null | boolean;
  contactEmail?: null | string;
  contactGivenName?: null | string;
  contactJobTitle?: null | string;
  contactPhoneNumber?: null | string;
  contactSurname?: null | string;
  employeeInteractionFlag?: EmployeeInteractionTypeCode;
  employeeMonetaryCompensationFlag?: BooleanTypeCode;
  employeeOrganizationTypeCode?: EmployeeOrganizationTypeCode;
  genericEmail?: null | string;
  genericPhoneNumber?: null | string;
  hasPhoneOrEmail?: BooleanTypeCode;
  hasPotentialDuplicate?: BooleanTypeCode;
  loginIdentityGuid?: null | string;
  loginIdentityProvider?: null | string;
  mailingAddressLine1?: null | string;
  mailingAddressLine2?: null | string;
  mailingCity?: null | string;
  mailingCountry?: null | string;
  mailingPostalCode?: null | string;
  mailingProvince?: null | string;
  operatingBudgetFlag?: FundsFromBcGovtExceedsThresholdCode;
  organizationName?: null | string;
  payerPreference?: PayerPreferenceTypeCode;
  portalUserIdentityTypeCode?: IdentityProviderTypeCode;
  recaptcha?: null | string;
  registrationTypeCode?: RegistrationTypeCode;
  requireDuplicateCheck?: boolean;
  screeningsCount?: ScreeningsCountTypeCode;
  volunteerOrganizationTypeCode?: VolunteerOrganizationTypeCode;
}
