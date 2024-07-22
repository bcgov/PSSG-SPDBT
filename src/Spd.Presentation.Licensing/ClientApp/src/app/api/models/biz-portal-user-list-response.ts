/* tslint:disable */
/* eslint-disable */
import { BizPortalUserResponse } from '../models/biz-portal-user-response';
export interface BizPortalUserListResponse {
  maximumNumberOfAuthorizedContacts?: number | null;
  maximumNumberOfPrimaryAuthorizedContacts?: number | null;
  users?: Array<BizPortalUserResponse> | null;
}
