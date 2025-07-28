import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-dt-training-school-verification',
	template: `
		<app-step-section heading="Written confirmation from the accredited school">
			<form [formGroup]="form" novalidate>
				<div class="row my-2">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="text-minor-heading mb-2">
							<p>
								Upload confirmation that the dog trainer trains dogs on behalf of the accredited or recognized school
								for the purpose of the dogs becoming guide or service dogs.
							</p>
							<p>
								This may include a letter or email from the Chief Executive Officer/Executive Director or equivalent
								confirming this.
							</p>
						</div>
						<app-file-upload
							(fileUploaded)="onFileUploaded()"
							(fileRemoved)="onFileRemoved()"
							[control]="attachments"
							[maxNumberOfFiles]="10"
							[files]="attachments.value"
							[previewImage]="true"
							ariaFileUploadLabel="Upload valid identification card from the accredited school"
						></app-file-upload>
						@if (
							(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
							form.get('attachments')?.invalid &&
							form.get('attachments')?.hasError('required')
						) {
							<mat-error>This is required</mat-error>
						}
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepDtTrainingSchoolVerificationComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.dogTrainerApplicationService.trainingSchoolVerificationFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	onFileUploaded(): void {
		this.dogTrainerApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.dogTrainerApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
