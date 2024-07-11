/* tslint:disable */
/* eslint-disable */
import { PayerPreferenceTypeCode } from '../models/payer-preference-type-code';
export interface ApplicationInviteDuplicateResponse {
  email?: string | null;
  firstName?: string | null;
  hasPotentialDuplicate?: boolean;
  jobTitle?: string | null;
  lastName?: string | null;
  orgId?: string;
  payeeType?: PayerPreferenceTypeCode;
}
