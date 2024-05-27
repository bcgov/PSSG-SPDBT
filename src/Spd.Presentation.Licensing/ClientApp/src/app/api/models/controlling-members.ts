/* tslint:disable */
/* eslint-disable */
import { ContactInfo } from './contact-info';
import { SwlContactInfo } from './swl-contact-info';
export interface ControllingMembers {
  nonSwlControllingMembers?: null | Array<ContactInfo>;
  swlControllingMembers?: null | Array<SwlContactInfo>;
}
