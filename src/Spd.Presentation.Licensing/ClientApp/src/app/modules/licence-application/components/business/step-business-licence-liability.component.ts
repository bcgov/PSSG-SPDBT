import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BusinessApplicationService } from '../../services/business-application.service';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-liability',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Provide proof of insurance"
					subtitle="Provide <a class='large' href='https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/businesses/apply'>proof of insurance</a> that indicates the term, dates of coverage, name of business, and at least $1,000,000 general liability"
				></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
							<div class="text-minor-heading mb-2">Upload proof of insurance</div>
							<div>The insurance document must also include:</div>
							<ul>
								<li>The business name</li>
								<li>The business locations</li>
								<li>The expiry date of the insurance</li>
								<li>Proof that insurance is valid in B.C.</li>
							</ul>

							<app-file-upload
								(fileUploaded)="onFileUploaded($event)"
								(fileRemoved)="onFileRemoved()"
								[control]="attachments"
								[maxNumberOfFiles]="10"
								[files]="attachments.value"
								[previewImage]="true"
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
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceLiabilityComponent implements LicenceChildStepperStepComponent {
	form = this.businessApplicationService.companyBrandingFormGroup;

	constructor(private businessApplicationService: BusinessApplicationService, private domSanitizer: DomSanitizer) {}

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
		// this.permitApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
