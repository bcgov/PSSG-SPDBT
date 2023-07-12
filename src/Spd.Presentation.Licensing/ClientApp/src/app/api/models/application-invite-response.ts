/* tslint:disable */
/* eslint-disable */
import { ApplicationInviteStatusCode } from './application-invite-status-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
export interface ApplicationInviteResponse {
  createdOn?: string;
  email?: null | string;
  errorMsg?: null | string;
  firstName?: null | string;
  id?: string;
  jobTitle?: null | string;
  lastName?: null | string;
  payeeType?: PayerPreferenceTypeCode;
  status?: ApplicationInviteStatusCode;
  viewed?: null | boolean;
}
