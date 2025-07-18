import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-team-dog-info',
	template: `
		<app-step-section [heading]="title">
			<app-form-gdsd-dog-info [form]="form" [applicationTypeCode]="applicationTypeCode"></app-form-gdsd-dog-info>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepTeamDogInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';

	form: FormGroup = this.gdsdTeamApplicationService.dogInfoFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(
		private utilService: UtilService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.isNew ? 'Your dog information' : 'Confirm your dog information';

		if (this.isNew) {
			this.utilService.enableInputs(this.form);
		} else {
			this.utilService.disableInputs(this.form, ['microchipNumber']);
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
