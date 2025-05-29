import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-team-personal-info-anonymous',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<app-form-gdsd-personal-info-anonymous
				[form]="form"
				[applicationTypeCode]="applicationTypeCode"
			></app-form-gdsd-personal-info-anonymous>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepTeamPersonalInfoAnonymousComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	form: FormGroup = this.gdsdTeamApplicationService.personalInformationFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

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
