/* tslint:disable */
/* eslint-disable */
import { NonSwlContactInfo } from './non-swl-contact-info';
import { SwlContactInfo } from './swl-contact-info';
export interface Members {
  employees?: null | Array<SwlContactInfo>;
  nonSwlControllingMembers?: null | Array<NonSwlContactInfo>;
  swlControllingMembers?: null | Array<SwlContactInfo>;
}
