/* tslint:disable */
/* eslint-disable */
import { OrgUserResponse } from './org-user-response';
export interface OrgUserListResponse {
  maximumNumberOfAuthorizedContacts?: null | number;
  maximumNumberOfPrimaryAuthorizedContacts?: null | number;
  users?: null | Array<OrgUserResponse>;
}
