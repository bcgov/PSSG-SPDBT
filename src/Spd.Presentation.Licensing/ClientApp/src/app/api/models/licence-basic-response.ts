/* tslint:disable */
/* eslint-disable */
import { LicenceStatusCode } from './licence-status-code';
import { LicenceTermCode } from './licence-term-code';
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface LicenceBasicResponse {
  expiryDate?: string;
  licenceAppId?: null | string;
  licenceHolderId?: null | string;
  licenceHolderName?: null | string;
  licenceId?: null | string;
  licenceNumber?: null | string;
  licenceStatusCode?: LicenceStatusCode;
  licenceTermCode?: LicenceTermCode;
  nameOnCard?: null | string;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
