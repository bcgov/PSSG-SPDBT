/* tslint:disable */
/* eslint-disable */
import { ApplicationInviteDuplicateResponse } from './application-invite-duplicate-response';
export interface ApplicationInvitesCreateResponse {
  createSuccess?: boolean;
  duplicateResponses?: null | Array<ApplicationInviteDuplicateResponse>;
  errorReason?: null | string;
  isDuplicateCheckRequired?: boolean;
  orgId?: string;
}
