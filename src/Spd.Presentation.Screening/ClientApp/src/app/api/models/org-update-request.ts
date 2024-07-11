/* tslint:disable */
/* eslint-disable */
import { BooleanTypeCode } from '../models/boolean-type-code';
import { PayerPreferenceTypeCode } from '../models/payer-preference-type-code';
export interface OrgUpdateRequest {
  addressCity?: string | null;
  addressCountry?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  addressPostalCode?: string | null;
  addressProvince?: string | null;
  contractorsNeedVulnerableSectorScreening?: BooleanTypeCode;
  email?: string | null;
  id?: string;
  licenseesNeedVulnerableSectorScreening?: BooleanTypeCode;
  payerPreference?: PayerPreferenceTypeCode;
  phoneNumber?: string | null;
}
