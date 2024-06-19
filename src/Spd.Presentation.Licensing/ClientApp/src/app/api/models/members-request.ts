/* tslint:disable */
/* eslint-disable */
import { NonSwlContactInfo } from './non-swl-contact-info';
import { SwlContactInfo } from './swl-contact-info';
export interface MembersRequest {
  controllingMemberDocumentKeyCodes?: null | Array<string>;
  employees?: null | Array<SwlContactInfo>;
  nonSwlControllingMembers?: null | Array<NonSwlContactInfo>;
  swlControllingMembers?: null | Array<SwlContactInfo>;
}
