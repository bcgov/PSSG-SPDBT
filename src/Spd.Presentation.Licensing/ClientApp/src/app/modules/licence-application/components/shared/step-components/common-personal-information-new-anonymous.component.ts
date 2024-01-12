import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { GenderTypes } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-personal-information-new-anonymous',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="middleName1" maxlength="40" />
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="middleName2" maxlength="40" />
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Surname</mat-label>
								<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
								<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Date of Birth</mat-label>
								<input
									matInput
									[matDatepicker]="picker"
									formControlName="dateOfBirth"
									[max]="maxBirthDate"
									[errorStateMatcher]="matcher"
								/>
								<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
								<mat-datepicker #picker startView="multi-year"></mat-datepicker>
								<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>

						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Sex</mat-label>
								<mat-select formControlName="genderCode" [errorStateMatcher]="matcher">
									<mat-option *ngFor="let gdr of genderTypes" [value]="gdr.code">
										{{ gdr.desc }}
									</mat-option>
								</mat-select>
								<mat-error *ngIf="form.get('genderCode')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CommonPersonalInformationNewAnonymousComponent {
	genderTypes = GenderTypes;
	matcher = new FormErrorStateMatcher();

	maxBirthDate = this.utilService.getBirthDateMax();

	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private utilService: UtilService) {}
}
