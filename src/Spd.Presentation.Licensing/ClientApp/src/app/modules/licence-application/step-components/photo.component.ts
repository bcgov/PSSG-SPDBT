import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-photo',
	template: `
		<section [ngClass]="isCalledFromModal ? 'step-section-modal' : 'step-section p-3'">
			<div class="step">
				<app-step-title
					*ngIf="!isCalledFromModal"
					title="Upload a photograph of yourself"
					subtitle="I accept using this BC Services Card photo on my licence."
				></app-step-title>
				<app-step-title
					class="fs-7"
					*ngIf="isCalledFromModal"
					title="Did you want to use your BC Services Card photo on your licence?"
					subtitle="If not, you will be allowed upload a new photo."
				></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row mb-2">
							<div class="col-12 text-center">
								<img src="/assets/sample-photo.svg" />
							</div>
						</div>

						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="useBcServicesCardPhoto">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2" *ngIf="!isCalledFromModal"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('useBcServicesCardPhoto')?.dirty || form.get('useBcServicesCardPhoto')?.touched) &&
										form.get('useBcServicesCardPhoto')?.invalid &&
										form.get('useBcServicesCardPhoto')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>

						<div
							class="row my-2"
							*ngIf="useBcServicesCardPhoto.value == booleanTypeCodes.No"
							@showHideTriggerSlideAnimation
						>
							<div
								[ngClass]="isCalledFromModal ? 'col-12' : 'col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto'"
							>
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
								<div class="text-minor-heading mb-2">Upload a photo of yourself:</div>

								<p>
									This will appear on your licence. It must be a passport-quality photo of your face looking straight at
									the camera, against a plain, white background. It must be from within the last year.
								</p>

								<app-alert type="warning" icon="info" *ngIf="!isCalledFromModal">
									<div>
										Uploading a photo that is dissimilar from your submitted government-issued photo ID will delay your
										application's processing time.
									</div>
								</app-alert>

								<app-file-upload
									(fileChanged)="onFileChanged()"
									[control]="attachments"
									[maxNumberOfFiles]="1"
									[files]="attachments.value"
									[accept]="accept"
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
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class PhotoComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	accept = ['.jpeg', '.jpg', '.tif', '.tiff', '.png'].join(', ');

	form: FormGroup = this.licenceApplicationService.photographOfYourselfFormGroup;

	@Input() isCalledFromModal: boolean = false;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	onFileChanged(): void {
		//this.licenceApplicationService.hasDocumentsChanged = LicenceDocumentChanged.photographOfYourself;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get useBcServicesCardPhoto(): FormControl {
		return this.form.get('useBcServicesCardPhoto') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
