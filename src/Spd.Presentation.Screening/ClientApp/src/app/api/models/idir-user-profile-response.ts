/* tslint:disable */
/* eslint-disable */
import { IdentityProviderTypeCode } from './identity-provider-type-code';
export interface IdirUserProfileResponse {
  firstName?: null | string;
  identityProviderType?: IdentityProviderTypeCode;
  idirUserName?: null | string;
  isFirstTimeLogin?: boolean;
  isPSA?: boolean;
  lastName?: null | string;
  orgCodeFromIdir?: null | string;
  orgId?: string;
  orgName?: null | string;
  userDisplayName?: null | string;
  userGuid?: null | string;
  userId?: null | string;
}
