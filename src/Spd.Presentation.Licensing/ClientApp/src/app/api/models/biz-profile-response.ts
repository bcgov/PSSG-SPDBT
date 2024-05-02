/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { BizTypeCode } from './biz-type-code';
import { BranchInfo } from './branch-info';
import { ServiceTypeCode } from './service-type-code';
export interface BizProfileResponse {
  bizAddress?: Address;
  bizBCAddress?: Address;
  bizId?: string;
  bizLegalName?: null | string;
  bizMailingAddress?: Address;
  bizTradeName?: null | string;
  bizTypeCode?: BizTypeCode;
  branches?: null | Array<BranchInfo>;
  mailingAddressIsSameBizAddress?: null | boolean;
  serviceTypeCodes?: null | Array<ServiceTypeCode>;
}
