/* tslint:disable */
/* eslint-disable */
import { ApplicationTypeCode } from './application-type-code';
import { BusinessManagerInfo } from './business-manager-info';
import { Document } from './document';
import { Employee } from './employee';
import { LicenceTermCode } from './licence-term-code';
import { NonSwlControllerMemberInfo } from './non-swl-controller-member-info';
import { PrivateInvestigatorInfo } from './private-investigator-info';
import { SecurityWorkerInfo } from './security-worker-info';
import { SwlControllerMemberInfo } from './swl-controller-member-info';
import { WorkerCategoryTypeCode } from './worker-category-type-code';
export interface BizLicenceAppUpsertRequest {
  applicationTypeCode?: ApplicationTypeCode;
  businessManagerInfo?: BusinessManagerInfo;
  categoryCodes?: null | Array<WorkerCategoryTypeCode>;
  documentInfos?: null | Array<Document>;
  emailAddress?: null | string;
  employees?: null | Array<Employee>;
  expiredLicenceId?: null | string;
  expiryDate?: null | string;
  hasExpiredLicence?: null | boolean;
  licenceTermCode?: LicenceTermCode;
  nonSwlControllerMemberInfos?: null | Array<NonSwlControllerMemberInfo>;
  otherContactInfo?: BusinessManagerInfo;
  phoneNumber?: null | string;
  privateInvestigatorInfo?: PrivateInvestigatorInfo;
  securityWorkerInfo?: SecurityWorkerInfo;
  swlControllerMemberInfos?: null | Array<SwlControllerMemberInfo>;
  useDogs?: null | boolean;
}
