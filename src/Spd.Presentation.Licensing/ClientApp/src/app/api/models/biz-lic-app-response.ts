/* tslint:disable */
/* eslint-disable */
import { ApplicationPortalStatusCode } from '../models/application-portal-status-code';
import { ApplicationTypeCode } from '../models/application-type-code';
import { BizTypeCode } from '../models/biz-type-code';
import { ContactInfo } from '../models/contact-info';
import { Document } from '../models/document';
import { LicenceTermCode } from '../models/licence-term-code';
import { Members } from '../models/members';
import { PrivateInvestigatorSwlContactInfo } from '../models/private-investigator-swl-contact-info';
import { WorkerCategoryTypeCode } from '../models/worker-category-type-code';
import { WorkerLicenceTypeCode } from '../models/worker-licence-type-code';
export interface BizLicAppResponse {
  agreeToCompleteAndAccurate?: boolean | null;
  applicantContactInfo?: ContactInfo;
  applicantIsBizManager?: boolean | null;
  applicationPortalStatus?: ApplicationPortalStatusCode;
  applicationTypeCode?: ApplicationTypeCode;
  bizId?: string | null;
  bizTypeCode?: BizTypeCode;
  caseNumber?: string | null;
  categoryCodes?: Array<WorkerCategoryTypeCode> | null;
  documentInfos?: Array<Document> | null;
  expiredLicenceId?: string | null;
  expiryDate?: string | null;
  hasExpiredLicence?: boolean | null;
  licenceAppId?: string;
  licenceTermCode?: LicenceTermCode;
  members?: Members;
  noBranding?: boolean | null;
  privateInvestigatorSwlInfo?: PrivateInvestigatorSwlContactInfo;
  useDogs?: boolean | null;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
