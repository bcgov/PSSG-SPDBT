import { Component, OnInit } from '@angular/core';
import { WorkerCategoryTypeCode } from 'src/app/api/models';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-body-armour-sales',
	template: `
		<form [formGroup]="form" class="text-center my-4" novalidate>
			<mat-checkbox class="w-auto" checked="true">
				<span class="fw-semibold" style="color: black;">{{ title }} </span>
			</mat-checkbox>
		</form>
	`,
	styles: [],
})
export class LicenceCategoryBodyArmourSalesComponent implements OnInit, LicenceChildStepperStepComponent {
	form = this.licenceApplicationService.categoryBodyArmourSalesFormGroup;
	title = '';

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.BodyArmourSales, 'WorkerCategoryTypes');
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
