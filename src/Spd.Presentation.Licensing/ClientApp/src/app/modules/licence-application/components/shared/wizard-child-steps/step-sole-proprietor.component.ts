import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from 'src/app/api/models';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '../../../services/licence-application.helper';
import { LicenceApplicationService } from '../../../services/licence-application.service';

@Component({
	selector: 'app-step-sole-proprietor',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title [title]="title" [subtitle]="infoTitle"> </app-step-title>

				<div class="row">
					<div class="col-md-8 col-sm-12 mx-auto">
						<app-alert type="warning">
							If you want to apply for both at the same time, you will need your
							<a
								class="large"
								href="https://www.bceid.ca/register/business/getting_started/getting_started.aspx"
								target="_blank"
								>Business BCeID</a
							>
						</app-alert>
					</div>
				</div>

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
export class StepSoleProprietorComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	title = 'Do you also want a Sole Proprietor Security Business Licence?';
	infoTitle = '';

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	readonly title_new = 'Do you also want to apply for a Sole Proprietor Security Business Licence?';
	readonly subtitle_new =
		'If you are a sole proprietor, you need both a security worker licence and a security business licence. If you apply for them together, the fee for the worker licence will be waived.';

	readonly title_renew = 'Do you also want to renew your Sole Proprietor Security Business Licence?';
	readonly subtitle_renew =
		'If you renew both your security worker licence and security business licence together, the fee for the worker licence will be waived.';

	form: FormGroup = this.licenceApplicationService.soleProprietorFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.title = this.title_new;
				this.infoTitle = this.subtitle_new;
				break;
			}
			case ApplicationTypeCode.Renewal: {
				this.title = this.title_renew;
				this.infoTitle = this.subtitle_renew;
				break;
			}
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
