/* tslint:disable */
/* eslint-disable */
import { ApplicationTypeCode } from './application-type-code';
import { ContactInfo } from './contact-info';
import { LicenceTermCode } from './licence-term-code';
import { NonSwlContactInfo } from './non-swl-contact-info';
import { SwlContactInfo } from './swl-contact-info';
import { WorkerCategoryTypeCode } from './worker-category-type-code';
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface BizLicAppChangeRequest {
  applicantContactInfo?: ContactInfo;
  applicantIsBizManager?: null | boolean;
  applicationTypeCode?: ApplicationTypeCode;
  bizManagerContactInfo?: ContactInfo;
  categoryCodes?: null | Array<WorkerCategoryTypeCode>;
  documentKeyCodes?: null | Array<string>;
  employees?: null | Array<SwlContactInfo>;
  expiredLicenceId?: null | string;
  hasExpiredLicence?: null | boolean;
  licenceTermCode?: LicenceTermCode;
  noBranding?: null | boolean;
  nonSwlControllerMemberInfos?: null | Array<NonSwlContactInfo>;
  originalApplicationId?: null | string;
  originalLicenceId?: null | string;
  previousDocumentIds?: null | Array<string>;
  privateInvestigatorSwlInfo?: SwlContactInfo;
  swlControllerMemberInfos?: null | Array<SwlContactInfo>;
  useDogs?: null | boolean;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
