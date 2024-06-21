/* tslint:disable */
/* eslint-disable */
import { ApplicationPortalStatusCode } from '../models/application-portal-status-code';
import { PayerPreferenceTypeCode } from '../models/payer-preference-type-code';
export interface ApplicationPaymentResponse {
  applicationNumber?: string | null;
  contractedCompanyName?: string | null;
  createdOn?: string | null;
  dateOfBirth?: string | null;
  emailAddress?: string | null;
  givenName?: string | null;
  haveVerifiedIdentity?: boolean | null;
  id?: string;
  jobTitle?: string | null;
  middleName1?: string | null;
  middleName2?: string | null;
  numberOfAttempts?: number | null;
  orgId?: string;
  paidOn?: string | null;
  payeeType?: PayerPreferenceTypeCode;
  status?: ApplicationPortalStatusCode;
  surname?: string | null;
}
