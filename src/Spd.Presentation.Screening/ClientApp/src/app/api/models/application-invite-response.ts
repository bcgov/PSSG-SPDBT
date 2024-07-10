/* tslint:disable */
/* eslint-disable */
import { ApplicationInviteStatusCode } from '../models/application-invite-status-code';
import { PayerPreferenceTypeCode } from '../models/payer-preference-type-code';
export interface ApplicationInviteResponse {
  createdOn?: string;
  email?: string | null;
  errorMsg?: string | null;
  firstName?: string | null;
  id?: string;
  jobTitle?: string | null;
  lastName?: string | null;
  orgId?: string;
  payeeType?: PayerPreferenceTypeCode;
  status?: ApplicationInviteStatusCode;
  viewed?: boolean | null;
}
