/* tslint:disable */
/* eslint-disable */
import { ContactRoleCode } from '../models/contact-role-code';
export interface BizUserLoginResponse {
  bceidBizTradeName?: string | null;
  bizId?: string;
  bizUserId?: string;
  contactRoleCode?: ContactRoleCode;
  firstName?: string | null;
  isFirstTimeLogin?: boolean | null;
  lastName?: string | null;
}
