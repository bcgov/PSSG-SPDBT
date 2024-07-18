/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { BizTypeCode } from '../models/biz-type-code';
import { BranchInfo } from '../models/branch-info';
import { ContactInfo } from '../models/contact-info';
import { ServiceTypeCode } from '../models/service-type-code';
import { SwlContactInfo } from '../models/swl-contact-info';
export interface BizProfileResponse {
  bizAddress?: Address;
  bizBCAddress?: Address;
  bizId?: string;
  bizLegalName?: string | null;
  bizMailingAddress?: Address;
  bizManagerContactInfo?: ContactInfo;
  bizTradeName?: string | null;
  bizTypeCode?: BizTypeCode;
  branches?: Array<BranchInfo> | null;
  serviceTypeCodes?: Array<ServiceTypeCode> | null;
  soleProprietorSwlContactInfo?: SwlContactInfo;
  soleProprietorSwlEmailAddress?: string | null;
  soleProprietorSwlPhoneNumber?: string | null;
}
