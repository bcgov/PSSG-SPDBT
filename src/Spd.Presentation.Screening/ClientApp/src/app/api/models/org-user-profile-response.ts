/* tslint:disable */
/* eslint-disable */
import { IdentityProviderTypeCode } from '../models/identity-provider-type-code';
import { UserInfo } from '../models/user-info';
export interface OrgUserProfileResponse {
  identityProviderType?: IdentityProviderTypeCode;
  userDisplayName?: string | null;
  userGuid?: string | null;
  userInfos?: Array<UserInfo> | null;
}
