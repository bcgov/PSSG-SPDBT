/* tslint:disable */
/* eslint-disable */
import { ContactAuthorizationTypeCode } from '../models/contact-authorization-type-code';
export interface OrgUserResponse {
  contactAuthorizationTypeCode?: ContactAuthorizationTypeCode;
  email?: string | null;
  firstName?: string | null;
  id?: string;
  isActive?: boolean;
  jobTitle?: string | null;
  lastName?: string | null;
  organizationId?: string;
  phoneNumber?: string | null;
}
