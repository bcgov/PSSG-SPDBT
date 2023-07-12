/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from './boolean-type-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
export interface OrgUpdateRequest {
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
  payerPreference?: PayerPreferenceTypeCode;
  phoneNumber?: null | string;
}
