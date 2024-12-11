import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import {
	BooleanTypeCode,
	GovernmentIssuedPhotoIdTypes,
	PermitProofOfCitizenshipTypes,
	PermitProofOfResidenceStatusTypes,
	ProofOfCanadianCitizenshipTypes,
} from '@app/core/code-types/model-desc.models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-permit-citizenship',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<mat-radio-group aria-label="Select an option" formControlName="isCanadianCitizen">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-divider class="my-2"></mat-divider>
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</mat-radio-group>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('isCanadianCitizen')?.dirty || form.get('isCanadianCitizen')?.touched) &&
								form.get('isCanadianCitizen')?.invalid &&
								form.get('isCanadianCitizen')?.hasError('required')
							"
							>This is required</mat-error
						>
					</div>
				</div>

				<div class="row mt-4" *ngIf="isCanadianCitizen.value" @showHideTriggerSlideAnimation>
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

						<ng-container *ngIf="isCanadianCitizen.value === booleanTypeCodes.Yes; else notCanadianCitizenHeading">
							<div class="text-minor-heading mb-2">Proof of Canadian citizenship</div>
						</ng-container>
						<ng-template #notCanadianCitizenHeading>
							<div class="text-minor-heading mb-2">Proof of residency</div>
						</ng-template>

						<div class="row my-2" *ngIf="isCanadianCitizen.value === booleanTypeCodes.Yes; else notCanadianCitizen">
							<div class="col-md-12" [ngClass]="showIfPassport ? 'col-lg-12' : 'col-lg-6'">
								<mat-form-field>
									<mat-label>Type of Proof</mat-label>
									<mat-select formControlName="canadianCitizenProofTypeCode" [errorStateMatcher]="matcher">
										<mat-option
											class="proof-option"
											*ngFor="let item of proofOfCanadianCitizenshipTypes; let i = index"
											[value]="item.code"
										>
											{{ item.desc }}
										</mat-option>
									</mat-select>
									<mat-error *ngIf="form.get('canadianCitizenProofTypeCode')?.hasError('required')">
										This is required
									</mat-error>
								</mat-form-field>
							</div>
							<div class="col-lg-6 col-md-12" *ngIf="showIfPassport">
								<mat-form-field>
									<mat-label>Document Expiry Date</mat-label>
									<input
										matInput
										[matDatepicker]="picker"
										formControlName="expiryDate"
										[min]="minDate"
										[errorStateMatcher]="matcher"
									/>
									<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
									<mat-datepicker #picker startView="multi-year"></mat-datepicker>
									<mat-error *ngIf="form.get('expiryDate')?.hasError('required')"> This is required </mat-error>
									<mat-error *ngIf="form.get('expiryDate')?.hasError('matDatepickerMin')">
										Invalid expiry date
									</mat-error>
								</mat-form-field>
							</div>
							<div class="col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Document ID</mat-label>
									<input matInput formControlName="documentId" maxlength="30" />
								</mat-form-field>
							</div>
						</div>
						<ng-template #notCanadianCitizen>
							<div class="row my-2">
								<div class="col-lg-7 col-md-12">
									<mat-radio-group aria-label="Select an option" formControlName="isCanadianResident">
										<mat-radio-button [value]="booleanTypeCodes.Yes">I am a resident of Canada</mat-radio-button>
										<mat-radio-button [value]="booleanTypeCodes.No">I am not a Canadian resident</mat-radio-button>
									</mat-radio-group>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('isCanadianResident')?.dirty || form.get('isCanadianResident')?.touched) &&
											form.get('isCanadianResident')?.invalid &&
											form.get('isCanadianResident')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>
							</div>
						</ng-template>

						<ng-container *ngIf="isCanadianCitizen.value === booleanTypeCodes.No && isCanadianResident.value">
							<div class="row my-2">
								<div class="col-lg-12 col-md-12">
									<ng-container *ngIf="isCanadianResident.value === booleanTypeCodes.Yes; else notResidentOfCanada">
										<mat-form-field>
											<mat-label>Proof of Resident Status</mat-label>
											<mat-select formControlName="proofOfResidentStatusCode" [errorStateMatcher]="matcher">
												<mat-option
													class="proof-option"
													*ngFor="let item of proofOfResidenceStatusTypes; let i = index"
													[value]="item.code"
												>
													{{ item.desc }}
												</mat-option>
											</mat-select>
											<mat-error *ngIf="form.get('proofOfResidentStatusCode')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</ng-container>

									<ng-template #notResidentOfCanada>
										<mat-form-field>
											<mat-label>Proof of Citizenship</mat-label>
											<mat-select formControlName="proofOfCitizenshipCode" [errorStateMatcher]="matcher">
												<mat-option
													class="proof-option"
													*ngFor="let item of proofOfCitizenshipTypes; let i = index"
													[value]="item.code"
												>
													{{ item.desc }}
												</mat-option>
											</mat-select>
											<mat-error *ngIf="form.get('proofOfCitizenshipCode')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</ng-template>
								</div>
								<div class="col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Document Expiry Date</mat-label>
										<input
											matInput
											[matDatepicker]="picker"
											formControlName="expiryDate"
											[min]="minDate"
											[errorStateMatcher]="matcher"
										/>
										<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
										<mat-datepicker #picker startView="multi-year"></mat-datepicker>
										<mat-error *ngIf="form.get('expiryDate')?.hasError('required')"> This is required </mat-error>
										<mat-error *ngIf="form.get('expiryDate')?.hasError('matDatepickerMin')">
											Invalid expiry date
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Document ID</mat-label>
										<input matInput formControlName="documentId" maxlength="30" />
									</mat-form-field>
								</div>
							</div>
						</ng-container>

						<div
							*ngIf="isCanadianCitizen.value === booleanTypeCodes.Yes || isCanadianResident.value"
							@showHideTriggerSlideAnimation
						>
							<div class="row mb-2">
								<div class="col-12">
									<ng-container *ngIf="isCanadianCitizenYes; else notCanadianCitizenTitle">
										<div class="text-minor-heading mb-2">Upload a photo of your proof of Canadian citizenship</div>
										<ng-container *ngIf="isShowFrontAndBack">
											<app-alert type="info" icon="">
												Upload a photo of the front and back of your
												{{ canadianCitizenProofTypeCode.value | options: 'ProofOfCanadianCitizenshipTypes' }}
											</app-alert>
										</ng-container>

										<ng-container *ngIf="isShowPassportPhoto">
											<app-alert type="info" icon="info"> Upload a copy of the photo page of your passport </app-alert>
										</ng-container>
									</ng-container>
									<ng-template #notCanadianCitizenTitle>
										<div class="text-minor-heading mb-2">Upload a photo of your selected document type</div>
									</ng-template>

									<app-file-upload
										(fileUploaded)="onFileUploaded($event)"
										(fileRemoved)="onFileRemoved()"
										[control]="attachments"
										[maxNumberOfFiles]="10"
										[files]="attachments.value"
									></app-file-upload>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
											form.get('attachments')?.invalid &&
											form.get('attachments')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>
							</div>
						</div>

						<div class="row mt-4" *ngIf="showAdditionalGovIdData" @showHideTriggerSlideAnimation>
							<div class="col-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

								<div class="text-minor-heading mb-2">Type of additional piece of government-issued photo ID</div>
								<div class="row my-2">
									<div class="col-lg-12 col-md-12">
										<mat-form-field>
											<mat-label>Additional Type of Proof</mat-label>
											<mat-select formControlName="governmentIssuedPhotoTypeCode" [errorStateMatcher]="matcher">
												<mat-option
													*ngFor="let item of governmentIssuedPhotoIdTypes; let i = index"
													[value]="item.code"
												>
													{{ item.desc }}
												</mat-option>
											</mat-select>
											<mat-hint>This ID can be from another country</mat-hint>
											<mat-error *ngIf="form.get('governmentIssuedPhotoTypeCode')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Document Expiry Date</mat-label>
											<input
												matInput
												[matDatepicker]="picker"
												formControlName="governmentIssuedExpiryDate"
												[min]="minDate"
												[errorStateMatcher]="matcher"
											/>
											<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
											<mat-datepicker #picker startView="multi-year"></mat-datepicker>
											<mat-error *ngIf="form.get('governmentIssuedExpiryDate')?.hasError('required')">
												This is required
											</mat-error>
											<mat-error *ngIf="form.get('governmentIssuedExpiryDate')?.hasError('matDatepickerMin')">
												Invalid expiry date
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Document ID</mat-label>
											<input matInput formControlName="governmentIssuedDocumentId" maxlength="30" />
										</mat-form-field>
									</div>
								</div>
								<div class="row mb-2">
									<div class="col-12">
										<div class="text-minor-heading mb-2">Upload a photo of your ID</div>
										<ng-container *ngIf="isShowNonCanadianFrontAndBackAdditional">
											<app-alert type="info" icon="">
												Upload a photo of the front and back of your
												{{ governmentIssuedPhotoTypeCode.value | options: 'GovernmentIssuedPhotoIdTypes' }}
											</app-alert>
										</ng-container>
										<app-file-upload
											(fileUploaded)="onGovernmentIssuedFileUploaded($event)"
											(fileRemoved)="onGovernmentIssuedFileRemoved()"
											[maxNumberOfFiles]="10"
											[control]="governmentIssuedAttachments"
											[files]="governmentIssuedAttachments.value"
										></app-file-upload>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('governmentIssuedAttachments')?.dirty ||
													form.get('governmentIssuedAttachments')?.touched) &&
												form.get('governmentIssuedAttachments')?.invalid &&
												form.get('governmentIssuedAttachments')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [
		`
			.proof-option {
				padding-bottom: 12px;
			}
		`,
	],
	animations: [showHideTriggerSlideAnimation],
})
export class StepPermitCitizenshipComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	proofOfCanadianCitizenshipTypes = ProofOfCanadianCitizenshipTypes;
	proofOfResidenceStatusTypes = PermitProofOfResidenceStatusTypes;
	proofOfCitizenshipTypes = PermitProofOfCitizenshipTypes;
	governmentIssuedPhotoIdTypes = GovernmentIssuedPhotoIdTypes;

	minDate = this.utilService.getDateMin();
	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	form: FormGroup = this.permitApplicationService.citizenshipFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private permitApplicationService: PermitApplicationService,
		private utilService: UtilService
	) {}

	ngOnInit(): void {
		this.title = 'Are you a Canadian citizen?';
		this.subtitle = this.isRenewalOrUpdate
			? 'If your citizenship status has changed from your previous application, update your selections'
			: '';
	}

	onFileUploaded(file: File): void {
		this.permitApplicationService.hasValueChanged = true;

		if (!this.permitApplicationService.isAutoSave()) {
			return;
		}

		let citizenshipDocTypeCode = null;
		if (this.isCanadianCitizen.value == BooleanTypeCode.Yes) {
			citizenshipDocTypeCode = this.canadianCitizenProofTypeCode.value;
		} else {
			if (this.isCanadianResident.value == BooleanTypeCode.Yes) {
				citizenshipDocTypeCode = this.proofOfResidentStatusCode.value;
			} else {
				citizenshipDocTypeCode = this.proofOfCitizenshipCode.value;
			}
		}

		this.permitApplicationService.addUploadDocument(citizenshipDocTypeCode, file).subscribe({
			next: (resp: any) => {
				const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
				matchingFile.documentUrlId = resp.body[0].documentUrlId;
			},
			error: (error: any) => {
				console.log('An error occurred during file upload', error);

				this.fileUploadComponent.removeFailedFile(file);
			},
		});
	}

	onFileRemoved(): void {
		this.permitApplicationService.hasValueChanged = true;
	}

	onGovernmentIssuedFileUploaded(file: File): void {
		this.permitApplicationService.hasValueChanged = true;

		if (!this.permitApplicationService.isAutoSave()) {
			return;
		}

		const proofTypeCode = this.governmentIssuedPhotoTypeCode.value;

		this.permitApplicationService.addUploadDocument(proofTypeCode, file).subscribe({
			next: (resp: any) => {
				const matchingFile = this.governmentIssuedAttachments.value.find((item: File) => item.name == file.name);
				matchingFile.documentUrlId = resp.body[0].documentUrlId;
			},
			error: (error: any) => {
				console.log('An error occurred during file upload', error);

				this.fileUploadComponent.removeFailedFile(file);
			},
		});
	}

	onGovernmentIssuedFileRemoved(): void {
		this.permitApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get showIfPassport(): boolean {
		return this.canadianCitizenProofTypeCode.value === LicenceDocumentTypeCode.CanadianPassport;
	}

	get showAdditionalGovIdData(): boolean {
		return this.utilService.getPermitShowAdditionalGovIdData(
			this.isCanadianCitizen.value == BooleanTypeCode.Yes,
			this.isCanadianResident.value == BooleanTypeCode.Yes,
			this.canadianCitizenProofTypeCode.value,
			this.proofOfResidentStatusCode.value,
			this.proofOfCitizenshipCode.value
		);
	}

	get isCanadianCitizen(): FormControl {
		return this.form.get('isCanadianCitizen') as FormControl;
	}
	get canadianCitizenProofTypeCode(): FormControl {
		return this.form.get('canadianCitizenProofTypeCode') as FormControl;
	}
	get isCanadianResident(): FormControl {
		return this.form.get('isCanadianResident') as FormControl;
	}
	get proofOfResidentStatusCode(): FormControl {
		return this.form.get('proofOfResidentStatusCode') as FormControl;
	}
	get proofOfCitizenshipCode(): FormControl {
		return this.form.get('proofOfCitizenshipCode') as FormControl;
	}
	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get governmentIssuedPhotoTypeCode(): FormControl {
		return this.form.get('governmentIssuedPhotoTypeCode') as FormControl;
	}
	get governmentIssuedAttachments(): FormControl {
		return this.form.get('governmentIssuedAttachments') as FormControl;
	}
	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}

	get isCanadianCitizenYes(): boolean {
		return this.isCanadianCitizen.value === BooleanTypeCode.Yes;
	}
	get isCanadianCitizenNo(): boolean {
		return this.isCanadianCitizen.value === BooleanTypeCode.No;
	}
	get isShowFrontAndBack(): boolean {
		return (
			this.isCanadianCitizenYes &&
			(this.canadianCitizenProofTypeCode.value === LicenceDocumentTypeCode.BirthCertificate ||
				this.canadianCitizenProofTypeCode.value === LicenceDocumentTypeCode.CanadianCitizenship ||
				this.canadianCitizenProofTypeCode.value === LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen)
		);
	}
	get isShowPassportPhoto(): boolean {
		return (
			this.isCanadianCitizenYes && this.canadianCitizenProofTypeCode.value === LicenceDocumentTypeCode.CanadianPassport
		);
	}
	get isShowNonCanadianFrontAndBackAdditional(): boolean {
		return (
			this.isCanadianCitizenNo &&
			(this.governmentIssuedPhotoTypeCode.value === LicenceDocumentTypeCode.DriversLicenceAdditional ||
				this.governmentIssuedPhotoTypeCode.value === LicenceDocumentTypeCode.PermanentResidentCardAdditional ||
				this.governmentIssuedPhotoTypeCode.value === LicenceDocumentTypeCode.CertificateOfIndianStatusAdditional ||
				this.governmentIssuedPhotoTypeCode.value === LicenceDocumentTypeCode.CanadianFirearmsLicence ||
				this.governmentIssuedPhotoTypeCode.value === LicenceDocumentTypeCode.BcServicesCard)
		);
	}
}
