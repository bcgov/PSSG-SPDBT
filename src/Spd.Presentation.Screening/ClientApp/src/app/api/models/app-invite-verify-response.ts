/* tslint:disable */
/* eslint-disable */
import { PayeePreferenceTypeCode } from './payee-preference-type-code';
export interface AppInviteVerifyResponse {
  addressCity?: null | string;
  addressCountry?: null | string;
  addressLine1?: null | string;
  addressLine2?: null | string;
  addressPostalCode?: null | string;
  addressProvince?: null | string;
  employeeOrganizationTypeCode?: null | string;
  orgId?: string;
  organizationName?: null | string;
  payeeType?: PayeePreferenceTypeCode;
  phoneNumber?: null | string;
  volunteerOrganizationTypeCode?: null | string;
}
