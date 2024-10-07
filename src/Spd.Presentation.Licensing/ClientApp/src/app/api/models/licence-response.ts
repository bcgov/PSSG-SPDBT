/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { ArmouredVehiclePermitReasonCode } from '../models/armoured-vehicle-permit-reason-code';
import { BizTypeCode } from '../models/biz-type-code';
import { BodyArmourPermitReasonCode } from '../models/body-armour-permit-reason-code';
import { Document } from '../models/document';
import { LicenceStatusCode } from '../models/licence-status-code';
import { LicenceTermCode } from '../models/licence-term-code';
import { ServiceTypeCode } from '../models/service-type-code';
import { WorkerCategoryTypeCode } from '../models/worker-category-type-code';
export interface LicenceResponse {
  armouredVehiclePermitReasonCodes?: Array<ArmouredVehiclePermitReasonCode> | null;
  bizTypeCode?: BizTypeCode;
  bodyArmourPermitReasonCodes?: Array<BodyArmourPermitReasonCode> | null;
  carryAndUseRestraints?: boolean;
  categoryCodes?: Array<WorkerCategoryTypeCode> | null;
  dogDocumentInfos?: Array<Document> | null;
  employerName?: string | null;
  employerPrimaryAddress?: Address;
  expiryDate?: string;
  isDogsPurposeDetectionDrugs?: boolean;
  isDogsPurposeDetectionExplosives?: boolean;
  isDogsPurposeProtection?: boolean;
  licenceAppId?: string | null;
  licenceHolderId?: string | null;
  licenceHolderName?: string | null;
  licenceId?: string | null;
  licenceNumber?: string | null;
  licenceStatusCode?: LicenceStatusCode;
  licenceTermCode?: LicenceTermCode;
  nameOnCard?: string | null;
  permitOtherRequiredReason?: string | null;
  rationalDocumentInfos?: Array<Document> | null;
  rationale?: string | null;
  restraintsDocumentInfos?: Array<Document> | null;
  serviceTypeCode?: ServiceTypeCode;
  supervisorEmailAddress?: string | null;
  supervisorName?: string | null;
  supervisorPhoneNumber?: string | null;
  useDogs?: boolean;
}
