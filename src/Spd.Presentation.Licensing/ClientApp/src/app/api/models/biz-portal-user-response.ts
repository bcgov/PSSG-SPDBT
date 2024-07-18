/* tslint:disable */
/* eslint-disable */
import { ContactAuthorizationTypeCode } from '../models/contact-authorization-type-code';
export interface BizPortalUserResponse {
  bizId?: string;
  contactAuthorizationTypeCode?: ContactAuthorizationTypeCode;
  email?: string | null;
  firstName?: string | null;
  id?: string;
  jobTitle?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
}
