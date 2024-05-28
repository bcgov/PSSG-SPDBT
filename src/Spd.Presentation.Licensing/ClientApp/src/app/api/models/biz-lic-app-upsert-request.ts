/* tslint:disable */
/* eslint-disable */
import { ApplicationTypeCode } from './application-type-code';
import { ContactInfo } from './contact-info';
import { Document } from './document';
import { LicenceTermCode } from './licence-term-code';
import { NonSwlContactInfo } from './non-swl-contact-info';
import { SwlContactInfo } from './swl-contact-info';
import { WorkerCategoryTypeCode } from './worker-category-type-code';
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface BizLicAppUpsertRequest {
  applicantContactInfo?: ContactInfo;
  applicantIsBizManager?: null | boolean;
  applicationTypeCode?: ApplicationTypeCode;
  bizId?: string;
  bizManagerContactInfo?: ContactInfo;
  categoryCodes?: null | Array<WorkerCategoryTypeCode>;
  documentInfos?: null | Array<Document>;
  employees?: null | Array<SwlContactInfo>;
  expiredLicenceId?: null | string;
  hasExpiredLicence?: null | boolean;
  licenceAppId?: null | string;
  licenceTermCode?: LicenceTermCode;
  noBranding?: null | boolean;
  nonSwlControllerMemberInfos?: null | Array<NonSwlContactInfo>;
  privateInvestigatorSwlInfo?: SwlContactInfo;
  swlControllerMemberInfos?: null | Array<SwlContactInfo>;
  useDogs?: null | boolean;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
