import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
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
			@if (showFullCitizenshipQuestion) {
				<div class="row">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<mat-radio-group aria-label="Is a canadian citizen" formControlName="isCanadianCitizen">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-divider class="my-2"></mat-divider>
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</mat-radio-group>
						@if (
							(form.get('isCanadianCitizen')?.dirty || form.get('isCanadianCitizen')?.touched) &&
							form.get('isCanadianCitizen')?.invalid &&
							form.get('isCanadianCitizen')?.hasError('required')
						) {
							<mat-error class="mat-option-error">This is required</mat-error>
						}
					</div>
				</div>
			}

			@if (isCanadianCitizen.value) {
				<div class="row mt-4" @showHideTriggerSlideAnimation>
					<div class="offset-md-2 col-md-8 col-sm-12">
						@if (showFullCitizenshipQuestion) {
							<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
						}
						@if (isCanadianCitizenYes) {
							<div class="text-minor-heading mb-2">Proof of Canadian citizenship</div>
						} @else {
							<div class="text-minor-heading mb-2">Proof of residency</div>
						}
						<div class="row my-2">
							<div class="col-md-12" [ngClass]="showExpiryDate ? 'col-lg-12' : 'col-lg-6'">
								@if (isCanadianCitizenYes) {
									<mat-form-field>
										<mat-label>Type of Proof</mat-label>
										<mat-select
											formControlName="canadianCitizenProofTypeCode"
											(selectionChange)="onChangeProof($event)"
											[errorStateMatcher]="matcher"
										>
											@for (item of proofOfCanadianCitizenshipTypes; track item; let i = $index) {
												<mat-option class="proof-option" [value]="item.code">
													{{ item.desc }}
												</mat-option>
											}
										</mat-select>
										@if (form.get('canadianCitizenProofTypeCode')?.hasError('required')) {
											<mat-error>This is required</mat-error>
										}
									</mat-form-field>
								} @else {
									<mat-form-field>
										<mat-label>Type of Proof</mat-label>
										<mat-select
											formControlName="notCanadianCitizenProofTypeCode"
											(selectionChange)="onChangeProof($event)"
											[errorStateMatcher]="matcher"
										>
											@for (item of proofOfAbilityToWorkInCanadaTypes; track item; let i = $index) {
												<mat-option class="proof-option" [value]="item.code">
													{{ item.desc }}
												</mat-option>
											}
										</mat-select>
										@if (form.get('notCanadianCitizenProofTypeCode')?.hasError('required')) {
											<mat-error>This is required</mat-error>
										}
									</mat-form-field>
								}
							</div>
							@if (showExpiryDate) {
								<div class="col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Document Expiry Date</mat-label>
										<input
											matInput
											[matDatepicker]="picker1"
											formControlName="expiryDate"
											[min]="minDate"
											[errorStateMatcher]="matcher"
										/>
										<mat-datepicker-toggle matIconSuffix [for]="picker1"></mat-datepicker-toggle>
										<mat-datepicker #picker1 startView="multi-year"></mat-datepicker>
										@if (form.get('expiryDate')?.hasError('required')) {
											<mat-error>This is required</mat-error>
										}
										@if (form.get('expiryDate')?.hasError('matDatepickerMin')) {
											<mat-error>Invalid expiry date</mat-error>
										}
									</mat-form-field>
								</div>
							}
							<div class="col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Document ID</mat-label>
									<input matInput formControlName="documentIdNumber" maxlength="30" />
								</mat-form-field>
							</div>
						</div>
						@if (
							(isCanadianCitizenYes && canadianCitizenProofTypeCode.value) ||
							(isCanadianCitizenNo && notCanadianCitizenProofTypeCode.value)
						) {
							<div @showHideTriggerSlideAnimation>
								<div class="row mb-2">
									<div class="col-12">
										@if (isCanadianCitizenYes) {
											<div class="text-minor-heading mb-2">Upload a photo of your proof of Canadian citizenship</div>
											@if (isShowFrontAndBack) {
												<app-alert type="info" icon="">
													Upload a photo of the front and back of your
													{{ canadianCitizenProofTypeCode.value | options: 'ProofOfCanadianCitizenshipTypes' }}.
												</app-alert>
											}
											@if (isShowPassportPhoto) {
												<app-alert type="info" icon="info">
													Upload a copy of the photo page of your passport.</app-alert
												>
											}
										} @else {
											<div class="text-minor-heading mb-2">Upload a photo of your selected document type</div>
										}
										<app-file-upload
											#fileUploadComponent1
											(fileUploaded)="onFileUploaded($event)"
											(fileRemoved)="onFileRemoved()"
											[control]="attachments"
											[maxNumberOfFiles]="10"
											[files]="attachments.value"
										></app-file-upload>
										@if (
											(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
											form.get('attachments')?.invalid &&
											form.get('attachments')?.hasError('required')
										) {
											<mat-error class="mat-option-error">This is required</mat-error>
										}
									</div>
								</div>
							</div>
						}
						@if (showAdditionalGovIdData) {
							<div class="row mt-4" @showHideTriggerSlideAnimation>
								<div class="col-12">
									<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
									<div class="text-minor-heading mb-2">Type of additional piece of government-issued photo ID</div>
									<div class="row my-2">
										<div class="col-lg-12 col-md-12">
											<mat-form-field>
												<mat-label>Additional Type of Proof</mat-label>
												<mat-select
													formControlName="governmentIssuedPhotoTypeCode"
													(selectionChange)="onChangeGovernmentIssuedProof($event)"
													[errorStateMatcher]="matcher"
												>
													@for (item of governmentIssuedPhotoIdTypes; track item; let i = $index) {
														<mat-option [value]="item.code">
															{{ item.desc }}
														</mat-option>
													}
												</mat-select>
												<mat-hint>This ID can be from another country</mat-hint>
												@if (form.get('governmentIssuedPhotoTypeCode')?.hasError('required')) {
													<mat-error>This is required</mat-error>
												}
											</mat-form-field>
										</div>
										<div class="col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Document Expiry Date</mat-label>
												<input
													matInput
													[matDatepicker]="picker2"
													formControlName="governmentIssuedExpiryDate"
													[min]="minDate"
													[errorStateMatcher]="matcher"
												/>
												<mat-datepicker-toggle matIconSuffix [for]="picker2"></mat-datepicker-toggle>
												<mat-datepicker #picker2 startView="multi-year"></mat-datepicker>
												@if (form.get('governmentIssuedExpiryDate')?.hasError('required')) {
													<mat-error>This is required</mat-error>
												}
												@if (form.get('governmentIssuedExpiryDate')?.hasError('matDatepickerMin')) {
													<mat-error>Invalid expiry date</mat-error>
												}
											</mat-form-field>
										</div>
										<div class="col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Document ID</mat-label>
												<input matInput formControlName="governmentIssuedDocumentIdNumber" maxlength="30" />
											</mat-form-field>
										</div>
									</div>
									<div class="row mb-2">
										<div class="col-12">
											<div class="text-minor-heading mb-2">Upload a photo of your ID</div>
											@if (isShowNonCanadianFrontAndBackAdditional) {
												<app-alert type="info" icon="">
													Upload a photo of the front and back of your
													{{ governmentIssuedPhotoTypeCode.value | options: 'GovernmentIssuedPhotoIdTypes' }}.
												</app-alert>
											}
											<app-file-upload
												#fileUploadComponent2
												(fileUploaded)="onGovernmentIssuedFileUploaded($event)"
												(fileRemoved)="onGovernmentIssuedFileRemoved()"
												[maxNumberOfFiles]="10"
												[control]="governmentIssuedAttachments"
												[files]="governmentIssuedAttachments.value"
											></app-file-upload>
											@if (
												(form.get('governmentIssuedAttachments')?.dirty ||
													form.get('governmentIssuedAttachments')?.touched) &&
												form.get('governmentIssuedAttachments')?.invalid &&
												form.get('governmentIssuedAttachments')?.hasError('required')
											) {
												<mat-error class="mat-option-error">This is required</mat-error>
											}
										</div>
									</div>
								</div>
							</div>
						}
					</div>
				</div>
			}
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
	standalone: false,
})
export class FormSwlCitizenshipComponent implements LicenceChildStepperStepComponent {
	proofOfCanadianCitizenshipTypes = ProofOfCanadianCitizenshipTypes;
	proofOfAbilityToWorkInCanadaTypes = ProofOfAbilityToWorkInCanadaTypes;
	governmentIssuedPhotoIdTypes = GovernmentIssuedPhotoIdTypes;

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();
	minDate = this.utilService.getDateMin();

	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() showFullCitizenshipQuestion = true;

	@Output() fileUploaded = new EventEmitter<File>();
	@Output() fileRemoved = new EventEmitter();
	@Output() filesCleared = new EventEmitter();
	@Output() fileGovernmentIssuedUploaded = new EventEmitter<File>();
	@Output() fileGovernmentIssuedRemoved = new EventEmitter();
	@Output() filesGovernmentIssuedCleared = new EventEmitter();

	@ViewChild('fileUploadComponent1', { read: FileUploadComponent }) fileUploadComponent!: FileUploadComponent;
	@ViewChild('fileUploadComponent2', { read: FileUploadComponent })
	governmentIssuedFileUploadComponent!: FileUploadComponent;

	constructor(private utilService: UtilService) {}

	onChangeProof(_event: MatSelectChange): void {
		this.filesCleared.emit();
	}

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

	onChangeGovernmentIssuedProof(_event: MatSelectChange): void {
		this.filesGovernmentIssuedCleared.emit();
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
