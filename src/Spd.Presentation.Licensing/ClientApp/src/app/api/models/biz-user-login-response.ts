/* tslint:disable */
/* eslint-disable */
import { ContactRoleCode } from './contact-role-code';
export interface BizUserLoginResponse {
  bizId?: string;
  bizUserId?: string;
  contactRoleCode?: ContactRoleCode;
  firstName?: null | string;
  isFirstTimeLogin?: null | boolean;
  lastName?: null | string;
}
