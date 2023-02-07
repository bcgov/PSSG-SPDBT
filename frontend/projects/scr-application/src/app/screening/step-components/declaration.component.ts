import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-declaration',
	template: `
		<section class="step-section pt-4 pb-5">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<div class="title mb-5">Review and agree to the following:</div>
					<div class="row my-4">
						<div class="offset-md-1 col-md-10 col-sm-12">
							<mat-checkbox formControlName="agreeToTermsAndConditions">
								I certify that, to the best of my knowledge, the information I have provided and will provide as
								necessary is complete and accurate.
							</mat-checkbox>
							<mat-error
								*ngIf="
									(form.get('agreeToTermsAndConditions')?.dirty || form.get('agreeToTermsAndConditions')?.touched) &&
									form.get('agreeToTermsAndConditions')?.invalid &&
									form.get('agreeToTermsAndConditions')?.hasError('required')
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
export class DeclarationComponent {
	form: FormGroup = this.formBuilder.group({
		agreeToTermsAndConditions: new FormControl('', [Validators.required]),
	});

	constructor(private formBuilder: FormBuilder) {}
}
