/* tslint:disable */
/* eslint-disable */
import { ApplicationPortalStatusCode } from '../models/application-portal-status-code';
import { ControllingMemberAppInviteTypeCode } from '../models/controlling-member-app-invite-type-code';
export interface ControllingMemberAppInviteVerifyResponse {
  bizContactId?: string;
  bizId?: string;
  bizLicAppId?: string | null;
  controllingMemberCrcAppId?: string | null;
  controllingMemberCrcAppPortalStatusCode?: ApplicationPortalStatusCode;
  emailAddress?: string | null;
  givenName?: string | null;
  inviteId?: string;
  inviteTypeCode?: ControllingMemberAppInviteTypeCode;
  middleName1?: string | null;
  middleName2?: string | null;
  surname?: string | null;
}
