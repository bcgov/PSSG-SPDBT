/* tslint:disable */
/* eslint-disable */
import { ContactAuthorizationTypeCode } from '../models/contact-authorization-type-code';
export interface OrgUserUpdateRequest {
  contactAuthorizationTypeCode?: ContactAuthorizationTypeCode;
  email?: string | null;
  firstName?: string | null;
  id?: string;
  jobTitle?: string | null;
  lastName?: string | null;
  organizationId?: string;
  phoneNumber?: string | null;
}
