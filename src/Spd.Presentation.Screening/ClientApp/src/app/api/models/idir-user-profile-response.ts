/* tslint:disable */
/* eslint-disable */
import { IdentityProviderTypeCode } from './identity-provider-type-code';
export interface IdirUserProfileResponse {
  firstName?: null | string;
  identityProviderType?: IdentityProviderTypeCode;
  idirUserName?: null | string;
  isPSA?: boolean;
  lastName?: null | string;
  ministryOrgId?: string;
  orgId?: string;
  userDisplayName?: null | string;
  userGuid?: null | string;
  userId?: string;
}
