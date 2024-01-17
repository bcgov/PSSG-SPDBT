/* tslint:disable */
/* eslint-disable */
import { OrgSettings } from './org-settings';
import { UserInfoMsgTypeCode } from './user-info-msg-type-code';
export interface UserInfo {
  email?: null | string;
  firstName?: null | string;
  lastName?: null | string;
  orgId?: null | string;
  orgName?: null | string;
  orgRegistrationId?: null | string;
  orgRegistrationNumber?: null | string;
  orgSettings?: OrgSettings;
  userGuid?: null | string;
  userId?: string;
  userInfoMsgType?: UserInfoMsgTypeCode;
}
