import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-rd-dog-info',
	template: `
		<app-step-section [title]="title">
			<app-form-gdsd-dog-info [form]="form" [applicationTypeCode]="applicationTypeCode"></app-form-gdsd-dog-info>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepRdDogInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';

	form: FormGroup = this.retiredDogApplicationService.dogInfoFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private retiredDogApplicationService: RetiredDogApplicationService) {}

	ngOnInit(): void {
		this.title = this.isNew ? 'Your retired dog information' : 'Confirm your retired dog information';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
