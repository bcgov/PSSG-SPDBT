import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-security-consultant',
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

							<div class="fs-5 mb-2">Proof of experience required</div>

							<form [formGroup]="form" novalidate>
								<div class="alert alert-category d-flex" role="alert">
									<div>
										To qualify for a security consultant security worker licence, you must be able to provide advice and
										expertise in a number of specialized areas, including but not limited to:
										<ul>
											<li>Security alarms</li>
											<li>Closed circuit television</li>
											<li>Access controls</li>
											<li>Loss prevention surveys</li>
											<li>Physical security design</li>
											<li>Lighting and building design installation</li>
											<li>Insurance</li>
											<li>Electronic counter measures</li>
											<li>Tool marks</li>
											<li>Fingerprinting</li>
										</ul>

										You must provide proof of two years experience within the past five years in full-time employment
										providing any of the above-mentioned services.
									</div>
								</div>

								<div class="text-minor-heading mb-2">Upload your resume:</div>

								<div class="my-2">
									<app-file-upload [maxNumberOfFiles]="10" #resumeattachments></app-file-upload>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('resumeattachments')?.dirty || form.get('resumeattachments')?.touched) &&
											form.get('resumeattachments')?.invalid &&
											form.get('resumeattachments')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>

								<div class="alert alert-category d-flex" role="alert">
									<div>
										You must meet the following experience requirements:
										<mat-radio-group
											class="category-radio-group"
											aria-label="Select an option"
											formControlName="requirement"
										>
											<mat-radio-button class="radio-label" value="a">
												Written reference letters from previous employers (must be on company letterhead, dated and
												signed)
											</mat-radio-button>
											<mat-divider class="my-2"></mat-divider>
											<mat-radio-button class="radio-label" value="b">
												Clients verifying your experience
											</mat-radio-button>
										</mat-radio-group>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('requirement')?.dirty || form.get('requirement')?.touched) &&
												form.get('requirement')?.invalid &&
												form.get('requirement')?.hasError('required')
											"
											>An option must be selected</mat-error
										>
									</div>
								</div>

								<ng-container *ngIf="requirement.value">
									<div class="text-minor-heading mb-2">
										<span *ngIf="requirement.value == 'a'">Upload reference letters:</span>
										<span *ngIf="requirement.value == 'b'"> Upload recommendation letters: </span>
									</div>

									<div class="my-2">
										<app-file-upload [maxNumberOfFiles]="10" #attachments></app-file-upload>
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
								</ng-container>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceCategorySecurityConsultantComponent implements OnInit, LicenceFormStepComponent {
	form!: FormGroup;
	title = '';

	@Input() option: SelectOptions | null = null;
	@Input() index: number = 0;

	@ViewChild('resumeattachments') fileUploadComponent1!: FileUploadComponent;
	@ViewChild('attachments') fileUploadComponent2!: FileUploadComponent;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			requirement: new FormControl(null, [FormControlValidators.required]),
			resumeattachments: new FormControl('', [Validators.required]),
			attachments: new FormControl('', [Validators.required]),
		});

		this.title = `${this.option?.desc ?? ''}`;
	}

	isFormValid(): boolean {
		const attachments1 =
			this.fileUploadComponent1?.files && this.fileUploadComponent1?.files.length > 0
				? this.fileUploadComponent1.files
				: '';
		this.form.controls['resumeattachments'].setValue(attachments1);

		const attachments2 =
			this.fileUploadComponent2?.files && this.fileUploadComponent2?.files.length > 0
				? this.fileUploadComponent2.files
				: '';
		this.form.controls['attachments'].setValue(attachments2);

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return { licenceCategorySecurityConsultant: { ...this.form.value } };
	}

	public get requirement(): FormControl {
		return this.form.get('requirement') as FormControl;
	}
}
