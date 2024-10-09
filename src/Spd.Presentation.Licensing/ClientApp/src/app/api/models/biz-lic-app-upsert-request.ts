/* tslint:disable */
/* eslint-disable */
import { ApplicationOriginTypeCode } from '../models/application-origin-type-code';
import { ApplicationTypeCode } from '../models/application-type-code';
import { BizTypeCode } from '../models/biz-type-code';
import { ContactInfo } from '../models/contact-info';
import { Document } from '../models/document';
import { LicenceTermCode } from '../models/licence-term-code';
import { PrivateInvestigatorSwlContactInfo } from '../models/private-investigator-swl-contact-info';
import { ServiceTypeCode } from '../models/service-type-code';
import { WorkerCategoryTypeCode } from '../models/worker-category-type-code';
export interface BizLicAppUpsertRequest {
  agreeToCompleteAndAccurate?: boolean | null;
  applicantContactInfo?: ContactInfo;
  applicantIsBizManager?: boolean | null;
  applicationOriginTypeCode?: ApplicationOriginTypeCode;
  applicationTypeCode?: ApplicationTypeCode;
  bizId?: string;
  bizTypeCode?: BizTypeCode;
  categoryCodes?: Array<WorkerCategoryTypeCode> | null;
  documentInfos?: Array<Document> | null;
  expiredLicenceId?: string | null;
  hasExpiredLicence?: boolean | null;
  isDogsPurposeDetectionDrugs?: boolean | null;
  isDogsPurposeDetectionExplosives?: boolean | null;
  isDogsPurposeProtection?: boolean | null;
  licenceAppId?: string | null;
  licenceTermCode?: LicenceTermCode;
  noBranding?: boolean | null;
  privateInvestigatorSwlInfo?: PrivateInvestigatorSwlContactInfo;
  serviceTypeCode?: ServiceTypeCode;
  soleProprietorSWLAppId?: string | null;
  useDogs?: boolean | null;
}
