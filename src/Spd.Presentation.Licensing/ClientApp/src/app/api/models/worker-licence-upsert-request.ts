/* tslint:disable */
/* eslint-disable */
import { Alias } from './alias';
import { ApplicationTypeCode } from './application-type-code';
import { EyeColourCode } from './eye-colour-code';
import { GenderCode } from './gender-code';
import { HairColourCode } from './hair-colour-code';
import { HeightUnitCode } from './height-unit-code';
import { LicenceTermCode } from './licence-term-code';
import { MailingAddress } from './mailing-address';
import { ResidentialAddress } from './residential-address';
import { WeightUnitCode } from './weight-unit-code';
import { WorkerLicenceTypeCode } from './worker-licence-type-code';
export interface WorkerLicenceUpsertRequest {
  aliases?: null | Array<Alias>;
  applicationTypeCode?: ApplicationTypeCode;
  bcDriversLicenceNumber?: null | string;
  contactEmailAddress?: null | string;
  contactPhoneNumber?: null | string;
  dateOfBirth?: null | string;
  expiredLicenceNumber?: null | string;
  expiryDate?: null | string;
  eyeColourCode?: EyeColourCode;
  genderCode?: GenderCode;
  givenName?: null | string;
  hairColourCode?: HairColourCode;
  hasBcDriversLicence?: null | boolean;
  hasCriminalHistory?: null | boolean;
  hasExpiredLicence?: null | boolean;
  hasPreviousName?: null | boolean;
  height?: number;
  heightUnitCode?: HeightUnitCode;
  isMailingTheSameAsResidential?: null | boolean;
  isSoleProprietor?: null | boolean;
  licenceApplicationId?: null | string;
  licenceTermCode?: LicenceTermCode;
  mailingAddressData?: MailingAddress;
  middleName1?: null | string;
  middleName2?: null | string;
  oneLegalName?: null | boolean;
  residentialAddressData?: ResidentialAddress;
  surname?: null | string;
  weight?: null | number;
  weightUnitCode?: WeightUnitCode;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
