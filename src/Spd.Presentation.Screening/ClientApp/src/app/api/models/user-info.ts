/* tslint:disable */
/* eslint-disable */
import { ContactAuthorizationTypeCode } from '../models/contact-authorization-type-code';
import { OrgRegistrationStatusCode } from '../models/org-registration-status-code';
import { OrgSettings } from '../models/org-settings';
import { UserInfoMsgTypeCode } from '../models/user-info-msg-type-code';
export interface UserInfo {
  contactAuthorizationTypeCode?: ContactAuthorizationTypeCode;
  email?: string | null;
  firstName?: string | null;
  isFirstTimeLogin?: boolean;
  lastName?: string | null;
  orgId?: string | null;
  orgName?: string | null;
  orgRegistrationId?: string | null;
  orgRegistrationNumber?: string | null;
  orgRegistrationStatusCode?: OrgRegistrationStatusCode;
  orgSettings?: OrgSettings;
  userGuid?: string | null;
  userId?: string;
  userInfoMsgType?: UserInfoMsgTypeCode;
}
