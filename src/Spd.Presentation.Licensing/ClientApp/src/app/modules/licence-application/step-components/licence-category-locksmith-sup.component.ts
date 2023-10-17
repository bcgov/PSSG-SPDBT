import { Component, OnInit } from '@angular/core';
import { SwlCategoryTypeCode } from 'src/app/core/code-types/model-desc.models';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-locksmith-sup',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<div class="step-container">
					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-9 col-lg-12">
							<div class="text-center">
								<span class="title" style="position: relative; top: -5px;">{{ title }}</span>
							</div>

							<mat-divider class="mt-1 mb-2"></mat-divider>

							<form [formGroup]="form" class="text-center my-4" novalidate>
								<mat-checkbox class="w-auto" formControlName="checkbox"> {{ title }} </mat-checkbox>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceCategoryLocksmithSupComponent implements OnInit, LicenceFormStepComponent {
	form = this.licenceApplicationService.categoryLocksmithSupFormGroup;
	title = '';

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.form.patchValue({ checkbox: true });
		this.title = this.optionsPipe.transform(SwlCategoryTypeCode.LocksmithUnderSupervision, 'SwlCategoryTypes');
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
