/* tslint:disable */
/* eslint-disable */
import { LicenceTermCode } from './licence-term-code';
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface LicenceLookupResponse {
  expiryDate?: string;
  licenceAppId?: null | string;
  licenceId?: null | string;
  licenceNumber?: null | string;
  licenceTermCode?: LicenceTermCode;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
