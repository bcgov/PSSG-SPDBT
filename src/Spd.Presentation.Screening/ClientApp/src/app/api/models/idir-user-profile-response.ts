/* tslint:disable */
/* eslint-disable */
import { IdentityProviderTypeCode } from './identity-provider-type-code';
export interface IdirUserProfileResponse {
  firstName?: null | string;
  identityProviderType?: IdentityProviderTypeCode;
  idirUserName?: null | string;
  lastName?: null | string;
  orgId?: string;
  userDisplayName?: null | string;
  userGuid?: null | string;
  userId?: string;
}
