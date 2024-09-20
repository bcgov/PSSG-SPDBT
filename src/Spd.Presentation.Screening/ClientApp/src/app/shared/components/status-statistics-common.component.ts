import { Component, Input, OnInit } from '@angular/core';
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
			<div class="fw-semibold mb-4">
				<div>Active applications <span class="fw-normal">(for the last 365 days)</span></div>
				<div class="d-flex flex-wrap justify-content-start">
					<div class="d-flex flex-row statistic-card area-yellow align-items-center justify-content-between mt-2 me-2">
						<div class=" fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.VerifyIdentity] ?? 0 }}
						</div>
						<div class="fs-6 m-2">{{ getStatusDesc(statisticsCodes.VerifyIdentity) }}</div>
						<div class="m-2" [matTooltip]="getStatusHint(statisticsCodes.VerifyIdentity)">
							<mat-icon>info_outline</mat-icon>
						</div>
					</div>
					<div class="d-flex flex-row statistic-card area-green align-items-center justify-content-between mt-2 me-2">
						<div class="fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.InProgress] ?? 0 }}
						</div>
						<div class="fs-6 m-2">{{ getStatusDesc(statisticsCodes.InProgress) }}</div>
						<div class="m-2" [matTooltip]="getStatusHint(statisticsCodes.InProgress)">
							<mat-icon>info_outline</mat-icon>
						</div>
					</div>
					<div class="d-flex flex-row statistic-card area-yellow align-items-center justify-content-between mt-2 me-2">
						<div class="fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.AwaitingPayment] ?? 0 }}
						</div>
						<div class="fs-6 m-2">{{ getStatusDesc(statisticsCodes.AwaitingPayment) }}</div>
						<div class="m-2" [matTooltip]="getStatusHint(statisticsCodes.AwaitingPayment)">
							<mat-icon>info_outline</mat-icon>
						</div>
					</div>
					<div class="d-flex flex-row statistic-card area-yellow align-items-center justify-content-between mt-2 me-2">
						<div class="fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.AwaitingThirdParty] ?? 0 }}
						</div>
						<div class="fs-6 m-2">{{ getStatusDesc(statisticsCodes.AwaitingThirdParty) }}</div>
						<div class="m-2" [matTooltip]="getStatusHint(statisticsCodes.AwaitingThirdParty)">
							<mat-icon>info_outline</mat-icon>
						</div>
					</div>
					<div class="d-flex flex-row statistic-card area-yellow align-items-center justify-content-between mt-2 me-2">
						<div class="fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.AwaitingApplicant] ?? 0 }}
						</div>
						<div class="fs-6 m-2">{{ getStatusDesc(statisticsCodes.AwaitingApplicant) }}</div>
						<div class="m-2" [matTooltip]="getStatusHint(statisticsCodes.AwaitingApplicant)">
							<mat-icon>info_outline</mat-icon>
						</div>
					</div>
					<div class="d-flex flex-row statistic-card area-blue align-items-center justify-content-between mt-2 me-2">
						<div class="fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.UnderAssessment] ?? 0 }}
						</div>
						<div class="fs-6 m-2">{{ getStatusDesc(statisticsCodes.UnderAssessment) }}</div>
						<div class="m-2" [matTooltip]="getStatusHint(statisticsCodes.UnderAssessment)">
							<mat-icon>info_outline</mat-icon>
						</div>
					</div>
				</div>
			</div>

			<div class="row fw-semibold mb-4">
				<div class="col-10">Completed applications <span class="fw-normal">(for the last 365 days)</span></div>
				<div class="d-flex flex-wrap justify-content-start">
					<div
						class="d-flex flex-row statistic-card area-grey align-items-center justify-content-between mt-2 me-2"
						*ngIf="isCrrp"
					>
						<div class="fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.RiskFound] ?? 0 }}
						</div>
						<div class="fs-6 m-2">{{ getStatusDesc(statisticsCodes.RiskFound) }}</div>
						<div class="m-2" [matTooltip]="getStatusHint(statisticsCodes.RiskFound)">
							<mat-icon>info_outline</mat-icon>
						</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center justify-content-between mt-2 me-2">
						<div class="fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.ClosedNoResponse] ?? 0 }}
						</div>
						<div class="fs-6 m-2">{{ getStatusDesc(statisticsCodes.ClosedNoResponse) }}</div>
						<div class="m-2" [matTooltip]="getStatusHint(statisticsCodes.ClosedNoResponse)">
							<mat-icon>info_outline</mat-icon>
						</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center justify-content-between mt-2 me-2">
						<div class="fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.ClosedNoConsent] ?? 0 }}
						</div>
						<div class="fs-6 m-2">{{ getStatusDesc(statisticsCodes.ClosedNoConsent) }}</div>
						<div class="m-2" [matTooltip]="getStatusHint(statisticsCodes.ClosedNoConsent)">
							<mat-icon>info_outline</mat-icon>
						</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center justify-content-between mt-2 me-2">
						<div class="fs-4 m-2 ms-3">
							{{ applicationStatistics[statisticsCodes.CancelledByApplicant] ?? 0 }}
						</div>
						<div class="fs-6 m-2">{{ getStatusDesc(statisticsCodes.CancelledByApplicant) }}</div>
						<div class="m-2" [matTooltip]="getStatusHint(statisticsCodes.CancelledByApplicant)">
							<mat-icon>info_outline</mat-icon>
						</div>
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
				width: 13em;
				box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
					0px 1px 3px 0px rgba(0, 0, 0, 0.12);
			}

			@media (max-width: 627px) {
				.statistic-card {
					width: 100% !important;
				}
			}
		`,
	],
})
export class StatusStatisticsCommonComponent implements OnInit {
	applicationStatistics$!: Observable<ApplicationStatisticsResponse>;
	applicationStatistics!: { [key: string]: number | null };

	statisticsCodes = ApplicationPortalStatisticsTypeCode;
	isCrrp!: boolean;

	@Input() id: string | null = null; // If CRRP, id is the OrgId, else for PSSO, id is the UserId
	@Input() portal: PortalTypeCode | null = null;

	constructor(private utilService: UtilService, private applicationService: ApplicationService) {}

	ngOnInit(): void {
		if (!this.id) {
			return;
		}

		this.isCrrp = this.portal == PortalTypeCode.Crrp;

		if (this.isCrrp) {
			this.applicationStatistics$ = this.applicationService
				.apiOrgsOrgIdApplicationStatisticsGet({
					orgId: this.id,
				})
				.pipe(
					tap((res: ApplicationStatisticsResponse) => {
						this.applicationStatistics = res.statistics ?? {};
					})
				);
		} else {
			this.applicationStatistics$ = this.applicationService
				.apiUsersDelegateUserIdPssoApplicationStatisticsGet({
					delegateUserId: this.id,
				})
				.pipe(
					tap((res: ApplicationStatisticsResponse) => {
						this.applicationStatistics = res.statistics ?? {};
					})
				);
		}
	}

	getStatusDesc(code: string): string {
		return this.utilService.getApplicationPortalStatusDesc(code);
	}

	getStatusHint(code: string): string {
		return this.utilService.getApplicationPortalStatusHint(code);
	}
}
