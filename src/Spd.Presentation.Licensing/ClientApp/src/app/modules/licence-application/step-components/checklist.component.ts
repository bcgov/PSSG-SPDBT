import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-checklist',
	template: `
		<div class="step">
			<app-step-title
				title="Checklist"
				subtitle="Make sure you have the following items before you continue"
			></app-step-title>
			<div class="step-container row">
				<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-checkbox formControlName="checklist1"> Item </mat-checkbox>
						<mat-checkbox formControlName="checklist2"> Item </mat-checkbox>
					</form>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class ChecklistComponent {
	form: FormGroup = this.formBuilder.group({
		checklist1: new FormControl(''),
		checklist2: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
