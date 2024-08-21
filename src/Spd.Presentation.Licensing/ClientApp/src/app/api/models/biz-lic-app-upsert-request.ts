/* tslint:disable */
/* eslint-disable */
import { ApplicationTypeCode } from '../models/application-type-code';
import { BizTypeCode } from '../models/biz-type-code';
import { ContactInfo } from '../models/contact-info';
import { Document } from '../models/document';
import { LicenceTermCode } from '../models/licence-term-code';
import { Members } from '../models/members';
import { PrivateInvestigatorSwlContactInfo } from '../models/private-investigator-swl-contact-info';
import { WorkerCategoryTypeCode } from '../models/worker-category-type-code';
import { WorkerLicenceTypeCode } from '../models/worker-licence-type-code';
export interface BizLicAppUpsertRequest {
  agreeToCompleteAndAccurate?: boolean | null;
  applicantContactInfo?: ContactInfo;
  applicantIsBizManager?: boolean | null;
  applicationTypeCode?: ApplicationTypeCode;
  bizId?: string;
  bizTypeCode?: BizTypeCode;
  categoryCodes?: Array<WorkerCategoryTypeCode> | null;
  documentInfos?: Array<Document> | null;
  expiredLicenceId?: string | null;
  hasExpiredLicence?: boolean | null;
  licenceAppId?: string | null;
  licenceTermCode?: LicenceTermCode;
  members?: Members;
  noBranding?: boolean | null;
  privateInvestigatorSwlInfo?: PrivateInvestigatorSwlContactInfo;
  soleProprietorSWLAppId?: string | null;
  useDogs?: boolean | null;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
