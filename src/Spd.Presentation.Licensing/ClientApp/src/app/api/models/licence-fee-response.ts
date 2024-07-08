/* tslint:disable */
/* eslint-disable */
import { ApplicationTypeCode } from '../models/application-type-code';
import { BizTypeCode } from '../models/biz-type-code';
import { LicenceTermCode } from '../models/licence-term-code';
import { WorkerLicenceTypeCode } from '../models/worker-licence-type-code';
export interface LicenceFeeResponse {
  amount?: number | null;
  applicationTypeCode?: ApplicationTypeCode;
  bizTypeCode?: BizTypeCode;
  hasValidSwl90DayLicence?: boolean | null;
  licenceTermCode?: LicenceTermCode;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
