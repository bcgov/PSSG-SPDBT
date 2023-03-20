/* tslint:disable */
/* eslint-disable */
import { ContactAuthorizationTypeCode } from './contact-authorization-type-code';
export interface OrgUserCreateRequest {
  contactAuthorizationTypeCode?: ContactAuthorizationTypeCode;
  dateOfBirth?: null | string;
  email?: null | string;
  firstName?: null | string;
  jobTitle?: null | string;
  lastName?: null | string;
  organizationId?: string;
  phoneNumber?: null | string;
}
