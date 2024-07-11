/* tslint:disable */
/* eslint-disable */
import { ApplicationPortalStatusCode } from '../models/application-portal-status-code';
import { CaseSubStatusCode } from '../models/case-sub-status-code';
import { PayerPreferenceTypeCode } from '../models/payer-preference-type-code';
import { ServiceTypeCode } from '../models/service-type-code';
export interface ApplicantApplicationResponse {
  applicationNumber?: string | null;
  caseSubStatus?: CaseSubStatusCode;
  contractedCompanyName?: string | null;
  createdOn?: string | null;
  dateOfBirth?: string | null;
  emailAddress?: string | null;
  failedPaymentAttempts?: number;
  givenName?: string | null;
  haveVerifiedIdentity?: boolean | null;
  id?: string;
  jobTitle?: string | null;
  middleName1?: string | null;
  middleName2?: string | null;
  orgId?: string;
  orgName?: string | null;
  payeeType?: PayerPreferenceTypeCode;
  serviceType?: ServiceTypeCode;
  status?: ApplicationPortalStatusCode;
  surname?: string | null;
}
