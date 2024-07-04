/* tslint:disable */
/* eslint-disable */
import { ApplicationTypeCode } from './application-type-code';
import { BizTypeCode } from './biz-type-code';
import { ContactInfo } from './contact-info';
import { LicenceTermCode } from './licence-term-code';
import { Members } from './members';
import { SwlContactInfo } from './swl-contact-info';
import { WorkerCategoryTypeCode } from './worker-category-type-code';
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface BizLicAppSubmitRequest {
  agreeToCompleteAndAccurate?: null | boolean;
  applicantContactInfo?: ContactInfo;
  applicantIsBizManager?: null | boolean;
  applicationTypeCode?: ApplicationTypeCode;
  bizManagerContactInfo?: ContactInfo;
  bizTypeCode?: BizTypeCode;
  categoryCodes?: null | Array<WorkerCategoryTypeCode>;
  documentKeyCodes?: null | Array<string>;
  latestApplicationId?: null | string;
  licenceTermCode?: LicenceTermCode;
  members?: Members;
  noBranding?: null | boolean;
  originalApplicationId?: null | string;
  originalLicenceId?: null | string;
  previousDocumentIds?: null | Array<string>;
  privateInvestigatorSwlInfo?: SwlContactInfo;
  reprint?: null | boolean;
  useDogs?: null | boolean;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
