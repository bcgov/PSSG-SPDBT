import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormErrorStateMatcher } from 'projects/shared/src/public-api';
import { ScreeningFormStepComponent } from '../screening.component';

@Component({
	selector: 'app-checklist',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<div class="step">
				<div class="title mb-5">Checklist</div>
			</div>
		</section>
	`,
	styles: [],
})
export class ChecklistComponent implements OnInit, ScreeningFormStepComponent {
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {}

	getDataToSave(): any {
		return '';
	}

	isFormValid(): boolean {
		return true; //this.form.valid;
	}
}
