import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	LicenceModelSubject,
} from '../licence-application.service';

@Component({
	selector: 'app-fingerprints',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Upload proof of fingerprinting request"
					subtitle="Provide confirmation of fingerprinting request from a law enforcement agency."
				></app-step-title>
				<div class="step-container row mt-2 mb-4">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<form [formGroup]="form" novalidate>
							<p>
								Scan or take a photo of the tear-off section on page 2 of the
								<a
									href="https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/business-management/security-services/industry/legislation/licensingpolicy.pdf"
									target="_blank"
									>Request for Fingerprinting</a
								>
								form
								<mat-icon class="info-icon" matTooltip="TODO"> info </mat-icon>
							</p>
							<!-- TODO link to the form to download for reference -->
							<div class="text-minor-heading fw-normal mb-2">Upload your document:</div>
							<app-file-upload [maxNumberOfFiles]="1" [files]="proofOfFingerprintAttachments.value"></app-file-upload>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('proofOfFingerprintAttachments')?.dirty ||
										form.get('proofOfFingerprintAttachments')?.touched) &&
									form.get('proofOfFingerprintAttachments')?.invalid &&
									form.get('proofOfFingerprintAttachments')?.hasError('required')
								"
								>Your fingerprints must be taken to continue to verify your identity.<br /><br />
								Download the
								<a
									href="https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/business-management/security-services/industry/legislation/licensingpolicy.pdf"
									target="_blank"
									>Request for Fingerprinting</a
								>
								form, take it to a fingerprinting agency (such as your local police department), and complete this
								application when you have documentation.
							</mat-error>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class FingerprintsComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	form: FormGroup = this.formBuilder.group({
		proofOfFingerprintAttachments: new FormControl(null, [Validators.required]),
	});

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				if (loaded.isLoaded) {
					this.form.patchValue({
						proofOfFingerprintAttachments: this.licenceApplicationService.licenceModel.proofOfFingerprintAttachments,
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
		this.form.controls['proofOfFingerprintAttachments'].setValue(attachments);

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return this.form.value;
	}

	get proofOfFingerprintAttachments(): FormControl {
		return this.form.get('proofOfFingerprintAttachments') as FormControl;
	}
}
