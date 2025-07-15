import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-rd-personal-info-anonymous',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
			<app-form-gdsd-personal-info-anonymous
				[form]="form"
				[applicationTypeCode]="applicationTypeCode"
			></app-form-gdsd-personal-info-anonymous>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepRdPersonalInfoAnonymousComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	form: FormGroup = this.retiredDogApplicationService.personalInformationFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private retiredDogApplicationService: RetiredDogApplicationService) {}

	ngOnInit(): void {
		this.title = this.isRenewal ? 'Confirm your personal information' : 'Your personal information';
		this.subtitle = this.isRenewal ? 'Update any information that has changed since your last application' : '';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
}
