/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from './boolean-type-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
export interface OrgResponse {
  accessCode?: null | string;
  addressCity?: null | string;
  addressCountry?: null | string;
  addressLine1?: null | string;
  addressLine2?: null | string;
  addressPostalCode?: null | string;
  addressProvince?: null | string;
  contractorsNeedVulnerableSectorScreening?: BooleanTypeCode;
  email?: null | string;
  id?: string;
  licenseesNeedVulnerableSectorScreening?: BooleanTypeCode;
  organizationLegalName?: null | string;
  organizationName?: null | string;
  payerPreference?: PayerPreferenceTypeCode;
  phoneNumber?: null | string;
}
