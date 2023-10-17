import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-security-alarm-sales',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<div class="step-container">
					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-9 col-lg-12">
							<div class="text-center">
								<mat-chip-option [selectable]="false" class="mat-chip-green me-3">
									Category #{{ index }}
								</mat-chip-option>
								<span class="title" style="position: relative; top: -5px;">{{ title }}</span>
							</div>

							<mat-divider class="mt-1 mb-2"></mat-divider>

							<form [formGroup]="form" class="text-center my-4" novalidate>
								<mat-checkbox class="w-auto" formControlName="checkbox"> Security Alarm Sales </mat-checkbox>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceCategorySecurityAlarmSalesComponent implements OnInit, LicenceFormStepComponent {
	form!: FormGroup;
	title = '';

	@Input() option: string | null = null;
	@Input() index: number = 0;

	constructor(private formBuilder: FormBuilder, private optionsPipe: OptionsPipe) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			checkbox: new FormControl({ value: true, disabled: true }),
		});

		this.title = this.optionsPipe.transform(this.option, 'SwlCategoryTypes');
	}

	isFormValid(): boolean {
		return true;
	}
}
