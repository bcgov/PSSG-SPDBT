/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { BooleanTypeCode } from '../models/boolean-type-code';
import { PayerPreferenceTypeCode } from '../models/payer-preference-type-code';
export interface OrgSettings {
  contractorsNeedVulnerableSectorScreening?: BooleanTypeCode;
  genericUploadEnabled?: boolean;
  licenseesNeedVulnerableSectorScreening?: BooleanTypeCode;
  payerPreference?: PayerPreferenceTypeCode;
}
