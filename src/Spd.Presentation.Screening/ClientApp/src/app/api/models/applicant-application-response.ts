/* tslint:disable */
/* eslint-disable */
import { ApplicationPortalStatusCode } from './application-portal-status-code';
import { CaseSubStatusCode } from './case-sub-status-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
import { ServiceTypeCode } from './service-type-code';
export interface ApplicantApplicationResponse {
  applicationNumber?: null | string;
  caseSubStatus?: CaseSubStatusCode;
  contractedCompanyName?: null | string;
  createdOn?: null | string;
  dateOfBirth?: null | string;
  emailAddress?: null | string;
  failedPaymentAttempts?: number;
  givenName?: null | string;
  haveVerifiedIdentity?: null | boolean;
  id?: string;
  jobTitle?: null | string;
  middleName1?: null | string;
  middleName2?: null | string;
  orgId?: string;
  orgName?: null | string;
  payeeType?: PayerPreferenceTypeCode;
  serviceType?: ServiceTypeCode;
  status?: ApplicationPortalStatusCode;
  surname?: null | string;
}
