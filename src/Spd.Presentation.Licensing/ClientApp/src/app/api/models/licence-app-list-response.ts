/* tslint:disable */
/* eslint-disable */
import { ApplicationPortalStatusCode } from '../models/application-portal-status-code';
import { ApplicationTypeCode } from '../models/application-type-code';
import { WorkerLicenceTypeCode } from '../models/worker-licence-type-code';
export interface LicenceAppListResponse {
  applicationPortalStatusCode?: ApplicationPortalStatusCode;
  applicationTypeCode?: ApplicationTypeCode;
  caseNumber?: string | null;
  createdOn?: string;
  licenceAppId?: string;
  serviceTypeCode?: WorkerLicenceTypeCode;
  submittedOn?: string | null;
  updatedOn?: string | null;
}
