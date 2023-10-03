import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SwlApplicationTypeCode, SwlTypeCode } from 'src/app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService } from '../licence-application.service';

export interface ApplicationResponse {
	id?: string;
	caseId?: string;
	licenceTypeCode?: SwlTypeCode;
	applicationTypeCode?: SwlApplicationTypeCode;
	updatedOn?: null | string;
}

@Component({
	selector: 'app-applications-in-progress',
	template: `
		<!--  *ngIf="isAuthenticated | async" -->
		<section class="step-section">
			<!-- <div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="card-section my-4 px-4 py-4" *ngFor="let appl of applications; let i = index">
						<div class="row">
							<div class="col-lg-2">
								<mat-icon>badge</mat-icon>
							</div>

							<div class="col-lg-3">
								<small class="d-block">Licence Type</small>
								<strong> {{ appl.licenceTypeCode | options : 'SwlTypeCodes' }} </strong>
							</div>
							<div class="col-lg-3">
								<small class="d-block">Application Type</small>
								<strong> {{ appl.applicationTypeCode | options : 'SwlApplicationTypeCodes' }} </strong>
							</div>
							<div class="col-lg-3">
								<small class="d-block">Application Type</small>
								<strong> {{ appl.applicationTypeCode | options : 'SwlApplicationTypeCodes' }} </strong>
							</div>
						</div>

						<div class="row mb-2 justify-content-end">
							<hr class="d-print-none col-lg-10 pull-right" />
						</div>

						<div class="row mb-2">
							<div class="offset-lg-2 col-lg-7">
								<small class="d-block">Licence Categories</small>
								<div class="text">
									<div>Armoured Car Guard</div>
									<div>Security Alarm Installer</div>
									<div>Security Guard</div>
								</div>
							</div>
							<div class="col-lg-3">
								<small class="d-block">Authorizations</small>
								<div class="text">test</div>
							</div>
						</div>
					</div>
				</div>
			</div> -->

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
							<mat-header-cell *matHeaderCellDef>Licence Type</mat-header-cell>
							<mat-cell *matCellDef="let appl">
								<span class="mobile-label">Licence Type:</span>
								{{ appl.licenceTypeCode | options : 'SwlTypeCodes' }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="applicationTypeCode">
							<mat-header-cell *matHeaderCellDef>Application Type</mat-header-cell>
							<mat-cell *matCellDef="let appl">
								<span class="mobile-label">Application Type:</span>
								{{ appl.applicationTypeCode | options : 'SwlApplicationTypeCodes' }}
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

			small {
				color: var(--color-grey-dark);
				line-height: 1.3em;
			}

			.text {
				line-height: 1.4em;
			}

			.card-section {
				background-color: #ededed !important;
				border-left: 3px solid #38598a;
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class ApplicationsInProgressComponent implements OnInit {
	constants = SPD_CONSTANTS;

	applications: Array<ApplicationResponse> = [];

	dataSource: MatTableDataSource<ApplicationResponse> = new MatTableDataSource<ApplicationResponse>([]);
	columns: string[] = ['rownumber', 'licenceTypeCode', 'applicationTypeCode', 'caseId', 'updatedOn', 'action'];

	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.applications = [
			{
				id: '1',
				caseId: 'CRE-NWQ3X7Y10528',
				licenceTypeCode: SwlTypeCode.SecurityWorkerLicence,
				applicationTypeCode: SwlApplicationTypeCode.NewOrExpired,
				updatedOn: '2023-09-26T19:43:25+00:00',
			},
			{
				id: '2',
				caseId: 'CSK-RNS2V9K40521m',
				licenceTypeCode: SwlTypeCode.SecurityWorkerLicence,
				applicationTypeCode: SwlApplicationTypeCode.Renewal,
				updatedOn: '2023-06-11T16:43:25+00:00',
			},
			{
				id: '3',
				caseId: 'CLW-RPC2V8K10521b',
				licenceTypeCode: SwlTypeCode.SecurityWorkerLicence,
				applicationTypeCode: SwlApplicationTypeCode.Replacement,
				updatedOn: '2023-03-07T19:43:25+00:00',
			},
			{
				id: '4',
				caseId: 'CLW-UPC2V8K10521b',
				licenceTypeCode: SwlTypeCode.SecurityWorkerLicence,
				applicationTypeCode: SwlApplicationTypeCode.Update,
				updatedOn: '2023-03-07T19:43:25+00:00',
			},
		];

		this.dataSource.data = this.applications;
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
