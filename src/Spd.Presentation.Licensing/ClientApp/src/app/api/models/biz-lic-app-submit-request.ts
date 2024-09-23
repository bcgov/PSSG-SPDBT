/* tslint:disable */
/* eslint-disable */
import { ApplicationOriginTypeCode } from '../models/application-origin-type-code';
import { ApplicationTypeCode } from '../models/application-type-code';
import { BizTypeCode } from '../models/biz-type-code';
import { ContactInfo } from '../models/contact-info';
import { LicenceTermCode } from '../models/licence-term-code';
import { PrivateInvestigatorSwlContactInfo } from '../models/private-investigator-swl-contact-info';
import { WorkerCategoryTypeCode } from '../models/worker-category-type-code';
import { WorkerLicenceTypeCode } from '../models/worker-licence-type-code';
export interface BizLicAppSubmitRequest {
  agreeToCompleteAndAccurate?: boolean | null;
  applicantContactInfo?: ContactInfo;
  applicantIsBizManager?: boolean | null;
  applicationOriginTypeCode?: ApplicationOriginTypeCode;
  applicationTypeCode?: ApplicationTypeCode;
  bizTypeCode?: BizTypeCode;
  categoryCodes?: Array<WorkerCategoryTypeCode> | null;
  documentKeyCodes?: Array<string> | null;
  latestApplicationId?: string | null;
  licenceTermCode?: LicenceTermCode;
  noBranding?: boolean | null;
  originalApplicationId?: string | null;
  originalLicenceId?: string | null;
  previousDocumentIds?: Array<string> | null;
  privateInvestigatorSwlInfo?: PrivateInvestigatorSwlContactInfo;
  reprint?: boolean | null;
  soleProprietorSWLAppId?: string | null;
  useDogs?: boolean | null;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
