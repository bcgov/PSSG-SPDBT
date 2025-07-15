import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-rd-dog-living-info',
	template: `
		<app-step-section heading="Will your dog continue to live with you in his/her retirement?">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<mat-radio-group aria-label="Select an option" formControlName="confirmDogLiveWithYouAfterRetire">
							<div class="d-flex justify-content-start">
								<mat-radio-button class="radio-label w-auto" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-radio-button class="radio-label w-auto" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</div>
						</mat-radio-group>
						@if (
							(form.get('confirmDogLiveWithYouAfterRetire')?.dirty ||
								form.get('confirmDogLiveWithYouAfterRetire')?.touched) &&
							form.get('confirmDogLiveWithYouAfterRetire')?.invalid &&
							form.get('confirmDogLiveWithYouAfterRetire')?.hasError('required')
						) {
							<mat-error>This is required</mat-error>
						}
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepRdDogLivingInfoComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.retiredDogApplicationService.dogLivingForm;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private retiredDogApplicationService: RetiredDogApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
