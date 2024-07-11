/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from '../models/boolean-type-code';
import { PayerPreferenceTypeCode } from '../models/payer-preference-type-code';
export interface OrgSettings {
  contractorsNeedVulnerableSectorScreening?: BooleanTypeCode;
  genericUploadEnabled?: boolean;
  licenseesNeedVulnerableSectorScreening?: BooleanTypeCode;
  payerPreference?: PayerPreferenceTypeCode;
}
