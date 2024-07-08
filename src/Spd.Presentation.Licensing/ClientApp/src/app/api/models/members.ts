/* tslint:disable */
/* eslint-disable */
import { NonSwlContactInfo } from '../models/non-swl-contact-info';
import { SwlContactInfo } from '../models/swl-contact-info';
export interface Members {
  employees?: Array<SwlContactInfo> | null;
  nonSwlControllingMembers?: Array<NonSwlContactInfo> | null;
  swlControllingMembers?: Array<SwlContactInfo> | null;
}
