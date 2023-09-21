import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-armoured-car-guard',
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

							<mat-divider class="mt-1 mb-4"></mat-divider>

							<div class="fs-5 fw-semibold mb-4">Authorization to Carry Certificate required</div>
							<p>
								Armoured car guards carry firearms, which requires a firearm licence and an Authorization to Carry (ATC)
								certificate. You must get this licence and ATC before you can apply to be an armoured car guard. More
								information is available from the
								<a href="https://www.rcmp-grc.gc.ca/en/firearms/authorization-carry" target="_blank">RCMP</a>.
							</p>

							<form [formGroup]="form" novalidate>
								<div class="text-minor-heading fw-semibold mb-2" *ngIf="requirement.value == 'b'; else uploadcopy">
									Upload your valid Authorization to Carry certificate:
								</div>
								<ng-template #uploadcopy>
									<div class="text-minor-heading fw-semibold mb-2">Upload a copy of your certificate:</div>
								</ng-template>
								<div class="my-4">
									<app-file-upload [maxNumberOfFiles]="10"></app-file-upload>
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
								<p>Accepted file formats: docx, doc, pdf, bmp, jpeg, jpg, tif, tiff, png, gif, html, htm</p>
								<p>File size maximum: 25MB per file</p>

								<div class="row">
									<div class="col-lg-4 col-md-12 col-sm-12">
										<mat-form-field>
											<mat-label>Document Expiry Date</mat-label>
											<input
												matInput
												[matDatepicker]="picker"
												formControlName="documentExpiryDate"
												[errorStateMatcher]="matcher"
											/>
											<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
											<mat-datepicker #picker startView="multi-year"></mat-datepicker>
											<mat-error *ngIf="form.get('documentExpiryDate')?.hasError('required')"
												>This is required</mat-error
											>
										</mat-form-field>
									</div>
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
export class LicenceCategoryArmouredCarGuardComponent implements OnInit, LicenceFormStepComponent {
	form!: FormGroup;
	title = '';

	matcher = new FormErrorStateMatcher();

	@Input() option: SelectOptions | null = null;
	@Input() index: number = 0;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			requirement: new FormControl(null, [Validators.required]),
			documentExpiryDate: new FormControl(null, [Validators.required]),
			attachments: new FormControl('', [Validators.required]),
		});

		this.title = `${this.option?.desc ?? ''}`;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}

	getDataToSave(): any {
		return { licenceCategoryArmouredCarGuard: { ...this.form.value } };
	}

	public get requirement(): FormControl {
		return this.form.get('requirement') as FormControl;
	}
}
