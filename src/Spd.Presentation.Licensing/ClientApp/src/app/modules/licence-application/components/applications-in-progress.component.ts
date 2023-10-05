import { Component, OnInit } from '@angular/core';
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
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<h2 class="my-3 fw-normal">Your Applications</h2>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>

					<div class="card-section my-4 px-4 py-3" *ngFor="let appl of applications; let i = index">
						<div class="row">
							<div class="col-lg-2">
								<div class="fs-5 fw-normal" style="color: var(--color-primary);">
									{{ appl.licenceTypeCode | options : 'SwlTypeCodes' }}
								</div>
							</div>
							<div class="col-lg-10">
								<div class="row">
									<div class="col-lg-6">
										<small class="d-block">Licence Term</small>
										<strong>1 Year</strong>
									</div>
									<div class="col-lg-6">
										<small class="d-block">Application Type</small>
										<strong> {{ appl.applicationTypeCode | options : 'SwlApplicationTypeCodes' }} </strong>
									</div>
									<mat-divider class="my-2"></mat-divider>
								</div>
								<div class="row mb-2">
									<div class="col-lg-6">
										<small class="d-block">Case ID</small>
										<strong> {{ appl.caseId }}</strong>
									</div>
									<div class="col-lg-3">
										<small class="d-block">Last Updated</small>
										<strong>{{ appl.updatedOn | date : constants.date.dateFormat }}</strong>
									</div>
									<div class="col-lg-3 text-end">
										<button mat-stroked-button color="primary" class="large w-auto" (click)="onResume(appl)">
											<mat-icon>keyboard_double_arrow_right</mat-icon>Resume
										</button>
									</div>
								</div>
								<!-- <div class="row">
									<div class="col-12 text-end">
										<button mat-flat-button color="primary" class="large w-auto" (click)="onResume(appl)">
											Resume
										</button>
									</div>
								</div> -->
							</div>
						</div>
					</div>

					<!-- <div class="card-section my-4 px-4 py-3" *ngFor="let appl of applications; let i = index">
						<div class="row">
							<div class="col-lg-2">
								<mat-icon style="color: var(--color-primary); height: 60px;width: 60px;font-size: 60px;">
								badge
								</mat-icon>
							</div>

							<div class="col-lg-10">
								<div class="row">
									<div class="col-lg-6">
										<small class="d-block">Licence Term</small>
										<strong> {{ appl.licenceTypeCode | options : 'SwlTypeCodes' }} </strong>
									</div>
									<div class="col-lg-6">
										<small class="d-block">Application Type</small>
										<strong> {{ appl.applicationTypeCode | options : 'SwlApplicationTypeCodes' }} </strong>
									</div>
									<div class="col-lg-3">
								<small class="d-block">Application Type</small>
								<strong> {{ appl.applicationTypeCode | options : 'SwlApplicationTypeCodes' }} </strong>
							</div>
									<mat-divider class="my-2"></mat-divider>
								</div>
							</div>
						</div>

						<div class="row mb-2">
							<div class="offset-lg-2 col-lg-5">
								<small class="d-block">Case ID</small>
								<strong> {{ appl.caseId }}</strong>
							</div>
							<div class="col-lg-5">
								<small class="d-block">Last Updated</small>
								<strong>{{ appl.updatedOn | date : constants.date.dateFormat }}</strong>
							</div>
						</div>

						<div class="row mb-2">
							<div class="offset-lg-2 col-lg-7">
								<small class="d-block">Licence Categories</small>
								<div class="text">
									<div>Armoured Car Guard</div>
									<div>Security Guard</div>
								</div>
							</div>
							<div class="col-lg-3">
								<small class="d-block">Authorizations</small>
								<div class="text">test</div>
							</div>
						</div>

						<div class="row">
							<div class="offset-lg-2 col-lg-10 text-end">
								<button mat-flat-button color="primary" class="large w-auto" (click)="onResume(appl)">Resume</button>
							</div>
						</div>
					</div> -->

					<button mat-flat-button color="primary" class="large w-auto mb-4" (click)="onContinueWithNew()">
						Create a New Application
					</button>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
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
				licenceTypeCode: SwlTypeCode.ArmouredVehiclePermit,
				applicationTypeCode: SwlApplicationTypeCode.Renewal,
				updatedOn: '2023-06-11T16:43:25+00:00',
			},
			{
				id: '3',
				caseId: 'CLW-RPC2V8K10521b',
				licenceTypeCode: SwlTypeCode.BodyArmourPermit,
				applicationTypeCode: SwlApplicationTypeCode.Replacement,
				updatedOn: '2023-03-07T19:43:25+00:00',
			},
			{
				id: '4',
				caseId: 'CLW-UPC2V8K10521b',
				licenceTypeCode: SwlTypeCode.SecurityBusinessLicence,
				applicationTypeCode: SwlApplicationTypeCode.Update,
				updatedOn: '2023-03-07T19:43:25+00:00',
			},
		];
	}

	onResume(appl: ApplicationResponse): void {
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
