/* tslint:disable */
/* eslint-disable */
import { ApplicationTypeCode } from './application-type-code';
import { BusinessTypeCode } from './business-type-code';
import { LicenceTermCode } from './licence-term-code';
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface LicenceFeeResponse {
  amount?: null | number;
  applicationTypeCode?: ApplicationTypeCode;
  businessTypeCode?: BusinessTypeCode;
  hasValidSwl90DayLicence?: null | boolean;
  licenceTermCode?: LicenceTermCode;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
