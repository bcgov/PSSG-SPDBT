/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { BranchInfo } from './branch-info';
import { BusinessTypeCode } from './business-type-code';
import { ServiceTypeCode } from './service-type-code';
export interface BizProfileResponse {
  bizAddress?: Address;
  bizBCAddress?: Address;
  bizId?: string;
  bizLegalName?: null | string;
  bizMailingAddress?: Address;
  bizTradeName?: null | string;
  bizTypeCode?: BusinessTypeCode;
  branches?: null | Array<BranchInfo>;
  mailingAddressIsSameBizAddress?: null | boolean;
  serviceTypeCodes?: null | Array<ServiceTypeCode>;
}