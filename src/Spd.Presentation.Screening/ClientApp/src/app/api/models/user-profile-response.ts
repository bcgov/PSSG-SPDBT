/* tslint:disable */
/* eslint-disable */
import { SpdUserInfo } from './spd-user-info';
export interface UserProfileResponse {
  identityProvider?: null | string;
  isAuthenticated?: boolean;
  orgGuid?: null | string;
  orgLegalName?: null | string;
  spdUserInfos?: null | Array<SpdUserInfo>;
  userDisplayName?: null | string;
  userEmail?: null | string;
  userFirstName?: null | string;
  userGuid?: string;
  userLastName?: null | string;
}
