/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationPortalStatusCode, ApplicationTypeCode } from '@app/api/models';
import { MainApplicationResponse } from '../../services/common-application.service';

@Component({
	selector: 'app-main-applications',
	template: `
		<div class="mb-3" *ngIf="applicationsDataSource.data.length > 0">
			<div class="text-primary-color fs-5 py-3">Applications</div>

			<div class="row summary-card-section summary-card-section__orange m-0">
				<div class="col-12">
					<mat-table [dataSource]="applicationsDataSource" class="draft-table" [multiTemplateDataRows]="true">
						<ng-container matColumnDef="serviceTypeCode">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Licence Type</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Licence Type:</span>
								<span class="my-2">
									{{ application.serviceTypeCode | options : 'WorkerLicenceTypes' }}
								</span>
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
								{{ application.applicationTypeCode | options : 'ApplicationTypes' }}
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
									{{ application.applicationPortalStatusCode | options : 'ApplicationPortalStatusTypes' | default }}
								</span>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									color="primary"
									class="large my-2"
									(click)="onResume(application)"
									*ngIf="isResumable(application)"
								>
									<mat-icon>play_arrow</mat-icon>Resume
								</button>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="applicationColumns; sticky: true"></mat-header-row>
						<mat-row class="mat-data-row" *matRowDef="let row; columns: applicationColumns"></mat-row>
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
				min-width: 160px;
				.table-button {
					min-width: 140px;
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
})
export class MainApplicationsComponent {
	applicationColumns: string[] = [
		'serviceTypeCode',
		'createdOn',
		'submittedOn',
		'applicationTypeCode',
		'caseNumber',
		'applicationPortalStatusCode',
		'action1',
	];

	@Input() applicationsDataSource!: MatTableDataSource<MainApplicationResponse>;

	@Output() resumeApplication: EventEmitter<MainApplicationResponse> = new EventEmitter();

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

	onResume(appl: MainApplicationResponse): void {
		this.resumeApplication.emit(appl);
	}

	isResumable(appl: MainApplicationResponse): boolean {
		return (
			appl.applicationTypeCode === ApplicationTypeCode.New &&
			appl.applicationPortalStatusCode === ApplicationPortalStatusCode.Draft
		);
	}
}