/* tslint:disable */
/* eslint-disable */
import { IdentityProviderTypeCode } from '../models/identity-provider-type-code';
export interface IdirUserProfileResponse {
  firstName?: string | null;
  identityProviderType?: IdentityProviderTypeCode;
  idirUserName?: string | null;
  isFirstTimeLogin?: boolean;
  isPSA?: boolean;
  lastName?: string | null;
  orgCodeFromIdir?: string | null;
  orgId?: string;
  orgName?: string | null;
  userDisplayName?: string | null;
  userGuid?: string | null;
  userId?: string | null;
}
