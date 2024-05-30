/* tslint:disable */
/* eslint-disable */
import { ApplicationTypeCode } from './application-type-code';
import { BizTypeCode } from './biz-type-code';
import { ContactInfo } from './contact-info';
import { Document } from './document';
import { LicenceTermCode } from './licence-term-code';
import { Members } from './members';
import { SwlContactInfo } from './swl-contact-info';
import { WorkerCategoryTypeCode } from './worker-category-type-code';
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface BizLicAppUpsertRequest {
  applicantContactInfo?: ContactInfo;
  applicantIsBizManager?: null | boolean;
  applicationTypeCode?: ApplicationTypeCode;
  bizId?: string;
  bizManagerContactInfo?: ContactInfo;
  bizTypeCode?: BizTypeCode;
  categoryCodes?: null | Array<WorkerCategoryTypeCode>;
  documentInfos?: null | Array<Document>;
  expiredLicenceId?: null | string;
  hasExpiredLicence?: null | boolean;
  licenceAppId?: null | string;
  licenceTermCode?: LicenceTermCode;
  members?: Members;
  noBranding?: null | boolean;
  privateInvestigatorSwlInfo?: SwlContactInfo;
  useDogs?: null | boolean;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
