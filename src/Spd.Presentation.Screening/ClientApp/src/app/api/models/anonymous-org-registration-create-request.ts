/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from '../models/boolean-type-code';
import { EmployeeInteractionTypeCode } from '../models/employee-interaction-type-code';
import { EmployeeOrganizationTypeCode } from '../models/employee-organization-type-code';
import { FundsFromBcGovtExceedsThresholdCode } from '../models/funds-from-bc-govt-exceeds-threshold-code';
import { IdentityProviderTypeCode } from '../models/identity-provider-type-code';
import { PayerPreferenceTypeCode } from '../models/payer-preference-type-code';
import { RegistrationTypeCode } from '../models/registration-type-code';
import { ScreeningsCountTypeCode } from '../models/screenings-count-type-code';
import { VolunteerOrganizationTypeCode } from '../models/volunteer-organization-type-code';
export interface AnonymousOrgRegistrationCreateRequest {
  agreeToTermsAndConditions?: boolean | null;
  contactEmail?: string | null;
  contactGivenName?: string | null;
  contactJobTitle?: string | null;
  contactPhoneNumber?: string | null;
  contactSurname?: string | null;
  employeeInteractionFlag?: EmployeeInteractionTypeCode;
  employeeMonetaryCompensationFlag?: BooleanTypeCode;
  employeeOrganizationTypeCode?: EmployeeOrganizationTypeCode;
  genericEmail?: string | null;
  genericPhoneNumber?: string | null;
  hasPhoneOrEmail?: BooleanTypeCode;
  hasPotentialDuplicate?: BooleanTypeCode;
  loginIdentityGuid?: string | null;
  loginIdentityProvider?: string | null;
  mailingAddressLine1?: string | null;
  mailingAddressLine2?: string | null;
  mailingCity?: string | null;
  mailingCountry?: string | null;
  mailingPostalCode?: string | null;
  mailingProvince?: string | null;
  operatingBudgetFlag?: FundsFromBcGovtExceedsThresholdCode;
  organizationName?: string | null;
  payerPreference?: PayerPreferenceTypeCode;
  portalUserIdentityTypeCode?: IdentityProviderTypeCode;
  recaptcha?: string | null;
  registrationTypeCode?: RegistrationTypeCode;
  requireDuplicateCheck?: boolean;
  screeningsCount?: ScreeningsCountTypeCode;
  volunteerOrganizationTypeCode?: VolunteerOrganizationTypeCode;
}
