import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormErrorStateMatcher } from 'projects/shared/src/public-api';
import { ScreeningFormStepComponent } from '../screening.component';

@Component({
	selector: 'app-checklist',
	template: `
		<section class="step-section pt-4 pb-5">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<div class="title mb-5">Checklist</div>

					<!-- <div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-form-field>
							<mat-label>Organization Name</mat-label>
							<input
								matInput
								formControlName="organizationName"
								maxlength="160"
								required
								[errorStateMatcher]="matcher"
							/>
							<mat-hint>Please enter your 'Doing Business As' name</mat-hint>
							<img class="icon-size" matPrefix src="/assets/organization-name.png" />
							<mat-error *ngIf="form.get('organizationName')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div> -->
				</div>
			</form>
		</section>
	`,
	styles: [],
})
export class ChecklistComponent implements OnInit, ScreeningFormStepComponent {
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			organizationName: new FormControl('', [Validators.required]),
		});
	}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
