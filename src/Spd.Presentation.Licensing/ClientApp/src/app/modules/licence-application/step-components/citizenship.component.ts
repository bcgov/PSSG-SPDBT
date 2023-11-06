import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import {
	BooleanTypeCode,
	ProofOfAbilityToWorkInCanadaTypes,
	ProofOfCanadianCitizenshipTypes,
} from 'src/app/core/code-types/model-desc.models';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-citizenship',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Are you a Canadian citizen?"></app-step-title>
				<div class="step-container">
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

								<ng-container *ngIf="isCanadianCitizen.value == booleanTypeCodes.Yes; else notCanadianCitizenHeading">
									<div class="text-minor-heading mb-2">Select proof of Canadian citizenship to upload:</div>
								</ng-container>
								<ng-template #notCanadianCitizenHeading>
									<div class="text-minor-heading mb-2">Select proof of ability to work in Canada:</div>
								</ng-template>

								<ng-container>
									<div class="row my-2">
										<div class="col-lg-6 col-md-12">
											<ng-container *ngIf="isCanadianCitizen.value == booleanTypeCodes.Yes; else notCanadianCitizen">
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
											<ng-template #notCanadianCitizen>
												<mat-form-field>
													<mat-select formControlName="proofTypeCode" [errorStateMatcher]="matcher">
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
											<ng-container
												*ngIf="isCanadianCitizen.value == booleanTypeCodes.Yes; else notCanadianCitizenTitle"
											>
												<div class="text-minor-heading mb-2">Upload a photo of your proof of Canadian citizenship:</div>
											</ng-container>
											<ng-template #notCanadianCitizenTitle>
												<div class="text-minor-heading mb-2">Upload a photo of your selected document type:</div>
											</ng-template>
											<app-file-upload
												(fileAdded)="onFileAdded($event)"
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

	constructor(
		private authenticationService: AuthenticationService,
		private licenceApplicationService: LicenceApplicationService,
		private hotToastService: HotToastService
	) {}

	onFileAdded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
			this.licenceApplicationService.addUploadDocument(this.proofTypeCode.value, file).subscribe({
				next: (resp: any) => {
					const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
					matchingFile.documentUrlId = resp.body[0].documentUrlId;
				},
				error: (error: any) => {
					console.log('An error occurred during file upload', error);
					this.hotToastService.error('An error occurred during the file upload. Please try again.');
				},
			});
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isCanadianCitizen(): FormControl {
		return this.form.get('isCanadianCitizen') as FormControl;
	}

	get proofTypeCode(): FormControl {
		return this.form.get('proofTypeCode') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
