import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { LicenceApplicationService, LicenceFormStepComponent, SwlStatusTypeCode } from '../licence-application.service';

@Component({
	selector: 'app-sole-proprietor',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					[title]="title"
					subtitle="If you are a Sole
					Proprietor and need both a worker licence and a business licence, you can apply for them at the same time and
					pay only for the business licence."
				>
				</app-step-title>
				<div class="step-container row">
					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="isSoleProprietor">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
						</form>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('isSoleProprietor')?.dirty || form.get('isSoleProprietor')?.touched) &&
								form.get('isSoleProprietor')?.invalid &&
								form.get('isSoleProprietor')?.hasError('required')
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
export class SoleProprietorComponent implements OnInit, LicenceFormStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	title: string = '';

	form: FormGroup = this.formBuilder.group({
		isSoleProprietor: new FormControl(null, [Validators.required]),
	});

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: boolean) => {
				if (loaded) {
					this.title =
						this.licenceApplicationService.licenceModel.statusTypeCode == SwlStatusTypeCode.NewOrExpired
							? 'Do you also want to apply for a Sole Proprietor Security Business Licence?'
							: 'Do you also want to renew your Sole Proprietor Security Business Licence?';

					this.form.patchValue({
						isSoleProprietor: this.licenceApplicationService.licenceModel.isSoleProprietor,
					});
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
