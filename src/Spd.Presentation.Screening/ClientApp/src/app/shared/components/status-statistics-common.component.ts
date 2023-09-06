import { Component, Input } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApplicationStatisticsResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { ApplicationPortalStatisticsTypeCode } from 'src/app/core/code-types/application-portal-statistics-type.model';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-status-statistics-common',
	template: `
		<ng-container *ngIf="applicationStatistics$ | async">
			<div class="mb-4">
				<div class="fw-semibold">Active applications <span class="fw-normal">(for the last 365 days)</span></div>
				<div class="d-flex flex-wrap justify-content-start">
					<div class="d-flex flex-row statistic-card area-yellow align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.VerifyIdentity] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCodes.VerifyIdentity) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-green align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.InProgress] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCodes.InProgress) }}</div>
					</div>
					<div
						class="d-flex flex-row statistic-card area-yellow align-items-center mt-2 me-2"
						*ngIf="portal == portalTypeCodes.Crrp"
					>
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.AwaitingPayment] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCodes.AwaitingPayment) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-yellow align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.AwaitingThirdParty] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCodes.AwaitingThirdParty) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-yellow align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.AwaitingApplicant] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCodes.AwaitingApplicant) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-blue align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.UnderAssessment] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCodes.UnderAssessment) }}</div>
					</div>
				</div>
			</div>

			<div class="mb-4">
				<div class="fw-semibold">Completed applications <span class="fw-normal">(for the last 365 days)</span></div>
				<div class="d-flex flex-wrap justify-content-start">
					<div class="d-flex flex-row statistic-card area-grey align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.RiskFound] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCodes.RiskFound) }}</div>
					</div>
					<div
						class="d-flex flex-row statistic-card area-grey align-items-center mt-2 me-2"
						*ngIf="portal == portalTypeCodes.Crrp"
					>
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.ClosedJudicialReview] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCodes.ClosedJudicialReview) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.ClosedNoResponse] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCodes.ClosedNoResponse) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.ClosedNoConsent] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCodes.ClosedNoConsent) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.CancelledByApplicant] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCodes.CancelledByApplicant) }}</div>
					</div>
				</div>
			</div>
		</ng-container>
	`,
	styles: [
		`
			.statistic-card {
				cursor: default;
				height: 4em;
				width: 10.5em;
				box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
					0px 1px 3px 0px rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class StatusStatisticsCommonComponent {
	applicationStatistics$!: Observable<ApplicationStatisticsResponse>;
	applicationStatistics!: { [key: string]: number | null };

	statisticsCodes = ApplicationPortalStatisticsTypeCode;
	portalTypeCodes = PortalTypeCode;

	@Input() orgId: string | null = null;
	@Input() portal: PortalTypeCode | null = null;

	constructor(private utilService: UtilService, private applicationService: ApplicationService) {}

	ngOnInit(): void {
		this.applicationStatistics$ = this.applicationService
			.apiOrgsOrgIdApplicationStatisticsGet({
				orgId: this.orgId!,
			})
			.pipe(
				tap((res: ApplicationStatisticsResponse) => {
					this.applicationStatistics = res.statistics ?? {};
				})
			);
	}

	getStatusDesc(code: string): string {
		return this.utilService.getApplicationPortalStatusDesc(code);
	}
}
