/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { BizTypeCode } from '../models/biz-type-code';
import { BranchInfo } from '../models/branch-info';
export interface BizProfileUpdateRequest {
  bizAddress?: Address;
  bizBCAddress?: Address;
  bizTradeName?: string | null;
  bizTypeCode?: BizTypeCode;
  branches?: Array<BranchInfo> | null;
  soleProprietorLicenceId?: string | null;
  soleProprietorSwlEmailAddress?: string | null;
  soleProprietorSwlPhoneNumber?: string | null;
}
