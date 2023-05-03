/* tslint:disable */
/* eslint-disable */
import { ApplicationPortalStatusCode } from './application-portal-status-code';
import { PayeePreferenceTypeCode } from './payee-preference-type-code';
export interface ApplicationResponse {
  applicationNumber?: null | string;
  contractedCompanyName?: null | string;
  createdOn?: null | string;
  emailAddress?: null | string;
  givenName?: null | string;
  haveVerifiedIdentity?: null | boolean;
  id?: string;
  jobTitle?: null | string;
  middleName1?: null | string;
  middleName2?: null | string;
  orgId?: string;
  paidBy?: PayeePreferenceTypeCode;
  payeeType?: PayeePreferenceTypeCode;
  status?: ApplicationPortalStatusCode;
  surname?: null | string;
}
