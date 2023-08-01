import { Component, Input } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApplicationStatisticsResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { ApplicationPortalStatisticsTypeCode } from 'src/app/core/code-types/application-portal-statistics-type.model';
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
							{{ applicationStatistics[statisticsCode.VerifyIdentity] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCode.VerifyIdentity) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-green align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCode.InProgress] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCode.InProgress) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-yellow align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCode.AwaitingPayment] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCode.AwaitingPayment) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-yellow align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCode.AwaitingThirdParty] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCode.AwaitingThirdParty) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-yellow align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCode.AwaitingApplicant] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCode.AwaitingApplicant) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-blue align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCode.UnderAssessment] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCode.UnderAssessment) }}</div>
					</div>
				</div>
			</div>

			<div class="mb-4">
				<div class="fw-semibold">Completed applications <span class="fw-normal">(for the last 365 days)</span></div>
				<div class="d-flex flex-wrap justify-content-start">
					<div class="d-flex flex-row statistic-card area-grey align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCode.RiskFound] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCode.RiskFound) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCode.ClosedJudicialReview] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCode.ClosedJudicialReview) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCode.ClosedNoResponse] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCode.ClosedNoResponse) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCode.ClosedNoConsent] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCode.ClosedNoConsent) }}</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center mt-2 me-2">
						<div class="fw-semibold fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCode.CancelledByApplicant] ?? 0 }}
						</div>
						<div class="fs-7 m-2">{{ getStatusDesc(statisticsCode.CancelledByApplicant) }}</div>
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

	statisticsCode = ApplicationPortalStatisticsTypeCode;

	@Input() orgId: string | null = null;

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
