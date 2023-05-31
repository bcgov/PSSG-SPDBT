/* tslint:disable */
/* eslint-disable */
import { ApplicationPortalStatusCode } from './application-portal-status-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
export interface ApplicationResponse {
  applicationNumber?: null | string;
  contractedCompanyName?: null | string;
  createdOn?: null | string;
  dateOfBirth?: null | string;
  emailAddress?: null | string;
  givenName?: null | string;
  haveVerifiedIdentity?: null | boolean;
  id?: string;
  jobTitle?: null | string;
  middleName1?: null | string;
  middleName2?: null | string;
  orgId?: string;
  payeeType?: PayerPreferenceTypeCode;
  status?: ApplicationPortalStatusCode;
  surname?: null | string;
}
