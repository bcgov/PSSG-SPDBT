import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-dt-training-school-mailing-address',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<div class="row">
				<div class="col-md-8 col-sm-12 mx-auto">
					<app-form-address [form]="form" [isReadonly]="false" [isWideView]="true"></app-form-address>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepDtTrainingSchoolMailingAddressComponent implements OnInit, LicenceChildStepperStepComponent {
	addressChangeUrl = SPD_CONSTANTS.urls.addressChangeUrl;
	title = '';
	subtitle = '';

	form: FormGroup = this.dogTrainerApplicationService.mailingAddressFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				this.title = 'Confirm the accredited training school mailing address';
				// this.subtitle = 'Ensure your mailing address is correct before submitting your application';
				break;
			}
			default: {
				this.title = 'Accredited training school mailing address';
				// this.subtitle = 'This is the address where you will receive your certification.';
				break;
			}
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
