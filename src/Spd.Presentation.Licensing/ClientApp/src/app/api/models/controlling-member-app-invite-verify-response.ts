/* tslint:disable */
/* eslint-disable */
import { ApplicationPortalStatusCode } from '../models/application-portal-status-code';
export interface ControllingMemberAppInviteVerifyResponse {
  bizContactId?: string;
  bizId?: string;
  bizLicAppId?: string | null;
  controllingMemberCrcAppId?: string | null;
  controllingMemberCrcAppPortalStatusCode?: ApplicationPortalStatusCode;
  inviteId?: string;
}
