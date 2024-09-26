import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import {
	BooleanTypeCode,
	GovernmentIssuedPhotoIdTypes,
	ProofOfAbilityToWorkInCanadaTypes,
	ProofOfCanadianCitizenshipTypes,
} from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-form-swl-citizenship',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row" *ngIf="isNotRenewal">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<mat-radio-group aria-label="Is a canadian citizen" formControlName="isCanadianCitizen">
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
					<mat-divider class="mb-3 mat-divider-primary" *ngIf="isNotRenewal"></mat-divider>

					<ng-container *ngIf="isCanadianCitizenYes; else notCanadianCitizenHeading">
						<div class="text-minor-heading mb-2">Proof of Canadian citizenship</div>
					</ng-container>
					<ng-template #notCanadianCitizenHeading>
						<div class="text-minor-heading mb-2">Proof of residency</div>
					</ng-template>

					<div class="row my-2">
						<div class="col-lg-7 col-md-12">
							<ng-container *ngIf="isCanadianCitizenYes; else notCanadianCitizen">
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
							</ng-container>
							<ng-template #notCanadianCitizen>
								<mat-form-field>
									<mat-label>Type of Proof</mat-label>
									<mat-select formControlName="notCanadianCitizenProofTypeCode" [errorStateMatcher]="matcher">
										<mat-option
											class="proof-option"
											*ngFor="let item of proofOfAbilityToWorkInCanadaTypes; let i = index"
											[value]="item.code"
										>
											{{ item.desc }}
										</mat-option>
									</mat-select>
									<mat-error *ngIf="form.get('notCanadianCitizenProofTypeCode')?.hasError('required')">
										This is required
									</mat-error>
								</mat-form-field>
							</ng-template>
						</div>
						<div class="col-lg-5 col-md-12" *ngIf="showExpiryDate">
							<mat-form-field>
								<mat-label>Document Expiry Date</mat-label>
								<input matInput [matDatepicker]="picker" formControlName="expiryDate" [errorStateMatcher]="matcher" />
								<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
								<mat-datepicker #picker startView="multi-year"></mat-datepicker>
								<mat-error *ngIf="form.get('expiryDate')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
					</div>

					<div
						*ngIf="
							(isCanadianCitizenYes && canadianCitizenProofTypeCode.value) ||
							(isCanadianCitizenNo && notCanadianCitizenProofTypeCode.value)
						"
						@showHideTriggerSlideAnimation
					>
						<div class="row mb-2">
							<div class="col-12">
								<ng-container *ngIf="isCanadianCitizenYes; else notCanadianCitizenTitle">
									<div class="text-minor-heading mb-2">Upload a photo of your proof of Canadian citizenship</div>
									<ng-container *ngIf="isShowFrontAndBack">
										<app-alert type="info" icon="">
											Upload a photo of the front and back of your
											{{ canadianCitizenProofTypeCode.value | options : 'ProofOfCanadianCitizenshipTypes' }}
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
									#fileUploadComponent1
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
								<div class="col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Additional Type of Proof</mat-label>
										<mat-select formControlName="governmentIssuedPhotoTypeCode" [errorStateMatcher]="matcher">
											<mat-option *ngFor="let item of governmentIssuedPhotoIdTypes; let i = index" [value]="item.code">
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
											[errorStateMatcher]="matcher"
										/>
										<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
										<mat-datepicker #picker startView="multi-year"></mat-datepicker>
										<mat-error *ngIf="form.get('governmentIssuedExpiryDate')?.hasError('required')">
											This is required
										</mat-error>
									</mat-form-field>
								</div>
							</div>
							<div class="row mb-2">
								<div class="col-12">
									<div class="text-minor-heading mb-2">Upload a photo of your ID</div>
									<ng-container *ngIf="isShowNonCanadianFrontAndBackAdditional">
										<app-alert type="info" icon="">
											Upload a photo of the front and back of your
											{{ governmentIssuedPhotoTypeCode.value | options : 'GovernmentIssuedPhotoIdTypes' }}
										</app-alert>
									</ng-container>
									<app-file-upload
										#fileUploadComponent2
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
export class FormSwlCitizenshipComponent implements LicenceChildStepperStepComponent {
	proofOfCanadianCitizenshipTypes = ProofOfCanadianCitizenshipTypes;
	proofOfAbilityToWorkInCanadaTypes = ProofOfAbilityToWorkInCanadaTypes;
	governmentIssuedPhotoIdTypes = GovernmentIssuedPhotoIdTypes;

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@Output() fileUploaded = new EventEmitter<File>();
	@Output() fileRemoved = new EventEmitter();
	@Output() fileGovernmentIssuedUploaded = new EventEmitter<File>();
	@Output() fileGovernmentIssuedRemoved = new EventEmitter();

	@ViewChild('fileUploadComponent1', { read: FileUploadComponent }) fileUploadComponent!: FileUploadComponent;
	@ViewChild('fileUploadComponent2', { read: FileUploadComponent })
	governmentIssuedFileUploadComponent!: FileUploadComponent;

	constructor(private utilService: UtilService) {}

	onFileUploaded(file: File): void {
		this.fileUploaded.emit(file);
	}

	onFileRemoved(): void {
		this.fileRemoved.emit();
	}

	onGovernmentIssuedFileUploaded(file: File): void {
		this.fileGovernmentIssuedUploaded.emit(file);
	}

	onGovernmentIssuedFileRemoved(): void {
		this.fileGovernmentIssuedRemoved.emit();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getProofTypeCode(): LicenceDocumentTypeCode {
		return this.isCanadianCitizenYes
			? this.canadianCitizenProofTypeCode.value
			: this.notCanadianCitizenProofTypeCode.value;
	}

	getGovernmentIssuedProofTypeCode(): LicenceDocumentTypeCode {
		return this.governmentIssuedPhotoTypeCode.value;
	}

	get showExpiryDate(): boolean {
		// Show expiry date when is Canadian Citizen and proof is Canadian Passport OR when NOT Canadian Citizen.
		return this.isCanadianCitizenYes
			? this.canadianCitizenProofTypeCode.value === LicenceDocumentTypeCode.CanadianPassport
			: true;
	}

	get showAdditionalGovIdData(): boolean {
		return this.utilService.getSwlShowAdditionalGovIdData(
			this.isCanadianCitizenYes,
			this.canadianCitizenProofTypeCode.value,
			this.notCanadianCitizenProofTypeCode.value
		);
	}

	get isNotRenewal(): boolean {
		return this.applicationTypeCode != ApplicationTypeCode.Renewal;
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
	get isCanadianCitizen(): FormControl {
		return this.form.get('isCanadianCitizen') as FormControl;
	}
	get canadianCitizenProofTypeCode(): FormControl {
		return this.form.get('canadianCitizenProofTypeCode') as FormControl;
	}
	get notCanadianCitizenProofTypeCode(): FormControl {
		return this.form.get('notCanadianCitizenProofTypeCode') as FormControl;
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
}
