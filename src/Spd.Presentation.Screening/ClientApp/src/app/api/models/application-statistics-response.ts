/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

export interface ApplicationStatisticsResponse {
  statistics?: ({
'Draft'?: number;
'VerifyIdentity'?: number;
'InProgress'?: number;
'AwaitingPayment'?: number;
'AwaitingThirdParty'?: number;
'AwaitingApplicant'?: number;
'UnderAssessment'?: number;
'Incomplete'?: number;
'CompletedCleared'?: number;
'RiskFound'?: number;
'ClosedNoResponse'?: number;
'ClosedNoConsent'?: number;
'CancelledByApplicant'?: number;
'CancelledByOrganization'?: number;
'ClearedLastSevenDays'?: number;
'NotClearedLastSevenDays'?: number;
'Completed'?: number;
}) | null;
}
