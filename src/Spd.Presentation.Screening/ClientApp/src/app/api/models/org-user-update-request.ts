/* tslint:disable */
/* eslint-disable */
import { ContactAuthorizationTypeCode } from './contact-authorization-type-code';
export interface OrgUserUpdateRequest {
  contactAuthorizationTypeCode?: ContactAuthorizationTypeCode;
  email?: null | string;
  firstName?: null | string;
  id?: string;
  jobTitle?: null | string;
  lastName?: null | string;
  organizationId?: string;
  phoneNumber?: null | string;
}
