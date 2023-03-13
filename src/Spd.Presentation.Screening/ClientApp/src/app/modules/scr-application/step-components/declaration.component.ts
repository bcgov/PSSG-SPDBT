import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ScreeningFormStepComponent } from '../scr-application.component';

@Component({
	selector: 'app-declaration',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title title="Agree to the following declaration"></app-step-title>
					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<mat-checkbox formControlName="agreeToDeclaration">
								I certify that, to the best of my knowledge, the information I have provided and will provide as
								necessary is complete and accurate.
							</mat-checkbox>
							<mat-error
								*ngIf="
									(form.get('agreeToDeclaration')?.dirty || form.get('agreeToDeclaration')?.touched) &&
									form.get('agreeToDeclaration')?.invalid &&
									form.get('agreeToDeclaration')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [],
})
export class DeclarationComponent implements ScreeningFormStepComponent {
	form: FormGroup = this.formBuilder.group({
		agreeToDeclaration: new FormControl('', [Validators.required]),
	});

	constructor(private formBuilder: FormBuilder) {}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}
}
