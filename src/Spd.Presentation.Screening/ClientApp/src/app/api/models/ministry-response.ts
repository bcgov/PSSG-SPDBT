/* tslint:disable */
/* eslint-disable */
import { ServiceTypeCode } from './service-type-code';
export interface MinistryResponse {
  id?: string;
  isActive?: boolean;
  name?: null | string;
  serviceTypeCodes?: null | Array<ServiceTypeCode>;
}
