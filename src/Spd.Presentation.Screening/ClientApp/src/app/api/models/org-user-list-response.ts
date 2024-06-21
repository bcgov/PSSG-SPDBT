/* tslint:disable */
/* eslint-disable */
import { OrgUserResponse } from '../models/org-user-response';
export interface OrgUserListResponse {
  maximumNumberOfAuthorizedContacts?: number | null;
  maximumNumberOfPrimaryAuthorizedContacts?: number | null;
  users?: Array<OrgUserResponse> | null;
}
