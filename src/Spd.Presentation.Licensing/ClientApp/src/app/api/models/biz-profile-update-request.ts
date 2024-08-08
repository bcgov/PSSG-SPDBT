/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { BizTypeCode } from '../models/biz-type-code';
import { BranchInfo } from '../models/branch-info';
import { ContactInfo } from '../models/contact-info';
export interface BizProfileUpdateRequest {
  bizAddress?: Address;
  bizBCAddress?: Address;
  bizManagerContactInfo?: ContactInfo;
  bizTradeName?: string | null;
  bizTypeCode?: BizTypeCode;
  branches?: Array<BranchInfo> | null;
  soleProprietorLicenceId?: string | null;
  soleProprietorSwlEmailAddress?: string | null;
  soleProprietorSwlPhoneNumber?: string | null;
}
