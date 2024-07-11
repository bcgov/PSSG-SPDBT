/* tslint:disable */
/* eslint-disable */
import { ApplicationInviteDuplicateResponse } from '../models/application-invite-duplicate-response';
export interface ApplicationInvitesCreateResponse {
  createSuccess?: boolean;
  duplicateResponses?: Array<ApplicationInviteDuplicateResponse> | null;
  errorReason?: string | null;
  isDuplicateCheckRequired?: boolean;
  orgId?: string;
}
