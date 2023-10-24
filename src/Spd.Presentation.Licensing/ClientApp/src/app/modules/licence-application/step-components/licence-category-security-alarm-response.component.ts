import { Component, OnInit } from '@angular/core';
import { SwlCategoryTypeCode } from 'src/app/api/models';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-security-alarm-response',
	template: `
		<form [formGroup]="form" class="text-center my-4" novalidate>
			<mat-checkbox class="w-auto" formControlName="checkbox">
				<span class="fw-semibold" style="color: black;">{{ title }} </span>
			</mat-checkbox>
		</form>
	`,
	styles: [],
})
export class LicenceCategorySecurityAlarmResponseComponent implements OnInit, LicenceFormStepComponent {
	form = this.licenceApplicationService.categorySecurityAlarmResponseFormGroup;
	title = '';

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.form.patchValue({ checkbox: true });
		this.title = this.optionsPipe.transform(SwlCategoryTypeCode.SecurityAlarmResponse, 'SwlCategoryTypes');
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
