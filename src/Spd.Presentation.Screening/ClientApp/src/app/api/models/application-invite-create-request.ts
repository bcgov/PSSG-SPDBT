/* tslint:disable */
/* eslint-disable */
import { PayerPreferenceTypeCode } from '../models/payer-preference-type-code';
import { ScreeningTypeCode } from '../models/screening-type-code';
import { ServiceTypeCode } from '../models/service-type-code';
export interface ApplicationInviteCreateRequest {
  email?: string | null;
  firstName?: string | null;
  jobTitle?: string | null;
  lastName?: string | null;
  orgId?: string;
  originalClearanceAccessId?: string | null;
  payeeType?: PayerPreferenceTypeCode;
  screeningType?: ScreeningTypeCode;
  serviceType?: ServiceTypeCode;
}
