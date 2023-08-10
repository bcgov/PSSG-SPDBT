import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-photo',
	template: `
		<div class="step">
			<app-step-title
				title="Upload a photograph of yourself"
				subtitle="This will appear on your licence. It must be a passport-quality photo of your face looking straight at the camera, against a plain, white background. It must be from within the last year."
			></app-step-title>
			<div class="step-container row">
				<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="text-minor-heading fw-normal mb-2">Upload photo</div>
						<app-file-upload [maxNumberOfFiles]="1" accept=".jpg,.tif,.png,.bmp"></app-file-upload>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('photoOfYourself')?.dirty || form.get('photoOfYourself')?.touched) &&
								form.get('photoOfYourself')?.invalid &&
								form.get('photoOfYourself')?.hasError('required')
							"
							>This is required</mat-error
						>
						<div class="field-hint mt-2">Maximum file size is 25 MB</div>
						<div class="field-hint">Format must be .jpg, .tif, .png, or .bmp</div>
					</form>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class PhotoComponent {
	form: FormGroup = this.formBuilder.group({
		photoOfYourself: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
