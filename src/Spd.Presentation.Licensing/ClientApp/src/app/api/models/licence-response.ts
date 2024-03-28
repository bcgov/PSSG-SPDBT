/* tslint:disable */
/* eslint-disable */
import { LicenceTermCode } from './licence-term-code';
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface LicenceResponse {
  expiryDate?: string;
  licenceAppId?: null | string;
  licenceHolderId?: null | string;
  licenceHolderName?: null | string;
  licenceId?: null | string;
  licenceNumber?: null | string;
  licenceTermCode?: LicenceTermCode;
  nameOnCard?: null | string;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
