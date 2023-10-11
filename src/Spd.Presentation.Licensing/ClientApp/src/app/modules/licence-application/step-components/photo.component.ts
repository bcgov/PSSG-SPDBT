import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BooleanTypeCode } from 'src/app/api/models';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	LicenceModelSubject,
} from '../licence-application.service';

@Component({
	selector: 'app-photo',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Upload a photograph of yourself"
					subtitle="I accept using this BC Services Card photo on my license."
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
									<mat-divider class="my-2"></mat-divider>
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
							class="row mt-2"
							*ngIf="useBcServicesCardPhoto.value == booleanTypeCodes.No"
							@showHideTriggerSlideAnimation
						>
							<div class="row mb-2">
								<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
									<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
									<div class="text-minor-heading mb-2">Upload a photo of yourself:</div>

									<p>
										This will appear on your licence. It must be a passport-quality photo of your face looking straight
										at the camera, against a plain, white background. It must be from within the last year.
									</p>

									<app-alert type="warning" icon="info">
										<div>
											Uploading a photo that is dissimilar from your submitted government-issued photo ID will delay
											your application's processing time.
										</div>
									</app-alert>

									<app-file-upload
										[maxNumberOfFiles]="1"
										[files]="photoOfYourselfAttachments.value"
										[accept]="accept"
									></app-file-upload>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('photoOfYourselfAttachments')?.dirty ||
												form.get('photoOfYourselfAttachments')?.touched) &&
											form.get('photoOfYourselfAttachments')?.invalid &&
											form.get('photoOfYourselfAttachments')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>
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
export class PhotoComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	booleanTypeCodes = BooleanTypeCode;
	accept = ['.jpeg', '.jpg', '.tif', '.tiff', '.png'].join(', ');

	form: FormGroup = this.formBuilder.group(
		{
			useBcServicesCardPhoto: new FormControl(null, [FormControlValidators.required]),
			photoOfYourselfAttachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'photoOfYourselfAttachments',
					(form) => form.get('useBcServicesCardPhoto')?.value == this.booleanTypeCodes.No
				),
			],
		}
	);

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				if (loaded.isLoaded) {
					this.form.patchValue({
						useBcServicesCardPhoto: this.licenceApplicationService.licenceModel.useBcServicesCardPhoto,
						photoOfYourselfAttachments: this.licenceApplicationService.licenceModel.photoOfYourselfAttachments,
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
		this.form.controls['photoOfYourselfAttachments'].setValue(attachments);

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return this.form.value;
	}

	get useBcServicesCardPhoto(): FormControl {
		return this.form.get('useBcServicesCardPhoto') as FormControl;
	}

	get photoOfYourselfAttachments(): FormControl {
		return this.form.get('photoOfYourselfAttachments') as FormControl;
	}
}
