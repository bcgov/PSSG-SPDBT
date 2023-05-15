/* tslint:disable */
/* eslint-disable */
import { ContactAuthorizationTypeCode } from './contact-authorization-type-code';
import { OrgRegistrationStatusCode } from './org-registration-status-code';
import { OrgSettings } from './org-settings';
export interface UserInfo {
  contactAuthorizationTypeCode?: ContactAuthorizationTypeCode;
  email?: null | string;
  firstName?: null | string;
  lastName?: null | string;
  orgId?: null | string;
  orgName?: null | string;
  orgRegistrationId?: null | string;
  orgRegistrationStatusCode?: OrgRegistrationStatusCode;
  orgSettings?: OrgSettings;
  userGuid?: null | string;
  userId?: string;
}
