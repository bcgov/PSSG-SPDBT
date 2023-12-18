/* tslint:disable */
/* eslint-disable */
import { ApplicationInviteResponse } from './application-invite-response';
import { PaginationResponse } from './pagination-response';
export interface ApplicationInviteListResponse {
  applicationInvites?: null | Array<ApplicationInviteResponse>;
  pagination?: PaginationResponse;
}
