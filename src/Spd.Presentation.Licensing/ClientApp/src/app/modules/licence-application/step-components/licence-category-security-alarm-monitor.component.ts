import { Component, OnInit } from '@angular/core';
import { SwlCategoryTypeCode } from 'src/app/core/code-types/model-desc.models';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-security-alarm-monitor',
	template: `
		<form [formGroup]="form" class="text-center my-4" novalidate>
			<mat-checkbox class="w-auto" formControlName="checkbox"> {{ title }} </mat-checkbox>
		</form>
	`,
	styles: [],
})
export class LicenceCategorySecurityAlarmMonitorComponent implements OnInit, LicenceFormStepComponent {
	form = this.licenceApplicationService.categorySecurityAlarmMonitorFormGroup;
	title = '';

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.form.patchValue({ checkbox: true });
		this.title = this.optionsPipe.transform(SwlCategoryTypeCode.SecurityAlarmMonitor, 'SwlCategoryTypes');
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
