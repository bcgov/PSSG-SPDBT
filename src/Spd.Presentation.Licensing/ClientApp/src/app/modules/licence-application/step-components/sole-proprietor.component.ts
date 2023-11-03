import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { LicenceApplicationService, LicenceChildStepperStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-sole-proprietor',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title [title]="title" [subtitle]="infoTitle"> </app-step-title>

				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="isSoleProprietor">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('isSoleProprietor')?.dirty || form.get('isSoleProprietor')?.touched) &&
										form.get('isSoleProprietor')?.invalid &&
										form.get('isSoleProprietor')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class SoleProprietorComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	title = '';
	infoTitle = '';

	readonly title_apply = 'Do you also want to apply for a Sole Proprietor Security Business Licence?';
	readonly subtitle_apply =
		'If you are a sole proprietor, you need both a security worker licence and a security business licence. If you apply for them together, the fee for the worker licence will be waived.';

	form: FormGroup = this.licenceApplicationService.soleProprietorFormGroup;

	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.title_apply;
		this.infoTitle = this.subtitle_apply;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
