import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-dt-mailing-address',
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
export class StepDtMailingAddressComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	form: FormGroup = this.dogTrainerApplicationService.trainerMailingAddressFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Replacement: {
				this.title = 'Review the dog trainer mailing address';
				this.subtitle = 'Ensure the mailing address is correct before submitting your application';
				break;
			}
			case ApplicationTypeCode.Renewal: {
				this.title = 'Confirm the dog trainer mailing address';
				this.subtitle = 'Ensure the mailing address is correct before submitting your application';
				break;
			}
			default: {
				this.title = 'Dog trainer mailing address';
				this.subtitle = 'This is the address where you will receive your certification.';
				break;
			}
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
