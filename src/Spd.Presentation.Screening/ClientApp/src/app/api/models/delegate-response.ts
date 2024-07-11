/* tslint:disable */
/* eslint-disable */
import { PssoUserRoleEnum } from '../models/psso-user-role-enum';
export interface DelegateResponse {
  emailAddress?: string | null;
  firstName?: string | null;
  id?: string;
  lastName?: string | null;
  portalUserId?: string | null;
  pssoUserRoleCode?: PssoUserRoleEnum;
}
