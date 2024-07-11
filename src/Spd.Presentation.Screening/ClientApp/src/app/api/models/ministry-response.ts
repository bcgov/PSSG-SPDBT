/* tslint:disable */
/* eslint-disable */
import { ServiceTypeCode } from '../models/service-type-code';
export interface MinistryResponse {
  id?: string;
  isActive?: boolean;
  name?: string | null;
  serviceTypeCodes?: Array<ServiceTypeCode> | null;
}
