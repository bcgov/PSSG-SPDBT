/* tslint:disable */
/* eslint-disable */
import { ContactAuthorizationTypeCode } from './contact-authorization-type-code';
export interface OrgUserCreateRequest {
  contactAuthorizationTypeCode?: ContactAuthorizationTypeCode;
  email?: null | string;
  firstName?: null | string;
  jobTitle?: null | string;
  lastName?: null | string;
  organizationId?: string;
  phoneNumber?: null | string;
}
