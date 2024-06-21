/* tslint:disable */
/* eslint-disable */
import { ApplicationInviteCreateRequest } from '../models/application-invite-create-request';
export interface ApplicationInvitesCreateRequest {
  applicationInviteCreateRequests?: Array<ApplicationInviteCreateRequest> | null;
  hostUrl?: string | null;
  requireDuplicateCheck?: boolean;
}
