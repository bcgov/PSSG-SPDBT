/* tslint:disable */
/* eslint-disable */
import { IdentityProviderTypeCode } from './identity-provider-type-code';
import { UserInfo } from './user-info';
export interface OrgUserProfileResponse {
  identityProviderType?: IdentityProviderTypeCode;
  userDisplayName?: null | string;
  userGuid?: null | string;
  userInfos?: null | Array<UserInfo>;
}
