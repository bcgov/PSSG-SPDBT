/* tslint:disable */
/* eslint-disable */
import { PayeePreferenceTypeCode } from './payee-preference-type-code';
export interface ApplicationInviteCreateRequest {
  email?: null | string;
  firstName?: null | string;
  jobTitle?: null | string;
  lastName?: null | string;
  payeeType?: PayeePreferenceTypeCode;
}
