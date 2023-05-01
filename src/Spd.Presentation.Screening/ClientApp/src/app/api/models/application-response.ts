/* tslint:disable */
/* eslint-disable */
import { ApplicationStatusCode } from './application-status-code';
export interface ApplicationResponse {
  applicationNumber?: null | string;
  contractedCompanyName?: null | string;
  createdOn?: null | string;
  emailAddress?: null | string;
  givenName?: null | string;
  id?: string;
  jobTitle?: null | string;
  middleName1?: null | string;
  middleName2?: null | string;
  orgId?: string;
  paidBy?: null | string;
  status?: ApplicationStatusCode;
  surname?: null | string;
}
