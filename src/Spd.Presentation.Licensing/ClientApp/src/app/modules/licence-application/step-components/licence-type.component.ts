import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwlStatusTypeCode } from 'src/app/core/code-types/model-desc.models';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-type',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="What type of Security Worker Licence are you applying for?"></app-step-title>
				<div class="step-container row">
					<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="statusTypeCode">
								<div class="row">
									<div class="col-lg-4">
										<mat-radio-button class="radio-label" [value]="statusTypeCodes.NewOrExpired">New</mat-radio-button>
									</div>
									<div class="col-lg-8">
										<app-alert type="info" icon="">
											Apply for a new licence if you've never held this type of licence, or if your exisiting licence
											has expired.
										</app-alert>
									</div>
								</div>
								<mat-divider class="mb-3"></mat-divider>
								<div class="row">
									<div class="col-lg-4">
										<mat-radio-button class="radio-label" [value]="statusTypeCodes.Renewal">Renewal</mat-radio-button>
									</div>
									<div class="col-lg-8">
										<app-alert type="info" icon="">
											Renew your existing licence before it expires, within 90 days of the expiry date.
										</app-alert>
									</div>
								</div>
								<mat-divider class="mb-3"></mat-divider>
								<div class="row">
									<div class="col-lg-4">
										<mat-radio-button class="radio-label" [value]="statusTypeCodes.Replacement">
											Replacement
										</mat-radio-button>
									</div>
									<div class="col-lg-8">
										<app-alert type="info" icon="">
											Lost your licence? Request a replacement card and we'll send you one.
										</app-alert>
									</div>
								</div>
								<mat-divider class="mb-3"></mat-divider>
								<div class="row">
									<div class="col-lg-4">
										<mat-radio-button class="radio-label" [value]="statusTypeCodes.Update">Update</mat-radio-button>
									</div>
									<div class="col-lg-8">
										<app-alert type="info" icon="">
											Update contact details, legal name, report new criminal charges or convictions, and more. Some
											updates require a processing fee.
										</app-alert>
									</div>
								</div>
							</mat-radio-group>
						</form>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('statusTypeCode')?.dirty || form.get('statusTypeCode')?.touched) &&
								form.get('statusTypeCode')?.invalid &&
								form.get('statusTypeCode')?.hasError('required')
							"
							>An option must be selected</mat-error
						>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceTypeComponent implements OnInit, LicenceFormStepComponent {
	statusTypeCodes = SwlStatusTypeCode;
	isDirtyAndInvalid = false;

	form: FormGroup = this.formBuilder.group({
		statusTypeCode: new FormControl(null, [Validators.required]),
	});

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: boolean) => {
				if (loaded) {
					this.form.patchValue({ statusTypeCode: this.licenceApplicationService.licenceModel.statusTypeCode });
				}
			},
		});
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return this.form.value;
	}
}
