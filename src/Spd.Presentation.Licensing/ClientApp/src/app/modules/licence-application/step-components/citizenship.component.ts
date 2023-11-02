import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import {
	BooleanTypeCode,
	ProofOfAbilityToWorkInCanadaTypes,
	ProofOfCanadianCitizenshipTypes,
} from 'src/app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import {
	LicenceApplicationService,
	LicenceChildStepperStepComponent,
	LicenceDocumentChanged,
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
									<div class="text-minor-heading mb-2">Select proof of Canadian citizenship to upload:</div>
								</ng-container>
								<ng-template #notBornInCanadaHeading>
									<div class="text-minor-heading mb-2">Select proof of ability to work in Canada:</div>
								</ng-template>

								<ng-container>
									<div class="row my-2">
										<div class="col-lg-6 col-md-12">
											<ng-container *ngIf="isBornInCanada.value == booleanTypeCodes.Yes; else notBornInCanada">
												<mat-form-field>
													<mat-select formControlName="proofTypeCode">
														<mat-option *ngFor="let item of proofOfCanadianCitizenshipTypes" [value]="item.code">
															{{ item.desc }}
														</mat-option>
													</mat-select>
													<mat-error *ngIf="form.get('proofTypeCode')?.hasError('required')">
														This is required
													</mat-error>
												</mat-form-field>
											</ng-container>
											<ng-template #notBornInCanada>
												<mat-form-field>
													<mat-select formControlName="proofTypeCode">
														<mat-option *ngFor="let item of proofOfAbilityToWorkInCanadaTypes" [value]="item.code">
															{{ item.desc }}
														</mat-option>
													</mat-select>
													<mat-error *ngIf="form.get('proofTypeCode')?.hasError('required')">
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
													formControlName="expiryDate"
													[errorStateMatcher]="matcher"
												/>
												<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
												<mat-datepicker #picker startView="multi-year"></mat-datepicker>
												<mat-error *ngIf="form.get('expiryDate')?.hasError('required')"> This is required </mat-error>
											</mat-form-field>
										</div>
									</div>
									<div class="row mb-2">
										<div class="col-12">
											<ng-container *ngIf="isBornInCanada.value == booleanTypeCodes.Yes; else notBornInCanadaTitle">
												<div class="text-minor-heading mb-2">Upload a photo of your passport or birth certificate:</div>
											</ng-container>
											<ng-template #notBornInCanadaTitle>
												<div class="text-minor-heading mb-2">Upload a photo of your selected document type:</div>
											</ng-template>
											<app-file-upload
												(filesChanged)="onFilesChanged()"
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
export class CitizenshipComponent implements LicenceChildStepperStepComponent {
	proofOfCanadianCitizenshipTypes = ProofOfCanadianCitizenshipTypes;
	proofOfAbilityToWorkInCanadaTypes = ProofOfAbilityToWorkInCanadaTypes;

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.licenceApplicationService.citizenshipFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	onFilesChanged(): void {
		this.licenceApplicationService.hasDocumentsChanged = LicenceDocumentChanged.citizenship;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isBornInCanada(): FormControl {
		return this.form.get('isBornInCanada') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
