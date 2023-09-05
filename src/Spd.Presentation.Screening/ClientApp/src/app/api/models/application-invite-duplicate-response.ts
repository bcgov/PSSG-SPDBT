/* tslint:disable */
/* eslint-disable */
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
export interface ApplicationInviteDuplicateResponse {
  email?: null | string;
  firstName?: null | string;
  hasPotentialDuplicate?: boolean;
  jobTitle?: null | string;
  lastName?: null | string;
  orgId?: string;
  payeeType?: PayerPreferenceTypeCode;
}
