import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-fingerprints',
	template: `
		<div class="step">
			<app-step-title
				title="Upload proof of fingerprints"
				subtitle="Provide confirmation of fingerprinting request from a law enforcement agency."
			></app-step-title>
			<div class="step-container row">
				<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="text-minor-heading fw-normal mb-2">Upload your document</div>
						<app-file-upload [maxNumberOfFiles]="1" accept=".jpg,.tif,.png,.bmp"></app-file-upload>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('proofOfFingerprint')?.dirty || form.get('proofOfFingerprint')?.touched) &&
								form.get('proofOfFingerprint')?.invalid &&
								form.get('proofOfFingerprint')?.hasError('required')
							"
							>This is required</mat-error
						>
						<div class="mt-2">Maximum file size is 25 MB</div>
						<div>Format must be .jpg, .tif, .png, or .bmp</div>
					</form>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class FingerprintsComponent {
	form: FormGroup = this.formBuilder.group({
		proofOfFingerprint: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
