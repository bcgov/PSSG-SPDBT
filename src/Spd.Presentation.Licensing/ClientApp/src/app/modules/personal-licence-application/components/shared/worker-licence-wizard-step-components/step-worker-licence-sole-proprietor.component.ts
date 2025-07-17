import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, BizTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-sole-proprietor',
	template: `
		<app-step-section [heading]="title" [subheading]="infoTitle">
			<div class="row">
				<div class="col-md-8 col-sm-12 mx-auto">
					<app-alert type="warning">
						If you want to apply for both at the same time, you will need your
						<a
							aria-label="Navigate to getting start with BCeid site"
							class="large"
							[href]="bceidGettingStartedUrl"
							target="_blank"
							>Business BCeID</a
						>.
					</app-alert>
				</div>
			</div>

			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<mat-radio-group aria-label="Select an option" formControlName="isSoleProprietor">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-divider class="my-2"></mat-divider>
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</mat-radio-group>
						@if (
							(form.get('isSoleProprietor')?.dirty || form.get('isSoleProprietor')?.touched) &&
							form.get('isSoleProprietor')?.invalid &&
							form.get('isSoleProprietor')?.hasError('required')
						) {
							<mat-error class="mat-option-error">This is required</mat-error>
						}
					</div>
				</div>

				@if (isSoleProprietor.value === booleanTypeCodes.Yes) {
					<div class="row my-4">
						<div class="col-xxl-5 col-xl-6 col-lg-8 col-md-12 mx-auto">
							<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
							<div class="text-minor-heading my-2">What is the type of business or company?</div>
							<mat-radio-group aria-label="Select an option" formControlName="bizTypeCode">
								<mat-radio-button class="radio-label" [value]="bizTypeCodes.NonRegisteredSoleProprietor"
									>Non-Registered Sole Proprietor</mat-radio-button
								>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="bizTypeCodes.RegisteredSoleProprietor"
									>Registered Sole Proprietor</mat-radio-button
								>
							</mat-radio-group>
							@if (
								(form.get('bizTypeCode')?.dirty || form.get('bizTypeCode')?.touched) &&
								form.get('bizTypeCode')?.invalid &&
								form.get('bizTypeCode')?.hasError('required')
							) {
								<mat-error class="mat-option-error">This is required</mat-error>
							}
						</div>
					</div>
				}
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepWorkerLicenceSoleProprietorComponent implements OnInit, LicenceChildStepperStepComponent {
	bceidGettingStartedUrl = SPD_CONSTANTS.urls.bceidGettingStartedUrl;

	booleanTypeCodes = BooleanTypeCode;
	bizTypeCodes = BizTypeCode;
	title = '';
	infoTitle = '';

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	readonly title_new = 'Do you also want to apply for a Sole Proprietor Security Business Licence?';
	readonly subtitle_new =
		'If you are a sole proprietor, you need both a security worker licence and a security business licence. If you apply for them together, the fee for the worker licence will be waived.';

	readonly title_renew = 'Do you also want to renew your Sole Proprietor Security Business Licence?';
	readonly subtitle_renew =
		'If you renew both your security worker licence and security business licence together, the fee for the worker licence will be waived.';

	form: FormGroup = this.workerApplicationService.soleProprietorFormGroup;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				this.title = this.title_renew;
				this.infoTitle = this.subtitle_renew;
				break;
			}
			default: {
				this.title = this.title_new;
				this.infoTitle = this.subtitle_new;
				break;
			}
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isSoleProprietor(): FormControl {
		return this.form.get('isSoleProprietor') as FormControl;
	}
}
