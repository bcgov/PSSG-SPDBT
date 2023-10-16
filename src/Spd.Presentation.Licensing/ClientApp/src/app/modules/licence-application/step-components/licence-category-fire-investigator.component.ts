import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-fire-investigator',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<div class="step-container">
					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-9 col-lg-12">
							<div class="text-center">
								<mat-chip-option [selectable]="false" class="mat-chip-green me-3">
									Category #{{ index }}
								</mat-chip-option>
								<span class="title" style="position: relative; top: -5px;">{{ title }}</span>
							</div>

							<mat-divider class="mt-1 mb-2"></mat-divider>

							<div class="fs-5 mb-2">Proof of experience or training required</div>

							<form [formGroup]="form" novalidate>
								<div class="alert alert-category d-flex" role="alert">
									<div>
										<div class="fs-5 mb-2">Experience:</div>
										To qualify for a Fire Investigator security worker licence, you must meet both of the following
										experience requirements:
										<ul>
											<li>
												JIBC Course in Fire Investigation from <i>Fire Cause & Origins</i> (or similar course offered by
												another organization)
											</li>
											<li>Verification Letter that you were investigating fires</li>
										</ul>
									</div>
								</div>

								<div class="my-2">
									<div class="text-minor-heading mb-2">Upload a copy of your course certificate:</div>
									<app-file-upload
										[maxNumberOfFiles]="10"
										#fireinvestigatorcertificateattachmentsRef
										[files]="fireinvestigatorcertificateattachments.value"
									></app-file-upload>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('fireinvestigatorcertificateattachments')?.dirty ||
												form.get('fireinvestigatorcertificateattachments')?.touched) &&
											form.get('fireinvestigatorcertificateattachments')?.invalid &&
											form.get('fireinvestigatorcertificateattachments')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>

								<div class="mt-3 mb-2">
									<div class="text-minor-heading mb-2">Upload a verification letter:</div>
									<app-file-upload
										[maxNumberOfFiles]="10"
										#fireinvestigatorletterattachmentsRef
										[files]="fireinvestigatorletterattachments.value"
									></app-file-upload>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('fireinvestigatorletterattachments')?.dirty ||
												form.get('fireinvestigatorletterattachments')?.touched) &&
											form.get('fireinvestigatorletterattachments')?.invalid &&
											form.get('fireinvestigatorletterattachments')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceCategoryFireInvestigatorComponent implements OnInit, LicenceFormStepComponent {
	form: FormGroup = this.licenceApplicationService.categoryFireInvestigatorFormGroup;
	title = '';

	@Input() option: string | null = null;
	@Input() index: number = 0;

	@ViewChild('fireinvestigatorcertificateattachmentsRef') fileUploadComponent3!: FileUploadComponent;
	@ViewChild('fireinvestigatorletterattachmentsRef') fileUploadComponent4!: FileUploadComponent;

	constructor(
		private formBuilder: FormBuilder,
		private optionsPipe: OptionsPipe,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		// this.form = this.formBuilder.group({
		// 	fireinvestigatorcertificateattachments: new FormControl('', [Validators.required]),
		// 	fireinvestigatorletterattachments: new FormControl('', [Validators.required]),
		// });

		this.title = this.optionsPipe.transform(this.option, 'SwlCategoryTypes');
	}

	isFormValid(): boolean {
		const attachments3 =
			this.fileUploadComponent3?.files && this.fileUploadComponent3?.files.length > 0
				? this.fileUploadComponent3.files
				: '';
		this.form.controls['fireinvestigatorcertificateattachments'].setValue(attachments3);

		const attachments4 =
			this.fileUploadComponent4?.files && this.fileUploadComponent4?.files.length > 0
				? this.fileUploadComponent4.files
				: '';
		this.form.controls['fireinvestigatorletterattachments'].setValue(attachments4);

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return { licenceCategoryFireInvestigator: { ...this.form.value } };
	}

	public get fireinvestigatorcertificateattachments(): FormControl {
		return this.form.get('fireinvestigatorcertificateattachments') as FormControl;
	}

	public get fireinvestigatorletterattachments(): FormControl {
		return this.form.get('fireinvestigatorletterattachments') as FormControl;
	}
}
