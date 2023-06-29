/* tslint:disable */
/* eslint-disable */
import { ServiceTypeCode } from './service-type-code';
export interface ShareableClearanceItem {
  clearanceId?: string;
  expiryDate?: null | string;
  grantedDate?: null | string;
  orgId?: string;
  serviceType?: ServiceTypeCode;
}
