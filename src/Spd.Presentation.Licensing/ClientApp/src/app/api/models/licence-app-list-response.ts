/* tslint:disable */
/* eslint-disable */
import { ApplicationPortalStatusCode } from './application-portal-status-code';
import { ApplicationTypeCode } from './application-type-code';
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface LicenceAppListResponse {
  applicationPortalStatusCode?: ApplicationPortalStatusCode;
  applicationTypeCode?: ApplicationTypeCode;
  caseNumber?: null | string;
  createdOn?: string;
  licenceAppId?: string;
  serviceTypeCode?: WorkerLicenceTypeCode;
  submittedOn?: null | string;
  updatedOn?: null | string;
}
