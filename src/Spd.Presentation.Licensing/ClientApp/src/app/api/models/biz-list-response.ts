/* tslint:disable */
/* eslint-disable */
import { ServiceTypeCode } from '../models/service-type-code';
export interface BizListResponse {
  bizGuid?: string | null;
  bizId?: string;
  bizLegalName?: string | null;
  bizName?: string | null;
  serviceTypeCodes?: Array<ServiceTypeCode> | null;
}
