/* tslint:disable */
/* eslint-disable */
import { ContactAuthorizationTypeCode } from './contact-authorization-type-code';
export interface OrgUserResponse {
  contactAuthorizationTypeCode?: ContactAuthorizationTypeCode;
  email?: null | string;
  firstName?: null | string;
  id?: string;
  isActive?: boolean;
  isInvitationExpired?: boolean;
  jobTitle?: null | string;
  lastName?: null | string;
  organizationId?: string;
  phoneNumber?: null | string;
}
