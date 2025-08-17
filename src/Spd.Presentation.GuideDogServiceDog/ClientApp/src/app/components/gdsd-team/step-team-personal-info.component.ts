import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-team-personal-info',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
			<app-form-gdsd-personal-info
				[form]="form"
				[isReadonly]="isReadonly"
				[applicationTypeCode]="applicationTypeCode"
			></app-form-gdsd-personal-info>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepTeamPersonalInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	@Input() isReadonly = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	form: FormGroup = this.gdsdTeamApplicationService.personalInformationFormGroup;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	ngOnInit(): void {
		this.title = this.isRenewal ? 'Confirm your personal information' : 'Your personal information';
		this.subtitle = this.isRenewal ? SPD_CONSTANTS.label.updateLabel : '';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}
}
