/* tslint:disable */
/* eslint-disable */
import { AliasCreateRequest } from '../models/alias-create-request';
import { ApplicationOriginTypeCode } from '../models/application-origin-type-code';
import { GenderCode } from '../models/gender-code';
import { PayerPreferenceTypeCode } from '../models/payer-preference-type-code';
import { ScreeningTypeCode } from '../models/screening-type-code';
import { ServiceTypeCode } from '../models/service-type-code';
export interface ApplicantAppCreateRequest {
  addressLine1?: string | null;
  addressLine2?: string | null;
  agreeToCompleteAndAccurate?: boolean | null;
  agreeToCriminalCheck?: boolean | null;
  agreeToShareCrc?: boolean | null;
  agreeToVulnerableSectorSearch?: boolean | null;
  aliases?: Array<AliasCreateRequest> | null;
  appInviteId?: string | null;
  birthPlace?: string | null;
  city?: string | null;
  consentToCompletedCrc?: boolean | null;
  consentToNotifyNoCrc?: boolean | null;
  consentToNotifyRisk?: boolean | null;
  consentToShareResultCrc?: boolean | null;
  contractedCompanyName?: string | null;
  country?: string | null;
  dateOfBirth?: string | null;
  driversLicense?: string | null;
  emailAddress?: string | null;
  employeeId?: string | null;
  genderCode?: GenderCode;
  givenName?: string | null;
  haveVerifiedIdentity?: boolean | null;
  jobTitle?: string | null;
  middleName1?: string | null;
  middleName2?: string | null;
  oneLegalName?: boolean | null;
  orgId?: string;
  originTypeCode?: ApplicationOriginTypeCode;
  payeeType?: PayerPreferenceTypeCode;
  phoneNumber?: string | null;
  postalCode?: string | null;
  province?: string | null;
  requireDuplicateCheck?: boolean;
  screeningType?: ScreeningTypeCode;
  serviceType?: ServiceTypeCode;
  sharedClearanceId?: string | null;
  surname?: string | null;
}
