/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from './boolean-type-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
export interface OrgSettings {
  contractorsNeedVulnerableSectorScreening?: BooleanTypeCode;
  licenseesNeedVulnerableSectorScreening?: BooleanTypeCode;
  payerPreference?: PayerPreferenceTypeCode;
}
