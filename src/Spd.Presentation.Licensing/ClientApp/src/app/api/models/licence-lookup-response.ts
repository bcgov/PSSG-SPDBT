/* tslint:disable */
/* eslint-disable */
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface LicenceLookupResponse {
  expiryDate?: string;
  licenceAppId?: null | string;
  licenceId?: null | string;
  licenceNumber?: null | string;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
