import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormErrorStateMatcher } from 'projects/shared/src/public-api';
import { ScreeningFormStepComponent } from '../screening.component';

@Component({
	selector: 'app-contact-information',
	template: `
		<section class="step-section pt-4 pb-5">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<div class="title mb-5">Review and update your contact information:</div>
					<div class="row">
						<div class="offset-md-2 col-md-3 col-sm-12">
							<mat-form-field>
								<mat-label>First Name</mat-label>
								<input matInput formControlName="contactGivenName" [errorStateMatcher]="matcher" />
								<mat-error *ngIf="contactGivenName.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('contactGivenName')?.hasError('pattern')">
									Only characters are allowed
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-md-3 col-sm-12">
							<mat-form-field>
								<mat-label>Middle Name(s) <span>(optional)</span></mat-label>
								<input matInput formControlName="contactMiddleNames" [errorStateMatcher]="matcher" />
								<mat-error *ngIf="form.get('contactMiddleNames')?.hasError('pattern')">
									Only characters are allowed
								</mat-error>
							</mat-form-field>
						</div>
						<div class="col-md-3 col-sm-12">
							<mat-form-field>
								<mat-label>Surname</mat-label>
								<input matInput formControlName="contactSurname" [errorStateMatcher]="matcher" />
								<mat-error *ngIf="contactGivenName.hasError('required')">This is required</mat-error>
								<mat-error *ngIf="form.get('contactSurname')?.hasError('pattern')">
									Only characters are allowed
								</mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="offset-md-2 col-md-5 col-sm-12">
							<mat-form-field>
								<mat-label>Email Address</mat-label>
								<input
									matInput
									formControlName="contactEmail"
									placeholder="name@domain.com"
									[errorStateMatcher]="matcher"
								/>
							</mat-form-field>
						</div>
						<div class="col-md-4 col-sm-12">
							<mat-form-field>
								<mat-label>Phone Number</mat-label>
								<input matInput formControlName="contactPhoneNumber" mask="(000) 000-0000" [showMaskTyped]="true" />
							</mat-form-field>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [``],
})
export class ContactInformationComponent implements ScreeningFormStepComponent {
	form: FormGroup = this.formBuilder.group({
		contactGivenName: new FormControl('Pulled From Portal', [Validators.pattern("^[a-zA-Z -']+"), Validators.required]),
		contactMiddleNames: new FormControl('', [Validators.pattern("^[a-zA-Z -']+")]),
		contactSurname: new FormControl('Pulled From Portal', [Validators.pattern("^[a-zA-Z -']+"), Validators.required]),
		contactEmail: new FormControl('Pulled From Portal', [Validators.email, Validators.required]),
		contactPhoneNumber: new FormControl('6048185356', [Validators.required]),
	});
	startDate = new Date(2000, 0, 1);
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder) {}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}

	get contactGivenName(): FormControl {
		return this.form.get('contactGivenName') as FormControl;
	}

	get contactSurname(): FormControl {
		return this.form.get('contactSurname') as FormControl;
	}
}
