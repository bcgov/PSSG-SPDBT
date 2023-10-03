import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SwlStatusTypeCode, SwlTypeCode } from 'src/app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService } from '../licence-application.service';

export interface ApplicationResponse {
	id?: string;
	caseId?: string;
	licenceTypeCode?: SwlTypeCode;
	licenceStatusTypeCode?: SwlStatusTypeCode;
	updatedOn?: null | string;
}

@Component({
	selector: 'app-incomplete-applications',
	template: `
		<!--  *ngIf="isAuthenticated | async" -->
		<section class="step-section">
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mb-3 mx-auto py-4">
					<app-step-title title="Your Applications"></app-step-title>
					<mat-divider class="mb-3"></mat-divider>

					<mat-table class="my-4" [dataSource]="dataSource">
						<ng-container matColumnDef="rownumber">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let appl; let i = index">
								<span class="mobile-label"></span>
								<mat-chip-option [selectable]="false" class="mat-chip-green me-2"> {{ i + 1 }} </mat-chip-option>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="licenceTypeCode">
							<mat-header-cell *matHeaderCellDef>Type</mat-header-cell>
							<mat-cell *matCellDef="let appl">
								<span class="mobile-label">Type:</span>
								{{ appl.licenceTypeCode | options : 'SwlTypeCodes' }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="licenceStatusTypeCode">
							<mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
							<mat-cell *matCellDef="let appl">
								<span class="mobile-label">Status:</span>
								{{ appl.licenceStatusTypeCode | options : 'SwlStatusTypeCodes' }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="caseId">
							<mat-header-cell *matHeaderCellDef>Case ID</mat-header-cell>
							<mat-cell *matCellDef="let appl">
								<span class="mobile-label">Case ID:</span>
								{{ appl.caseId }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="updatedOn">
							<mat-header-cell *matHeaderCellDef>Last Updated</mat-header-cell>
							<mat-cell *matCellDef="let appl">
								<span class="mobile-label">Last Updated:</span>
								{{ appl.updatedOn | date : constants.date.dateFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let appl">
								<span class="mobile-label"></span>
								<button mat-flat-button color="primary" class="table-button w-auto" (click)="onContinue(appl)">
									Continue
								</button>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
					<button mat-flat-button color="primary" class="large w-auto mt-4" (click)="onContinueWithNew()">
						Create a New Application
					</button>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.mat-column-rownumber {
				max-width: 70px;
			}
		`,
	],
})
export class IncompleteApplicationsComponent implements OnInit {
	constants = SPD_CONSTANTS;

	dataSource: MatTableDataSource<ApplicationResponse> = new MatTableDataSource<ApplicationResponse>([]);
	columns: string[] = ['rownumber', 'licenceTypeCode', 'licenceStatusTypeCode', 'caseId', 'updatedOn', 'action'];

	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		const data: Array<ApplicationResponse> = [
			{
				id: '1',
				caseId: 'CRE-NWQ3X7Y10528',
				licenceTypeCode: SwlTypeCode.SecurityWorkerLicence,
				licenceStatusTypeCode: SwlStatusTypeCode.NewOrExpired,
				updatedOn: '2023-09-26T19:43:25+00:00',
			},
			{
				id: '2',
				caseId: 'CSK-RNS2V9K40521m',
				licenceTypeCode: SwlTypeCode.SecurityWorkerLicence,
				licenceStatusTypeCode: SwlStatusTypeCode.Renewal,
				updatedOn: '2023-06-11T16:43:25+00:00',
			},
			{
				id: '3',
				caseId: 'CLW-RPC2V8K10521b',
				licenceTypeCode: SwlTypeCode.SecurityWorkerLicence,
				licenceStatusTypeCode: SwlStatusTypeCode.Replacement,
				updatedOn: '2023-03-07T19:43:25+00:00',
			},
			{
				id: '4',
				caseId: 'CLW-UPC2V8K10521b',
				licenceTypeCode: SwlTypeCode.SecurityWorkerLicence,
				licenceStatusTypeCode: SwlStatusTypeCode.Update,
				updatedOn: '2023-03-07T19:43:25+00:00',
			},
		];

		this.dataSource.data = data;
	}

	onContinue(appl: ApplicationResponse): void {
		if (appl.id == '1') {
			this.licenceApplicationService.loadLicenceNew();
		} else if (appl.id == '2') {
			this.licenceApplicationService.loadLicenceRenewal();
		} else if (appl.id == '3') {
			this.licenceApplicationService.loadLicenceReplacement();
		} else if (appl.id == '4') {
			this.licenceApplicationService.loadLicenceUpdate();
		}
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATION));
	}

	onContinueWithNew(): void {
		this.licenceApplicationService.loadNewLicence();
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LICENCE_SELECTION));
	}
}
