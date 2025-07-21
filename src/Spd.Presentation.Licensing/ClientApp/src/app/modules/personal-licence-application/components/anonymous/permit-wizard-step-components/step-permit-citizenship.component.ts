import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import {
	BooleanTypeCode,
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
		<app-step-section [heading]="title" [subheading]="subtitle">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<mat-radio-group aria-label="Select an option" formControlName="isCanadianCitizen">
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

				@if (isCanadianCitizen.value) {
					<div class="row mt-4" @showHideTriggerSlideAnimation>
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
							@if (isCanadianCitizen.value === booleanTypeCodes.Yes) {
								<div class="text-minor-heading mb-2">Proof of Canadian citizenship</div>
							} @else {
								<div class="text-minor-heading mb-2">Proof of residency</div>
							}
							@if (isCanadianCitizen.value === booleanTypeCodes.Yes) {
								<div class="row my-2">
									<div class="col-md-12" [ngClass]="showIfPassport ? 'col-lg-12' : 'col-lg-6'">
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
									</div>
									@if (showIfPassport) {
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
							} @else {
								<div class="row my-2">
									<div class="col-lg-7 col-md-12">
										<mat-radio-group aria-label="Select an option" formControlName="isCanadianResident">
											<mat-radio-button [value]="booleanTypeCodes.Yes">I am a resident of Canada</mat-radio-button>
											<mat-radio-button [value]="booleanTypeCodes.No">I am not a Canadian resident</mat-radio-button>
										</mat-radio-group>
										@if (
											(form.get('isCanadianResident')?.dirty || form.get('isCanadianResident')?.touched) &&
											form.get('isCanadianResident')?.invalid &&
											form.get('isCanadianResident')?.hasError('required')
										) {
											<mat-error class="mat-option-error">This is required</mat-error>
										}
									</div>
								</div>
							}
							@if (isCanadianCitizen.value === booleanTypeCodes.No && isCanadianResident.value) {
								<div class="row my-2">
									<div class="col-lg-12 col-md-12">
										@if (isCanadianResident.value === booleanTypeCodes.Yes) {
											<mat-form-field>
												<mat-label>Proof of Resident Status</mat-label>
												<mat-select
													formControlName="proofOfResidentStatusCode"
													(selectionChange)="onChangeProof($event)"
													[errorStateMatcher]="matcher"
												>
													@for (item of proofOfResidenceStatusTypes; track item; let i = $index) {
														<mat-option class="proof-option" [value]="item.code">
															{{ item.desc }}
														</mat-option>
													}
												</mat-select>
												@if (form.get('proofOfResidentStatusCode')?.hasError('required')) {
													<mat-error>This is required</mat-error>
												}
											</mat-form-field>
										} @else {
											<mat-form-field>
												<mat-label>Proof of Citizenship</mat-label>
												<mat-select
													formControlName="proofOfCitizenshipCode"
													(selectionChange)="onChangeProof($event)"
													[errorStateMatcher]="matcher"
												>
													@for (item of proofOfCitizenshipTypes; track item; let i = $index) {
														<mat-option class="proof-option" [value]="item.code">
															{{ item.desc }}
														</mat-option>
													}
												</mat-select>
												@if (form.get('proofOfCitizenshipCode')?.hasError('required')) {
													<mat-error>This is required</mat-error>
												}
											</mat-form-field>
										}
									</div>
									<div class="col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Document Expiry Date</mat-label>
											<input
												matInput
												[matDatepicker]="picker2"
												formControlName="expiryDate"
												[min]="minDate"
												[errorStateMatcher]="matcher"
											/>
											<mat-datepicker-toggle matIconSuffix [for]="picker2"></mat-datepicker-toggle>
											<mat-datepicker #picker2 startView="multi-year"></mat-datepicker>
											@if (form.get('expiryDate')?.hasError('required')) {
												<mat-error>This is required</mat-error>
											}
											@if (form.get('expiryDate')?.hasError('matDatepickerMin')) {
												<mat-error>Invalid expiry date</mat-error>
											}
										</mat-form-field>
									</div>
									<div class="col-lg-6 col-md-12">
										<mat-form-field>
											<mat-label>Document ID</mat-label>
											<input matInput formControlName="documentIdNumber" maxlength="30" />
										</mat-form-field>
									</div>
								</div>
							}
							@if (isCanadianCitizen.value === booleanTypeCodes.Yes || isCanadianResident.value) {
								<div @showHideTriggerSlideAnimation>
									<div class="row mb-2">
										<div class="col-12">
											@if (isCanadianCitizenYes) {
												<div class="text-minor-heading mb-2">Upload your Canadian citizenship document</div>
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
						</div>
					</div>
				}
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
	standalone: false,
})
export class StepPermitCitizenshipComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	proofOfCanadianCitizenshipTypes = ProofOfCanadianCitizenshipTypes;
	proofOfResidenceStatusTypes = PermitProofOfResidenceStatusTypes;
	proofOfCitizenshipTypes = PermitProofOfCitizenshipTypes;

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

	onChangeProof(_event: MatSelectChange): void {
		this.permitApplicationService.hasValueChanged = true;
		this.attachments.setValue([]);
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

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get showIfPassport(): boolean {
		return this.canadianCitizenProofTypeCode.value === LicenceDocumentTypeCode.CanadianPassport;
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
}
