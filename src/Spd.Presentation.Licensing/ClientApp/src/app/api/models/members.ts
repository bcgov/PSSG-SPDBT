/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { NonSwlContactInfo } from '../models/non-swl-contact-info';
import { SwlContactInfo } from '../models/swl-contact-info';
export interface Members {
  employees?: Array<SwlContactInfo> | null;
  nonSwlControllingMembers?: Array<NonSwlContactInfo> | null;
  swlControllingMembers?: Array<SwlContactInfo> | null;
}
