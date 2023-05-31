/* tslint:disable */
/* eslint-disable */
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
export interface ApplicationInviteCreateRequest {
  email?: null | string;
  firstName?: null | string;
  jobTitle?: null | string;
  lastName?: null | string;
  payeeType?: PayerPreferenceTypeCode;
}
