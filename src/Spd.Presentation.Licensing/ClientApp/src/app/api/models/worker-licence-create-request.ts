/* tslint:disable */
/* eslint-disable */
import { AliasesData } from './aliases-data';
import { ApplicationTypeData } from './application-type-data';
import { BcDriversLicenceData } from './bc-drivers-licence-data';
import { CharacteristicsData } from './characteristics-data';
import { CitizenshipData } from './citizenship-data';
import { ContactInformationData } from './contact-information-data';
import { CriminalHistoryData } from './criminal-history-data';
import { DogsAuthorizationData } from './dogs-authorization-data';
import { ExpiredLicenceData } from './expired-licence-data';
import { GovIssuedIdData } from './gov-issued-id-data';
import { LicenceTermData } from './licence-term-data';
import { LicenceTypeData } from './licence-type-data';
import { MailingAddressData } from './mailing-address-data';
import { MentalHealthConditionsData } from './mental-health-conditions-data';
import { PersonalInformationData } from './personal-information-data';
import { PhotographOfYourselfData } from './photograph-of-yourself-data';
import { PoliceBackgroundData } from './police-background-data';
import { ProofOfFingerprintData } from './proof-of-fingerprint-data';
import { ResidentialAddressData } from './residential-address-data';
import { RestraintsAuthorizationData } from './restraints-authorization-data';
import { SoleProprietorData } from './sole-proprietor-data';
import { WorkerLicenceCategoryData } from './worker-licence-category-data';
export interface WorkerLicenceCreateRequest {
  aliasesData?: AliasesData;
  applicationTypeData?: ApplicationTypeData;
  bcDriversLicenceData?: BcDriversLicenceData;
  categoriesData?: null | Array<WorkerLicenceCategoryData>;
  characteristicsData?: CharacteristicsData;
  citizenshipData?: CitizenshipData;
  contactInformationData?: ContactInformationData;
  criminalHistoryData?: CriminalHistoryData;
  dogsAuthorizationData?: DogsAuthorizationData;
  expiredLicenceData?: ExpiredLicenceData;
  govIssuedIdData?: GovIssuedIdData;
  licenceId?: null | string;
  licenceTermData?: LicenceTermData;
  licenceTypeData?: LicenceTypeData;
  mailingAddressData?: MailingAddressData;
  mentalHealthConditionsData?: MentalHealthConditionsData;
  personalInformationData?: PersonalInformationData;
  photographOfYourselfData?: PhotographOfYourselfData;
  policeBackgroundData?: PoliceBackgroundData;
  proofOfFingerprintData?: ProofOfFingerprintData;
  residentialAddressData?: ResidentialAddressData;
  restraintsAuthorizationData?: RestraintsAuthorizationData;
  soleProprietorData?: SoleProprietorData;
}
