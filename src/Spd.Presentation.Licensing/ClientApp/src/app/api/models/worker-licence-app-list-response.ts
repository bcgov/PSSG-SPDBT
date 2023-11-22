/* tslint:disable */
/* eslint-disable */
import { ApplicationStatusCode } from './application-status-code';
import { ApplicationTypeCode } from './application-type-code';
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface WorkerLicenceAppListResponse {
  applicationStatusCode?: ApplicationStatusCode;
  applicationTypeCode?: ApplicationTypeCode;
  caseNumber?: null | string;
  createdOn?: string;
  licenceAppId?: string;
  serviceTypeCode?: WorkerLicenceTypeCode;
  submittedOn?: null | string;
}
