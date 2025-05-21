/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationPortalStatusCode, ApplicationTypeCode } from '@app/api/models';
import { MainApplicationResponse } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-business-licence-main-applications-list',
	template: `
		<div class="mb-3" *ngIf="applicationsDataSource.data.length > 0">
			<div class="text-minor-heading py-3">Applications</div>

			<div class="row summary-card-section summary-card-section__orange m-0 pt-2">
				<div class="col-12">
					<mat-table [dataSource]="applicationsDataSource" class="draft-table" [multiTemplateDataRows]="true">
						<ng-container matColumnDef="serviceTypeCode">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Licence Type</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Licence Type:</span>
								{{ application.serviceTypeCode | options: 'ServiceTypes' }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="createdOn">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Date Started</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Date Started:</span>
								{{ application.createdOn | formatDate | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="submittedOn">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Date Submitted</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Date Submitted:</span>
								{{ application.submittedOn | formatDate | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="applicationTypeCode">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Type</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Type:</span>
								{{ application.applicationTypeCode | options: 'ApplicationTypes' }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="caseNumber">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Case Number</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Case Number:</span>
								{{ application.caseNumber }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="applicationPortalStatusCode">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Status</mat-header-cell>
							<mat-cell *matCellDef="let application" [ngClass]="showStatusButton ? 'col-status-button' : ''">
								<span class="mobile-label">Status:</span>
								<ng-container *ngIf="isNewDraft(application); else isNotDraft">
									<button
										mat-flat-button
										color="primary"
										class="large w-auto"
										aria-label="Resume application"
										(click)="onResume(application)"
										[disabled]="isDraftAndNotResumable(application)"
									>
										<mat-icon>play_arrow</mat-icon>Resume
									</button>
								</ng-container>
								<ng-template #isNotDraft>
									<ng-container *ngIf="isPaymentPending(application); else showStatus">
										<button
											mat-flat-button
											color="primary"
											class="large w-auto"
											aria-label="Pay for application now"
											(click)="onPayNow(application)"
										>
											<mat-icon>payment</mat-icon>Pay Now
										</button>
									</ng-container>
									<ng-template #showStatus>
										<a
											tabindex="0"
											class="text-start me-2"
											aria-label="Remove the draft application"
											matTooltip="Remove the draft application"
											(click)="onCancel(application)"
											(keydown)="onKeydownCancel($event, application)"
											*ngIf="isDraftCancelable(application)"
											><mat-icon>delete_outline</mat-icon></a
										>
										<span class="fw-bold" [ngClass]="getStatusClass(application.applicationPortalStatusCode)">
											{{ application.applicationPortalStatusCode | options: 'ApplicationPortalStatuses' | default }}
										</span>
									</ng-template>
								</ng-template>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<a
									tabindex="0"
									class="text-start my-2"
									(click)="onManageBusinessStakeholders()"
									(keydown)="onKeydownManageBusinessStakeholders($event)"
									*ngIf="showManageBusinessStakeholders"
									>Controlling Members, Business Managers & Employees</a
								>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="applicationColumns; sticky: true"></mat-header-row>
						<mat-row
							class="mat-data-row spd-table-tall-row"
							*matRowDef="let row; columns: applicationColumns"
						></mat-row>
					</mat-table>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.mat-column-applicationPortalStatusCode {
				word-break: break-word;
			}
			.col-status-button {
				min-width: fit-content;
			}
			.mat-column-caseNumber {
				word-break: break-word;
			}

			.mat-column-action1 {
				min-width: 150px;
			}

			@media (min-width: 1200px) {
				/* only force max width on large screens */
				.mat-column-applicationTypeCode {
					max-width: 120px;
				}
				.mat-column-serviceTypeCode {
					max-width: 120px;
				}
				.mat-column-action1 {
					text-align: right;
					justify-content: flex-end;
					max-width: 150px;
				}
			}

			.status-green {
				color: var(--color-green) !important;
			}

			.status-orange {
				color: var(--color-orange) !important;
			}

			.draft-table {
				background-color: #f6f6f6 !important;
			}
		`,
	],
	standalone: false,
})
export class BusinessLicenceMainApplicationsListComponent implements OnInit {
	applicationColumns: string[] = [
		'serviceTypeCode',
		'createdOn',
		'submittedOn',
		'applicationTypeCode',
		'caseNumber',
		'applicationPortalStatusCode',
		'action1',
	];

	showStatusButton = false;
	showManageBusinessStakeholders = false;

	@Input() applicationsDataSource!: MatTableDataSource<MainApplicationResponse>;
	@Input() applicationIsInProgress!: boolean;
	@Input() isControllingMemberWarning!: boolean;
	@Input() isSoleProprietor!: boolean;

	@Output() resumeApplication: EventEmitter<MainApplicationResponse> = new EventEmitter();
	@Output() cancelApplication: EventEmitter<MainApplicationResponse> = new EventEmitter();
	@Output() payApplication: EventEmitter<MainApplicationResponse> = new EventEmitter();
	@Output() manageBusinessStakeholders: EventEmitter<MainApplicationResponse> = new EventEmitter();

	ngOnInit(): void {
		if (this.applicationsDataSource.data.length > 0) {
			const application = this.applicationsDataSource.data[0];
			this.showStatusButton = this.isNewDraft(application) || this.isPaymentPending(application);
			this.showManageBusinessStakeholders = !this.isNewDraft(application) && !this.isSoleProprietor;
		}
	}

	getStatusClass(applicationPortalStatusCode: ApplicationPortalStatusCode): string {
		switch (applicationPortalStatusCode) {
			case ApplicationPortalStatusCode.Draft: {
				return 'status-orange';
			}
			case ApplicationPortalStatusCode.InProgress: {
				return 'status-green';
			}
			default: {
				return '';
			}
		}
	}

	onCancel(appl: MainApplicationResponse): void {
		this.cancelApplication.emit(appl);
	}

	onKeydownCancel(event: KeyboardEvent, appl: MainApplicationResponse) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onCancel(appl);
	}

	onResume(appl: MainApplicationResponse): void {
		this.resumeApplication.emit(appl);
	}

	onPayNow(appl: MainApplicationResponse): void {
		this.payApplication.emit(appl);
	}

	isNewDraft(appl: MainApplicationResponse): boolean {
		return (
			appl.applicationTypeCode === ApplicationTypeCode.New &&
			appl.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft
		);
	}

	isDraftCancelable(appl: MainApplicationResponse): boolean {
		return (
			appl.applicationTypeCode != ApplicationTypeCode.New &&
			appl.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft
		);
	}

	isDraftAndNotResumable(appl: MainApplicationResponse): boolean {
		return (
			this.applicationIsInProgress &&
			appl.applicationTypeCode === ApplicationTypeCode.New &&
			appl.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft
		);
	}

	isPaymentPending(appl: MainApplicationResponse): boolean {
		return (
			!this.isControllingMemberWarning &&
			appl.applicationPortalStatusCode === ApplicationPortalStatusCode.AwaitingPayment
		);
	}

	onManageBusinessStakeholders(): void {
		this.manageBusinessStakeholders.emit();
	}

	onKeydownManageBusinessStakeholders(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onManageBusinessStakeholders();
	}
}
