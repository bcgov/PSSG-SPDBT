import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-gdsd-mailing-address',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<div class="row" *ngIf="isLoggedIn">
				<div class="col-md-8 col-sm-12 mx-auto">
					<app-alert type="info" icon="">
						Has your mailing address changed?
						<a aria-label="Navigate to address change online site" [href]="addressChangeUrl" target="_blank"
							>Change your address online</a
						>
						to update this information on your BC Services Card. Any changes you make will then be updated here.
					</app-alert>
				</div>
			</div>

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
export class StepGdsdMailingAddressComponent implements OnInit, LicenceChildStepperStepComponent {
	addressChangeUrl = SPD_CONSTANTS.urls.addressChangeUrl;
	title = '';
	subtitle = '';

	form: FormGroup = this.gdsdApplicationService.mailingAddressFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isLoggedIn!: boolean;

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Replacement: {
				this.title = 'Review your mailing address';
				this.subtitle = 'Ensure your mailing address is correct before submitting your application';
				break;
			}
			case ApplicationTypeCode.Renewal: {
				this.title = 'Confirm your mailing address';
				this.subtitle = 'Ensure your mailing address is correct before submitting your application';
				break;
			}
			default: {
				this.title = 'Provide your mailing address';
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
