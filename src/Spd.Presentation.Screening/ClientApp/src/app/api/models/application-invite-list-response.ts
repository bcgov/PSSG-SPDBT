/* tslint:disable */
/* eslint-disable */
import { ApplicationInviteResponse } from '../models/application-invite-response';
import { PaginationResponse } from '../models/pagination-response';
export interface ApplicationInviteListResponse {
  applicationInvites?: Array<ApplicationInviteResponse> | null;
  pagination?: PaginationResponse;
}
