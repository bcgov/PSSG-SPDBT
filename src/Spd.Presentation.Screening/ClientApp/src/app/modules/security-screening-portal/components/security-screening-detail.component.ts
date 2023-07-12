import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
	ApplicantApplicationFileListResponse,
	ApplicantApplicationFileResponse,
	ApplicantApplicationResponse,
	ApplicationPortalStatusCode,
	CaseSubStatusCode,
	FileTemplateTypeCode,
	FileTypeCode,
} from 'src/app/api/models';
import { ApplicantService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { UtilService } from 'src/app/core/services/util.service';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';
import {
	CrcUploadDialogData,
	SecurityScreeningUploadModalComponent,
} from './security-screening-upload-modal.component';

@Component({
	selector: 'app-security-screening-detail',
	template: `
		<div class="row">
			<div class="col-xl-6 col-lg-4 col-md-12">
				<h3 class="fw-normal">Application Information</h3>
				<h4 class="fw-light">{{ applicantName }}</h4>
			</div>
			<div class="col-xl-6 col-lg-8 col-md-12">
				<div class="d-flex justify-content-end">
					<button mat-stroked-button color="primary" class="large w-auto m-2" aria-label="Back" (click)="onBack()">
						<mat-icon>arrow_back</mat-icon>Back
					</button>
					<button mat-flat-button color="primary" class="large w-auto m-2" aria-label="Download Receipt">
						<mat-icon>file_download</mat-icon>Download Receipt
					</button>
				</div>
			</div>
		</div>

		<mat-divider></mat-divider>

		<p class="warning-text fw-semibold my-2">
			This page cannot be used as substitute for a clearance letter from the Criminal Records Review Program.
		</p>

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

			<h3 class="fw-semibold d-flex mt-2" style="color: var(--color-primary);">
				{{ application.orgName }}
				<mat-chip-listbox aria-label="Status" class="ms-4">
					<mat-chip-option [selectable]="false" [ngClass]="applicationPortalStatusClass">
						{{ application.status | options : 'ApplicationPortalStatusTypes' }}
					</mat-chip-option>
				</mat-chip-listbox>
			</h3>

			<div class="row mt-2 mb-4">
				<div class="col-md-11 col-sm-12">
					<section class="px-4 py-2 ">
						<div class="row mt-2">
							<div class="col-lg-3 col-md-4">
								<small class="d-block text-muted">Case ID</small>
								<strong> {{ application.applicationNumber }} </strong>
							</div>
							<div class="col-lg-3 col-md-4">
								<small class="d-block text-muted mt-2 mt-md-0">Submitted On</small>
								<strong> {{ application.createdOn | date : constants.date.dateFormat : 'UTC' }} </strong>
							</div>
							<div class="col-lg-3 col-md-4">
								<small class="d-block text-muted">Paid By</small>
								<strong> {{ application.payeeType }}</strong>
							</div>
						</div>
					</section>
				</div>
			</div>
		</ng-container>

		<ng-container *ngIf="fingerprintsAlert || statutoryDeclarationAlert">
			<h4 class="subheading fw-normal mb-4">Downloadable Documents</h4>
			<div class="row">
				<div class="col-xl-4 col-lg-6 col-md-6 col-sm-12" *ngIf="fingerprintsAlert">
					<button
						mat-flat-button
						color="primary"
						class="m-2"
						(click)="onDownloadFile(fileTemplateTypeCodes.FingerprintPkg)"
						aria-label="Download Fingerprint Package"
					>
						<mat-icon>file_download</mat-icon>Download Fingerprint Package
					</button>
				</div>
				<div class="col-xl-4 col-lg-6 col-md-6 col-sm-12" *ngIf="statutoryDeclarationAlert">
					<button
						mat-flat-button
						color="primary"
						class="m-2"
						(click)="onDownloadFile(fileTemplateTypeCodes.StatutoryDeclaration)"
						aria-label="Download Statutory Declaration"
					>
						<mat-icon>file_download</mat-icon>Download Statutory Declaration
					</button>
				</div>
			</div>
		</ng-container>

		<ng-container *ngIf="opportunityToRespondAlert || requestForAdditionalInfoAlert">
			<h4 class="subheading fw-normal mb-4">Upload Document</h4>
			<div class="row">
				<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
					<button
						mat-flat-button
						color="primary"
						class="m-2"
						aria-label="Upload a Word or PDF document providing more information"
						(click)="onUploadFile()"
					>
						<mat-icon>file_upload</mat-icon>Upload a Word or PDF Document
					</button>
				</div>
			</div>
		</ng-container>

		<ng-container *ngIf="documentHistoryExists">
			<h4 class="subheading fw-normal mb-4">Document Upload History</h4>
			<div class="row">
				<div class="col-12">
					<mat-table [dataSource]="dataSourceHistory">
						<ng-container matColumnDef="fileName">
							<mat-header-cell *matHeaderCellDef>Document Name</mat-header-cell>
							<mat-cell *matCellDef="let document">
								<span class="mobile-label">Document Name:</span>
								{{ document.fileName }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="fileTypeCode">
							<mat-header-cell *matHeaderCellDef>File Type</mat-header-cell>
							<mat-cell *matCellDef="let document">
								<span class="mobile-label">File Type:</span>
								{{ document.fileTypeCode | options : 'FileTypes' }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="uploadedDateTime">
							<mat-header-cell *matHeaderCellDef>Uploaded On</mat-header-cell>
							<mat-cell *matCellDef="let document">
								<span class="mobile-label">Uploaded On:</span>
								{{ document.uploadedDateTime | date : constants.date.dateFormat : 'UTC' }}
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columnsHistory; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columnsHistory"></mat-row>
					</mat-table>
				</div>
			</div>
		</ng-container>
	`,
	styles: [
		`
			.warning-text {
				color: var(--color-red);
			}

			.subheading {
				color: var(--color-grey);
			}
		`,
	],
})
export class SecurityScreeningDetailComponent implements OnInit, AfterViewInit {
	applicantName = '';
	applicationPortalStatusClass = '';
	documentHistoryExists = false;
	application: ApplicantApplicationResponse | null = null;

	constants = SPD_CONSTANTS;
	fileTemplateTypeCodes = FileTemplateTypeCode;

	dataSourceHistory: MatTableDataSource<ApplicantApplicationFileResponse> =
		new MatTableDataSource<ApplicantApplicationFileResponse>([]);
	columnsHistory: string[] = ['fileName', 'fileTypeCode', 'uploadedDateTime'];

	opportunityToRespondAlert: string | null = null;
	requestForAdditionalInfoAlert: string | null = null;
	fingerprintsAlert: string | null = null;
	statutoryDeclarationAlert: string | null = null;
	associatedFileType: FileTypeCode | null = null;

	constructor(
		private router: Router,
		private applicantService: ApplicantService,
		private authUserService: AuthUserService,
		private location: Location,
		private utilService: UtilService,
		private dialog: MatDialog
	) {}

	ngOnInit() {
		const applicationData = (this.location.getState() as any)?.applicationData;
		if (applicationData) {
			this.loadList(applicationData);
		} else {
			this.router.navigate([SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST)]);
		}
	}

	ngAfterViewInit() {
		this.scrollToTop();
	}

	scrollToTop(): void {
		const headerElement = document.getElementsByClassName('app-header').item(0);
		if (headerElement) {
			setTimeout(() => {
				headerElement.scrollIntoView({
					block: 'start',
					inline: 'nearest',
					behavior: 'smooth',
				});
			}, 250);
		}
	}

	onBack(): void {
		this.router.navigateByUrl(SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST));
	}

	onUploadFile(): void {
		const dialogOptions: CrcUploadDialogData = {
			applicationId: this.application!.id!,
			fileType: this.associatedFileType!,
		};

		this.dialog
			.open(SecurityScreeningUploadModalComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp) {
					this.router.navigate([SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST)]);
				}
			});
	}

	onDownloadFile(fileTemplateType: FileTemplateTypeCode): void {
		this.applicantService
			.apiApplicantsScreeningsApplicationIdFilesGet({ applicationId: this.application?.id! })
			.pipe()
			.subscribe((res: ApplicantApplicationFileListResponse) => {
				this.dataSourceHistory.data = res.items ?? [];
				this.documentHistoryExists = this.dataSourceHistory.data.length > 0 ?? false;
			});

		this.applicantService
			.apiApplicantsScreeningsFileTemplatesGet$Response({
				fileTemplateType,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
			});
	}

	private loadList(application: ApplicantApplicationResponse): void {
		this.applicantName = this.utilService.getFullName(
			this.authUserService.bcscUserWhoamiProfile?.firstName,
			this.authUserService.bcscUserWhoamiProfile?.lastName
		);

		this.application = application;
		this.applicationPortalStatusClass = this.utilService.getApplicationPortalStatusClass(application.status);

		if (application.status == ApplicationPortalStatusCode.AwaitingApplicant) {
			switch (application.caseSubStatus) {
				case CaseSubStatusCode.Fingerprints:
					this.fingerprintsAlert = this.getFingerprintsText();
					this.associatedFileType = FileTypeCode.ConfirmationOfFingerprints;
					break;
				case CaseSubStatusCode.OpportunityToRespond:
					this.opportunityToRespondAlert = this.getOpportunityToRespondText();
					this.associatedFileType = FileTypeCode.OpportunityToRespond;
					break;
				case CaseSubStatusCode.ApplicantInformation:
					this.requestForAdditionalInfoAlert = this.getRequestForAdditionalInfoText();
					this.associatedFileType = FileTypeCode.ApplicantInformation;
					break;
				case CaseSubStatusCode.StatutoryDeclaration:
					this.statutoryDeclarationAlert = this.getStatutoryDeclarationText();
					this.associatedFileType = FileTypeCode.StatutoryDeclaration;
					break;
			}
		}

		this.loadDocumentHistory();
	}

	private loadDocumentHistory(): void {
		this.applicantService
			.apiApplicantsScreeningsApplicationIdFilesGet({ applicationId: this.application?.id! })
			.pipe()
			.subscribe((res: ApplicantApplicationFileListResponse) => {
				this.dataSourceHistory.data = res.items ?? [];
				this.documentHistoryExists = this.dataSourceHistory.data.length > 0 ?? false;
			});
	}

	private getOpportunityToRespondText(): string | null {
		return 'You have to respond to the outcome of your risk assessment. Upload a Word or PDF document providing more information.';
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
