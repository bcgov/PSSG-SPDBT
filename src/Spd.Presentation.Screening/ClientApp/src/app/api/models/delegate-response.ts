/* tslint:disable */
/* eslint-disable */
import { PssoUserRoleEnum } from './psso-user-role-enum';
export interface DelegateResponse {
  emailAddress?: null | string;
  firstName?: null | string;
  id?: string;
  lastName?: null | string;
  portalUserId?: null | string;
  pssoUserRoleCode?: PssoUserRoleEnum;
}
