import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BooleanTypeCode } from 'src/app/api/models';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import {
	ProofOfAbilityToWorkInCanadaCode,
	ProofOfAbilityToWorkInCanadaTypes,
	ProofOfCanadianCitizenshipTypes,
} from 'src/app/core/code-types/model-desc.models';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	LicenceModelSubject,
} from '../licence-application.service';

@Component({
	selector: 'app-citizenship',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Were you born in Canada?"></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="isBornInCanada">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('isBornInCanada')?.dirty || form.get('isBornInCanada')?.touched) &&
										form.get('isBornInCanada')?.invalid &&
										form.get('isBornInCanada')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>

						<div class="row mt-4" *ngIf="isBornInCanada.value" @showHideTriggerSlideAnimation>
							<div class="offset-md-2 col-md-8 col-sm-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

								<ng-container *ngIf="isBornInCanada.value == booleanTypeCodes.Yes; else notBornInCanadaHeading">
									<div class="text-minor-heading mb-2">Born in Canada</div>
								</ng-container>
								<ng-template #notBornInCanadaHeading>
									<div class="text-minor-heading mb-2">Not Born in Canada</div>
								</ng-template>

								<ng-container>
									<div class="row my-2">
										<div class="col-lg-6 col-md-12">
											<ng-container *ngIf="isBornInCanada.value == booleanTypeCodes.Yes; else notBornInCanada">
												<mat-form-field>
													<mat-label>Select proof of Canadian citizenship to upload</mat-label>
													<mat-select formControlName="proofOfCitizenship">
														<mat-option *ngFor="let item of proofOfCanadianCitizenshipTypes" [value]="item.code">
															{{ item.desc }}
														</mat-option>
													</mat-select>
													<mat-error *ngIf="form.get('proofOfCitizenship')?.hasError('required')">
														This is required
													</mat-error>
												</mat-form-field>
											</ng-container>
											<ng-template #notBornInCanada>
												<mat-form-field>
													<mat-label>Select proof of ability to work in Canada</mat-label>
													<mat-select formControlName="proofOfAbility">
														<mat-option *ngFor="let item of proofOfAbilityToWorkInCanadaTypes" [value]="item.code">
															{{ item.desc }}
														</mat-option>
													</mat-select>
													<mat-error *ngIf="form.get('proofOfAbility')?.hasError('required')">
														This is required
													</mat-error>
												</mat-form-field>
											</ng-template>
										</div>
										<div class="col-lg-6 col-md-12">
											<mat-form-field>
												<mat-label>Expiry Date</mat-label>
												<input
													matInput
													[matDatepicker]="picker"
													formControlName="citizenshipDocumentExpiryDate"
													[errorStateMatcher]="matcher"
												/>
												<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
												<mat-datepicker #picker startView="multi-year"></mat-datepicker>
												<mat-error *ngIf="form.get('citizenshipDocumentExpiryDate')?.hasError('required')">
													This is required
												</mat-error>
											</mat-form-field>
										</div>
									</div>
									<div class="row mb-2">
										<div class="col-12">
											<ng-container *ngIf="isBornInCanada.value == booleanTypeCodes.Yes; else notBornInCanadaTitle">
												<div class="text-minor-heading fw-normal mb-2">
													Upload a photo of your passport or birth certificate:
												</div>
											</ng-container>
											<ng-template #notBornInCanadaTitle>
												<div class="text-minor-heading fw-normal mb-2">
													Upload a photo of your selected document type:
												</div>
											</ng-template>
											<app-file-upload
												[maxNumberOfFiles]="1"
												[files]="citizenshipDocumentPhotoAttachments.value"
											></app-file-upload>
											<mat-error
												class="mat-option-error"
												*ngIf="
													(form.get('citizenshipDocumentPhotoAttachments')?.dirty ||
														form.get('citizenshipDocumentPhotoAttachments')?.touched) &&
													form.get('citizenshipDocumentPhotoAttachments')?.invalid &&
													form.get('citizenshipDocumentPhotoAttachments')?.hasError('required')
												"
												>This is required</mat-error
											>
										</div>
									</div>
								</ng-container>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CitizenshipComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	proofOfCanadianCitizenshipTypes = ProofOfCanadianCitizenshipTypes;
	proofOfAbilityToWorkInCanadaTypes = ProofOfAbilityToWorkInCanadaTypes;

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	form: FormGroup = this.formBuilder.group(
		{
			isBornInCanada: new FormControl(null, [FormControlValidators.required]),
			proofOfCitizenship: new FormControl(),
			proofOfAbility: new FormControl(),
			citizenshipDocumentExpiryDate: new FormControl(),
			citizenshipDocumentPhotoAttachments: new FormControl(null, [Validators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'proofOfCitizenship',
					(form) => form.get('isBornInCanada')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'proofOfAbility',
					(form) => form.get('isBornInCanada')?.value == this.booleanTypeCodes.No
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'citizenshipDocumentExpiryDate',
					(form) =>
						form.get('proofOfAbility')?.value == ProofOfAbilityToWorkInCanadaCode.WorkPermit ||
						form.get('proofOfAbility')?.value == ProofOfAbilityToWorkInCanadaCode.StudyPermit
				),
			],
		}
	);

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				if (loaded.isLoaded) {
					this.form.patchValue({
						isBornInCanada: this.licenceApplicationService.licenceModel.isBornInCanada,
						proofOfCitizenship: this.licenceApplicationService.licenceModel.proofOfCitizenship,
						proofOfAbility: this.licenceApplicationService.licenceModel.proofOfAbility,
						citizenshipDocumentExpiryDate: this.licenceApplicationService.licenceModel.citizenshipDocumentExpiryDate,
						citizenshipDocumentPhotoAttachments:
							this.licenceApplicationService.licenceModel.citizenshipDocumentPhotoAttachments,
					});
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}

	isFormValid(): boolean {
		const attachments =
			this.fileUploadComponent?.files && this.fileUploadComponent?.files.length > 0
				? this.fileUploadComponent.files
				: '';
		this.form.controls['citizenshipDocumentPhotoAttachments'].setValue(attachments);

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return this.form.value;
	}

	get isBornInCanada(): FormControl {
		return this.form.get('isBornInCanada') as FormControl;
	}

	get citizenshipDocumentPhotoAttachments(): FormControl {
		return this.form.get('citizenshipDocumentPhotoAttachments') as FormControl;
	}
}
