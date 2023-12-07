import { Component, OnInit } from '@angular/core';
import { WorkerCategoryTypeCode } from 'src/app/api/models';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceChildStepperStepComponent } from '../services/licence-application.helper';
import { LicenceApplicationService } from '../services/licence-application.service';

@Component({
	selector: 'app-licence-category-electronic-locking-device-installer',
	template: `
		<div class="row my-4">
			<div class="col-12 text-center">
				<mat-icon style="vertical-align: sub;" class="me-2">check_box</mat-icon>{{ title }}
			</div>
		</div>
	`,
	styles: [],
})
export class LicenceCategoryElectronicLockingDeviceInstallerComponent
	implements OnInit, LicenceChildStepperStepComponent
{
	form = this.licenceApplicationService.categoryElectronicLockingDeviceInstallerFormGroup;
	title = '';

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(
			WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
			'WorkerCategoryTypes'
		);
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
