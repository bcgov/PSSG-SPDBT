/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { BizTypeCode } from './biz-type-code';
import { BranchInfo } from './branch-info';
export interface BizProfileUpdateRequest {
  bizAddress?: Address;
  bizBCAddress?: Address;
  bizMailingAddress?: Address;
  bizTradeName?: null | string;
  bizTypeCode?: BizTypeCode;
  branches?: null | Array<BranchInfo>;
}