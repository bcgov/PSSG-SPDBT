/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationPortalStatusCode, ApplicationTypeCode } from '@app/api/models';
import { MainApplicationResponse } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-gdsd-licence-main-applications-list',
	template: `
		<div class="mb-3" *ngIf="applicationsDataSource.data.length > 0">
			<div class="text-minor-heading py-3">Applications</div>

			<div class="row summary-card-section summary-card-section__orange m-0 pt-2">
				<div class="col-12">
					<mat-table [dataSource]="applicationsDataSource" class="draft-table" [multiTemplateDataRows]="true">
						<ng-container matColumnDef="serviceTypeCode">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Certification Type</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Certificate Type:</span>
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
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Status:</span>
								<span class="fw-bold" [ngClass]="getStatusClass(application.applicationPortalStatusCode)">
									{{ application.applicationPortalStatusCode | options: 'ApplicationPortalStatuses' | default }}
								</span>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									color="primary"
									class="large w-auto"
									aria-label="Resume application"
									(click)="onResume(application)"
									[disabled]="isDraftAndNotResumable(application)"
									*ngIf="isNewDraft(application)"
								>
									<mat-icon>play_arrow</mat-icon>Resume
								</button>

								<button
									mat-stroked-button
									color="primary"
									class="large w-auto"
									aria-label="Remove the application"
									matTooltip="Remove the application"
									(click)="onCancel(application)"
									*ngIf="isDraftCancelable(application)"
								>
									<mat-icon>delete_outline</mat-icon>Remove
								</button>
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
			.mat-column-action1 {
				text-align: right;
				justify-content: flex-end;
				min-width: 170px;
			}

			@media (min-width: 1200px) {
				/* only force max width on large screens */
				.mat-column-applicationTypeCode {
					max-width: 120px;
				}
				.mat-column-serviceTypeCode {
					max-width: 145px;
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
export class GdsdLicenceMainApplicationsListComponent {
	applicationColumns: string[] = [
		'serviceTypeCode',
		'createdOn',
		'submittedOn',
		'applicationTypeCode',
		'caseNumber',
		'applicationPortalStatusCode',
		'action1',
	];

	isShowStatusText = true;

	@Input() applicationsDataSource!: MatTableDataSource<MainApplicationResponse>;
	@Input() applicationIsInProgress!: boolean;

	@Output() resumeApplication: EventEmitter<MainApplicationResponse> = new EventEmitter();
	@Output() cancelApplication: EventEmitter<MainApplicationResponse> = new EventEmitter();

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

	onResume(appl: MainApplicationResponse): void {
		this.resumeApplication.emit(appl);
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
}
