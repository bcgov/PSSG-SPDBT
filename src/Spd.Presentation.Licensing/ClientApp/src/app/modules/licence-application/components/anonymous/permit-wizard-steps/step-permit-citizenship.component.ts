import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { HotToastService } from '@ngneat/hot-toast';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import {
	BooleanTypeCode,
	GovernmentIssuedPhotoIdTypes,
	PermitProofOfCitizenshipTypes,
	PermitProofOfResidenceStatusTypes,
	ProofOfCanadianCitizenshipTypes,
} from 'src/app/core/code-types/model-desc.models';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-permit-citizenship',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Are you a Canadian citizen?"></app-step-title>

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
								<div class="col-lg-7 col-md-12">
									<mat-form-field>
										<mat-label>Proof of Canadian citizenship</mat-label>
										<mat-select formControlName="canadianCitizenProofTypeCode" [errorStateMatcher]="matcher">
											<mat-option
												class="proof-option"
												*ngFor="let item of proofOfCanadianCitizenshipTypes"
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
								<div class="col-lg-5 col-md-12" *ngIf="showIfPassport">
									<mat-form-field>
										<mat-label>Document Expiry Date</mat-label>
										<input
											matInput
											[matDatepicker]="picker"
											formControlName="expiryDate"
											[errorStateMatcher]="matcher"
										/>
										<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
										<mat-datepicker #picker startView="multi-year"></mat-datepicker>
										<mat-error *ngIf="form.get('expiryDate')?.hasError('required')"> This is required </mat-error>
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
									<div class="col-lg-7 col-md-12">
										<ng-container *ngIf="isCanadianResident.value === booleanTypeCodes.Yes; else notResidentOfCanada">
											<mat-form-field>
												<mat-label>Proof of resident status</mat-label>
												<mat-select formControlName="proofOfResidentStatusCode" [errorStateMatcher]="matcher">
													<mat-option
														class="proof-option"
														*ngFor="let item of proofOfResidenceStatusTypes"
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
												<mat-label>Proof of citizenship</mat-label>
												<mat-select formControlName="proofOfCitizenshipCode" [errorStateMatcher]="matcher">
													<mat-option
														class="proof-option"
														*ngFor="let item of proofOfCitizenshipTypes"
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
									<div class="col-lg-5 col-md-12">
										<mat-form-field>
											<mat-label>Document Expiry Date</mat-label>
											<input
												matInput
												[matDatepicker]="picker"
												formControlName="expiryDate"
												[errorStateMatcher]="matcher"
											/>
											<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
											<mat-datepicker #picker startView="multi-year"></mat-datepicker>
											<mat-error *ngIf="form.get('expiryDate')?.hasError('required')"> This is required </mat-error>
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
										<ng-container
											*ngIf="isCanadianCitizen.value === booleanTypeCodes.Yes; else notCanadianCitizenTitle"
										>
											<div class="text-minor-heading mb-2">Upload a photo of your proof of Canadian citizenship</div>
										</ng-container>
										<ng-template #notCanadianCitizenTitle>
											<div class="text-minor-heading mb-2">Upload a photo of your selected document type</div>
										</ng-template>
										<app-file-upload
											(fileUploaded)="onFileUploaded($event)"
											(fileRemoved)="onFileRemoved()"
											[control]="attachments"
											[maxNumberOfFiles]="1"
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

							<div class="row mt-4" *ngIf="showAdditionalGovermentIdStep" @showHideTriggerSlideAnimation>
								<div class="col-12">
									<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

									<div class="text-minor-heading mb-2">Type of additional piece of government-issued photo ID</div>

									<div class="row my-2">
										<div class="col-lg-7 col-md-12">
											<mat-form-field>
												<mat-label>Type of Additional Photo ID</mat-label>
												<mat-select formControlName="governmentIssuedPhotoTypeCode" [errorStateMatcher]="matcher">
													<mat-option *ngFor="let item of governmentIssuedPhotoIdTypes" [value]="item.code">
														{{ item.desc }}
													</mat-option>
												</mat-select>
												<mat-hint>This ID can be from another country</mat-hint>
												<mat-error *ngIf="form.get('governmentIssuedPhotoTypeCode')?.hasError('required')">
													This is required
												</mat-error>
											</mat-form-field>
										</div>
										<div class="col-lg-5 col-md-12">
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
											<app-file-upload
												(fileUploaded)="onFileUploaded($event)"
												(fileRemoved)="onFileRemoved()"
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
			</div>
		</section>
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
export class StepPermitCitizenshipComponent implements LicenceChildStepperStepComponent {
	proofOfCanadianCitizenshipTypes = ProofOfCanadianCitizenshipTypes;
	proofOfResidenceStatusTypes = PermitProofOfResidenceStatusTypes;
	proofOfCitizenshipTypes = PermitProofOfCitizenshipTypes;
	governmentIssuedPhotoIdTypes = GovernmentIssuedPhotoIdTypes;

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	applicationTypeCodes = ApplicationTypeCode;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	form: FormGroup = this.permitApplicationService.citizenshipFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private authenticationService: AuthenticationService,
		private permitApplicationService: PermitApplicationService,
		private hotToastService: HotToastService
	) {}

	onFileUploaded(_file: File): void {
		// if (this.authenticationService.isLoggedIn()) {
		// 	const proofTypeCode =
		// 		this.isCanadianCitizen.value == BooleanTypeCode.Yes
		// 			? this.canadianCitizenProofTypeCode.value
		// 			: this.isCanadianResident.value;
		// 	this.permitApplicationService.addUploadDocument(proofTypeCode, file).subscribe({
		// 		next: (resp: any) => {
		// 			const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
		// 			matchingFile.documentUrlId = resp.body[0].documentUrlId;
		// 		},
		// 		error: (error: any) => {
		// 			console.log('An error occurred during file upload', error);
		// 			this.hotToastService.error('An error occurred during the file upload. Please try again.');
		// 			this.fileUploadComponent.removeFailedFile(file);
		// 		},
		// 	});
		// }
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

	get showAdditionalGovermentIdStep(): boolean {
		const canadianCitizenProofTypeCode =
			this.canadianCitizenProofTypeCode.value ?? LicenceDocumentTypeCode.CanadianPassport;
		const proofOfResidentStatusCode =
			this.proofOfResidentStatusCode.value ?? LicenceDocumentTypeCode.PermanentResidentCard;
		return (
			(this.isCanadianCitizen.value == BooleanTypeCode.Yes &&
				canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
			this.isCanadianResident.value == BooleanTypeCode.No ||
			(this.isCanadianResident.value == BooleanTypeCode.Yes &&
				proofOfResidentStatusCode != LicenceDocumentTypeCode.PermanentResidentCard)
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
	get proofOfCitizenship(): FormControl {
		return this.form.get('proofOfCitizenship') as FormControl;
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
