/* tslint:disable */
/* eslint-disable */
import { ApplicationTypeCode } from '../models/application-type-code';
import { BizTypeCode } from '../models/biz-type-code';
import { LicenceTermCode } from '../models/licence-term-code';
import { ServiceTypeCode } from '../models/service-type-code';
export interface LicenceFeeResponse {
  amount?: number | null;
  applicationTypeCode?: ApplicationTypeCode;
  bizTypeCode?: BizTypeCode;
  hasValidSwl90DayLicence?: boolean | null;
  licenceTermCode?: LicenceTermCode;
  serviceTypeCode?: ServiceTypeCode;
}
