import { Component, OnInit } from '@angular/core';
import { WorkerCategoryTypeCode } from 'src/app/api/models';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceChildStepperStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-security-alarm-response',
	template: `
		<form [formGroup]="form" class="text-center my-4" novalidate>
			<mat-checkbox class="w-auto" checked="true">
				<span class="fw-semibold" style="color: black;">{{ title }} </span>
			</mat-checkbox>
		</form>
	`,
	styles: [],
})
export class LicenceCategorySecurityAlarmResponseComponent implements OnInit, LicenceChildStepperStepComponent {
	form = this.licenceApplicationService.categorySecurityAlarmResponseFormGroup;
	title = '';

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.SecurityAlarmResponse, 'WorkerCategoryTypes');
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
