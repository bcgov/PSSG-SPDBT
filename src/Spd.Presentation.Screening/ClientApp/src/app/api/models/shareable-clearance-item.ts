/* tslint:disable */
/* eslint-disable */
import { ServiceTypeCode } from '../models/service-type-code';
export interface ShareableClearanceItem {
  clearanceId?: string;
  expiryDate?: string | null;
  grantedDate?: string | null;
  orgId?: string;
  serviceType?: ServiceTypeCode;
}
