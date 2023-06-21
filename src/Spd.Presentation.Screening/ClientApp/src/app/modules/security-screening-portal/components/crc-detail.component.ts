import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantApplicationResponse, ApplicationPortalStatusCode } from 'src/app/api/models';
import { ApplicantService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { UtilService } from 'src/app/core/services/util.service';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-crc-detail',
	template: `
		<div class="row">
			<div class="col-xl-6 col-lg-4 col-md-12">
				<h3 class="fw-normal">Application Information</h3>
				<h4 class="fw-light">{{ applicantName }}</h4>
			</div>
			<div class="col-xl-6 col-lg-8 col-md-12">
				<div class="d-flex justify-content-end">
					<button mat-stroked-button color="primary" class="w-auto m-2" aria-label="Back" (click)="onBack()">
						<mat-icon>arrow_back</mat-icon>Back
					</button>
					<button mat-flat-button color="primary" class="w-auto m-2" aria-label="Download Receipt">
						<mat-icon>file_download</mat-icon>Download Receipt
					</button>
				</div>
			</div>
		</div>

		<mat-divider class="mb-2 mb-lg-4"></mat-divider>

		<ng-container *ngIf="application">
			<div class="row">
				<div class="col-12">
					<app-alert type="danger" *ngIf="opportunityToRespondAlert">
						<div class="fw-semibold">{{ opportunityToRespondAlert }}</div>
					</app-alert>
					<app-alert type="danger" *ngIf="requestForAdditionalInfoAlert">
						<div class="fw-semibold">{{ requestForAdditionalInfoAlert }}</div>
					</app-alert>
					<app-alert type="danger" *ngIf="fingerprintsAlert">
						<div class="fw-semibold">{{ fingerprintsAlert }}</div>
					</app-alert>
					<app-alert type="danger" *ngIf="statutoryDeclarationAlert">
						<div class="fw-semibold">{{ statutoryDeclarationAlert }}</div>
					</app-alert>
				</div>
			</div>

			<h3 class="fw-normal d-flex">
				{{ application.orgName }}
				<mat-chip-listbox aria-label="Status" class="ms-4">
					<mat-chip-option [selectable]="false" [ngClass]="applicationPortalStatusClass">
						{{ application.status | options : 'ApplicationPortalStatusTypes' }}
					</mat-chip-option>
				</mat-chip-listbox>
			</h3>
			<ul>
				<li>
					The CRRP application was submitted on {{ application.createdOn | date : constants.date.dateFormat : 'UTC' }}
				</li>
				<li>Paid by the {{ application.payeeType }}</li>
				<li>The Case ID is {{ application.applicationNumber }}</li>
			</ul>

			<ng-container *ngIf="fingerprintsAlert || statutoryDeclarationAlert">
				<h3 class="fw-normal mt-4">Downloadable Documents</h3>
				<div class="row">
					<div class="col-xl-4 col-lg-6 col-md-6 col-sm-12" *ngIf="fingerprintsAlert">
						<button mat-stroked-button color="primary" class="m-2" aria-label="Download Fingerprint Package">
							<mat-icon>file_download</mat-icon>Download Fingerprint Package
						</button>
					</div>
					<div class="col-xl-4 col-lg-6 col-md-6 col-sm-12" *ngIf="statutoryDeclarationAlert">
						<button mat-stroked-button color="primary" class="m-2" aria-label="Download Statutory Declaration">
							<mat-icon>file_download</mat-icon>Download Statutory Declaration
						</button>
					</div>
				</div>
			</ng-container>

			<h3 class="fw-normal mt-4">Document Upload History</h3>
			<ng-container *ngIf="opportunityToRespondAlert || requestForAdditionalInfoAlert">
				<div class="row">
					<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
						<button
							mat-stroked-button
							color="primary"
							class="m-2"
							aria-label="Upload a Word or PDF document providing more information"
						>
							<mat-icon>file_upload</mat-icon>Upload a Word or PDF Document
						</button>
					</div>
				</div>
			</ng-container>

			<div class="row">
				<div class="col-12">
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="documentName">
							<mat-header-cell *matHeaderCellDef>Document Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Document Name:</span>
								{{ application.documentName }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="uploadedOn">
							<mat-header-cell *matHeaderCellDef>Uploaded On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Uploaded On:</span>
								{{ application.uploadedOn | date : constants.date.dateFormat : 'UTC' }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label"></span>
								<a mat-flat-button class="m-2" aria-label="Remove Document">
									<mat-icon>delete_outline</mat-icon>Remove document
								</a>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
				</div>
			</div>
		</ng-container>
	`,
	styles: [],
})
export class CrcDetailComponent {
	applicantName = '';
	applicationPortalStatusClass = '';
	application: ApplicantApplicationResponse | null = null;

	constants = SPD_CONSTANTS;
	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
	columns: string[] = ['documentName', 'uploadedOn', 'action'];

	opportunityToRespondAlert: string | null = null;
	requestForAdditionalInfoAlert: string | null = null;
	fingerprintsAlert: string | null = null;
	statutoryDeclarationAlert: string | null = null;

	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private applicantService: ApplicantService,
		private authUserService: AuthUserService,
		private utilService: UtilService
	) {}

	ngOnInit() {
		this.route.queryParamMap.subscribe((params) => {
			const applicationId = params.get('applicationId');
			if (!applicationId) {
				this.router.navigateByUrl(SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST));
				return;
			}

			this.loadList(applicationId);
		});
	}

	onBack(): void {
		this.router.navigateByUrl(SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST));
	}

	private loadList(applicationId: string): void {
		this.applicantName = this.utilService.getFullName(
			this.authUserService.applicantProfile?.firstName,
			this.authUserService.applicantProfile?.lastName
		);

		this.applicantService
			.apiApplicantsApplicantIdApplicationsApplicationIdGet({
				applicantId: this.authUserService.applicantProfile?.applicantId!,
				applicationId: applicationId,
			})
			.pipe()
			.subscribe((res: ApplicantApplicationResponse) => {
				this.application = res;
				this.applicationPortalStatusClass = this.utilService.getApplicationPortalStatusClass(res.status);

				if (res.status == ApplicationPortalStatusCode.AwaitingApplicant) {
					switch (res.caseSubStatus?.toUpperCase()) {
						case 'FINGERPRINTS':
							this.fingerprintsAlert = this.getFingerprintsText();
							break;
						case 'APPLICANTINFORMATION':
							this.opportunityToRespondAlert = this.getOpportunityToRespondText();
							break;
						case 'AWAITINGINFORMATION':
							this.requestForAdditionalInfoAlert = this.getRequestForAdditionalInfoText();
							break;
						case 'STATUTORYDECLARATION':
							this.statutoryDeclarationAlert = this.getStatutoryDeclarationText();
							break;
					}
				}
			});

		this.dataSource = new MatTableDataSource<ApplicantApplicationResponse>([]);
		this.dataSource.data = [
			{
				documentName: 'file.pdf',
				uploadedOn: '2023-01-14T00:13:05.865Z',
			},
			{
				documentName: 'example.doc',
				uploadedOn: '2023-02-04T00:10:05.865Z',
			},
		];
	}

	private getOpportunityToRespondText(): string | null {
		return 'You can to respond to the outcome of your risk assessment. Upload a Word or PDF document providing more information.';
	}

	private getRequestForAdditionalInfoText(): string | null {
		return 'Security Programs Division has requested additional information. Upload a Word or PDF document.';
	}

	private getFingerprintsText(): string | null {
		return 'Fingerprint information required. Download the fingerprint package.';
	}

	private getStatutoryDeclarationText(): string | null {
		return 'Statutory declaration requested. Download statutory declaration form and upload the filled form.';
	}
}
