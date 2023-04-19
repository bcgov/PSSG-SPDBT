/* tslint:disable */
/* eslint-disable */
import { UserInfo } from './user-info';
export interface UserProfileResponse {
  identityProvider?: null | string;
  userDisplayName?: null | string;
  userGuid?: string;
  userInfos?: null | Array<UserInfo>;
}
