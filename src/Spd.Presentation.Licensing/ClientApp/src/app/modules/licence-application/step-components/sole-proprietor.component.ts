import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BooleanTypeCode } from 'src/app/api/models';
import { SwlApplicationTypeCode } from 'src/app/core/code-types/model-desc.models';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-sole-proprietor',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title [title]="title" [info]="infoTitle"> </app-step-title>

				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
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
									>An option must be selected</mat-error
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
export class SoleProprietorComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	booleanTypeCodes = BooleanTypeCode;
	title = '';
	infoTitle = '';

	readonly title_apply = 'Do you also want to apply for a Sole Proprietor Security Business Licence?';
	readonly title_renew = 'Do you also want to renew your Sole Proprietor Security Business Licence?';
	readonly subtitle_apply =
		'<p>If you are a Sole Proprietor and need both a worker licence and a business licence, you can apply for them at the same time and pay only for the business licence.</p> <p>First, apply for the worker licence. When you receive it, you can then apply for the business licence. Your security worker licence fee will be refunded at that point.</p>';
	readonly subtitle_renew =
		'<p>If you are a sole proprietor, you need both a security worker licence and a security business licence.</p> <p>First, renew your worker licence. When you receive it, you can then renew the business licence. Your security worker licence fee will be refunded at that point.</p>';

	form: FormGroup = this.formBuilder.group({
		isSoleProprietor: new FormControl('', [FormControlValidators.required]),
	});

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: boolean) => {
				if (loaded) {
					// TODO Review question would only apply to those who have a SWL w/ Sole Prop already,
					// otherwise they would see the same question shown to New applicants

					const isNewOrExpired =
						this.licenceApplicationService.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired;
					this.title = isNewOrExpired ? this.title_apply : this.title_renew;
					this.infoTitle = isNewOrExpired ? this.subtitle_apply : this.subtitle_renew;

					this.form.patchValue({
						isSoleProprietor: this.licenceApplicationService.licenceModel.isSoleProprietor,
					});
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return this.form.value;
	}
}
