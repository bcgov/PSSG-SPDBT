/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { Address } from '../models/address';
import { Alias } from '../models/alias';
import { ApplicationOriginTypeCode } from '../models/application-origin-type-code';
import { ApplicationTypeCode } from '../models/application-type-code';
import { ArmouredVehiclePermitReasonCode } from '../models/armoured-vehicle-permit-reason-code';
import { BizTypeCode } from '../models/biz-type-code';
import { BodyArmourPermitReasonCode } from '../models/body-armour-permit-reason-code';
import { DocumentRelatedInfo } from '../models/document-related-info';
import { EyeColourCode } from '../models/eye-colour-code';
import { GenderCode } from '../models/gender-code';
import { HairColourCode } from '../models/hair-colour-code';
import { HeightUnitCode } from '../models/height-unit-code';
import { LicenceTermCode } from '../models/licence-term-code';
import { MailingAddress } from '../models/mailing-address';
import { ResidentialAddress } from '../models/residential-address';
import { ServiceTypeCode } from '../models/service-type-code';
import { WeightUnitCode } from '../models/weight-unit-code';
export interface PermitAppSubmitRequest {
  agreeToCompleteAndAccurate?: boolean | null;
  aliases?: Array<Alias> | null;
  applicationOriginTypeCode?: ApplicationOriginTypeCode;
  applicationTypeCode?: ApplicationTypeCode;
  armouredVehiclePermitReasonCodes?: Array<ArmouredVehiclePermitReasonCode> | null;
  bcDriversLicenceNumber?: string | null;
  bizTypeCode?: BizTypeCode;
  bodyArmourPermitReasonCodes?: Array<BodyArmourPermitReasonCode> | null;
  criminalChargeDescription?: string | null;
  dateOfBirth?: string | null;
  documentKeyCodes?: Array<string> | null;
  documentRelatedInfos?: Array<DocumentRelatedInfo> | null;
  emailAddress?: string | null;
  employerName?: string | null;
  employerPrimaryAddress?: Address;
  expiredLicenceId?: string | null;
  eyeColourCode?: EyeColourCode;
  genderCode?: GenderCode;
  givenName?: string | null;
  hairColourCode?: HairColourCode;
  hasBcDriversLicence?: boolean | null;
  hasCriminalHistory?: boolean | null;
  hasExpiredLicence?: boolean | null;
  hasLegalNameChanged?: boolean | null;
  hasPreviousName?: boolean | null;
  height?: number | null;
  heightUnitCode?: HeightUnitCode;
  isCanadianCitizen?: boolean | null;
  isCanadianResident?: boolean | null;
  isMailingTheSameAsResidential?: boolean | null;
  licenceTermCode?: LicenceTermCode;
  mailingAddress?: MailingAddress;
  middleName1?: string | null;
  middleName2?: string | null;
  oneLegalName?: boolean | null;
  originalApplicationId?: string | null;
  originalLicenceId?: string | null;
  permitOtherRequiredReason?: string | null;
  phoneNumber?: string | null;
  previousDocumentIds?: Array<string> | null;
  rationale?: string | null;
  reprint?: boolean | null;
  residentialAddress?: ResidentialAddress;
  serviceTypeCode?: ServiceTypeCode;
  supervisorEmailAddress?: string | null;
  supervisorName?: string | null;
  supervisorPhoneNumber?: string | null;
  surname?: string | null;
  weight?: number | null;
  weightUnitCode?: WeightUnitCode;
}
