/* tslint:disable */
/* eslint-disable */
import { ApplicationInviteStatusCode } from '../models/application-invite-status-code';
import { ApplicationPortalStatusCode } from '../models/application-portal-status-code';
export interface NonSwlContactInfo {
  bizContactId?: string | null;
  controllingMemberAppStatusCode?: ApplicationPortalStatusCode;
  emailAddress?: string | null;
  givenName?: string | null;
  inviteStatusCode?: ApplicationInviteStatusCode;
  middleName1?: string | null;
  middleName2?: string | null;
  phoneNumber?: string | null;
  surname?: string | null;
}
