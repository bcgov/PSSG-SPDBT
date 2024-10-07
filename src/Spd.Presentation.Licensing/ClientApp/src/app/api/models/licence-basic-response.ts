/* tslint:disable */
/* eslint-disable */
import { LicenceStatusCode } from '../models/licence-status-code';
import { LicenceTermCode } from '../models/licence-term-code';
import { ServiceTypeCode } from '../models/service-type-code';
import { WorkerCategoryTypeCode } from '../models/worker-category-type-code';
export interface LicenceBasicResponse {
  categoryCodes?: Array<WorkerCategoryTypeCode> | null;
  expiryDate?: string;
  licenceAppId?: string | null;
  licenceHolderId?: string | null;
  licenceHolderName?: string | null;
  licenceId?: string | null;
  licenceNumber?: string | null;
  licenceStatusCode?: LicenceStatusCode;
  licenceTermCode?: LicenceTermCode;
  nameOnCard?: string | null;
  serviceTypeCode?: ServiceTypeCode;
}
