/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { ArmouredVehiclePermitReasonCode } from './armoured-vehicle-permit-reason-code';
import { BodyArmourPermitReasonCode } from './body-armour-permit-reason-code';
import { Document } from './document';
import { LicenceStatusCode } from './licence-status-code';
import { LicenceTermCode } from './licence-term-code';
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface LicenceResponse {
  armouredVehiclePermitReasonCodes?: null | Array<ArmouredVehiclePermitReasonCode>;
  bodyArmourPermitReasonCodes?: null | Array<BodyArmourPermitReasonCode>;
  employerName?: null | string;
  employerPrimaryAddress?: Address;
  expiryDate?: string;
  licenceAppId?: null | string;
  licenceHolderId?: null | string;
  licenceHolderName?: null | string;
  licenceId?: null | string;
  licenceNumber?: null | string;
  licenceStatusCode?: LicenceStatusCode;
  licenceTermCode?: LicenceTermCode;
  nameOnCard?: null | string;
  permitOtherRequiredReason?: null | string;
  rationalDocumentInfos?: null | Array<Document>;
  rationale?: null | string;
  supervisorEmailAddress?: null | string;
  supervisorName?: null | string;
  supervisorPhoneNumber?: null | string;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
