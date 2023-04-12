/* tslint:disable */
/* eslint-disable */
import { ContactRoleCode } from './contact-role-code';
import { OrgStatusCode } from './org-status-code';
export interface SpdUserInfo {
  contactRoleCode?: ContactRoleCode;
  orgId?: null | string;
  orgName?: null | string;
  orgStatusCode?: OrgStatusCode;
  userId?: null | string;
}
