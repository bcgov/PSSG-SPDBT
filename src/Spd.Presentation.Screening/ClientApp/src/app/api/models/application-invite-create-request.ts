/* tslint:disable */
/* eslint-disable */
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
import { ScreeningTypeCode } from './screening-type-code';
import { ServiceTypeCode } from './service-type-code';
export interface ApplicationInviteCreateRequest {
  email?: null | string;
  firstName?: null | string;
  jobTitle?: null | string;
  lastName?: null | string;
  orgId?: string;
  originalClearanceAccessId?: null | string;
  payeeType?: PayerPreferenceTypeCode;
  screeningType?: ScreeningTypeCode;
  serviceType?: ServiceTypeCode;
}
