/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { BizTypeCode } from './biz-type-code';
import { BranchInfo } from './branch-info';
export interface BizProfileUpdateRequest {
  bizAddress?: Address;
  bizBCAddress?: Address;
  bizTradeName?: null | string;
  bizTypeCode?: BizTypeCode;
  branches?: null | Array<BranchInfo>;
  soleProprietorLicenceId?: null | string;
  soleProprietorSwlEmailAddress?: null | string;
  soleProprietorSwlPhoneNumber?: null | string;
}
