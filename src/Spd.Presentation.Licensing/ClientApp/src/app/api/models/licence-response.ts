/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { ArmouredVehiclePermitReasonCode } from '../models/armoured-vehicle-permit-reason-code';
import { BodyArmourPermitReasonCode } from '../models/body-armour-permit-reason-code';
import { Document } from '../models/document';
import { LicenceStatusCode } from '../models/licence-status-code';
import { LicenceTermCode } from '../models/licence-term-code';
import { WorkerCategoryTypeCode } from '../models/worker-category-type-code';
import { WorkerLicenceTypeCode } from '../models/worker-licence-type-code';
export interface LicenceResponse {
  armouredVehiclePermitReasonCodes?: Array<ArmouredVehiclePermitReasonCode> | null;
  bodyArmourPermitReasonCodes?: Array<BodyArmourPermitReasonCode> | null;
  categoryCodes?: Array<WorkerCategoryTypeCode> | null;
  employerName?: string | null;
  employerPrimaryAddress?: Address;
  expiryDate?: string;
  licenceAppId?: string | null;
  licenceHolderId?: string | null;
  licenceHolderName?: string | null;
  licenceId?: string | null;
  licenceNumber?: string | null;
  licenceStatusCode?: LicenceStatusCode;
  licenceTermCode?: LicenceTermCode;
  nameOnCard?: string | null;
  permitOtherRequiredReason?: string | null;
  rationalDocumentInfos?: Array<Document> | null;
  rationale?: string | null;
  supervisorEmailAddress?: string | null;
  supervisorName?: string | null;
  supervisorPhoneNumber?: string | null;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
