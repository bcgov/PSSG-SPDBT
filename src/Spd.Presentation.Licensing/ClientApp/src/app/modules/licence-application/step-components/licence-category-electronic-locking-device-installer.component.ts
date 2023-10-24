import { Component, OnInit } from '@angular/core';
import { WorkerCategoryTypeCode } from 'src/app/api/models';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-electronic-locking-device-installer',
	template: `
		<form [formGroup]="form" class="text-center my-4" novalidate>
			<mat-checkbox class="w-auto" formControlName="checkbox">
				<span class="fw-semibold" style="color: black;">{{ title }} </span>
			</mat-checkbox>
		</form>
	`,
	styles: [],
})
export class LicenceCategoryElectronicLockingDeviceInstallerComponent implements OnInit, LicenceFormStepComponent {
	form = this.licenceApplicationService.categoryElectronicLockingDeviceInstallerFormGroup;
	title = '';

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.form.patchValue({ checkbox: true });
		this.title = this.optionsPipe.transform(
			WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
			'SwlCategoryTypes'
		);
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
