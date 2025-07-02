import { Component, Input, OnInit } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-mdra-business-manager',
	template: `
		<app-step-section heading="Business manager" [subheading]="subtitle">
		  <div class="row">
		    <div class="col-xxl-6 col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
		      <app-alert type="info" icon="info">
		        The business manager is the person responsible for the day to day management of the business.
		      </app-alert>
		
		      <form [formGroup]="form" novalidate>
		        <div class="row">
		          <div class="col-12">
		            <mat-form-field>
		              <mat-label>Full Name</mat-label>
		              <input matInput formControlName="bizManagerFullName" [errorStateMatcher]="matcher" maxlength="150" />
		              @if (form.get('bizManagerFullName')?.hasError('required')) {
		                <mat-error> This is required </mat-error>
		              }
		            </mat-form-field>
		          </div>
		
		          <div class="col-lg-6 col-md-12">
		            <mat-form-field>
		              <mat-label>Phone Number <span class="optional-label">(optional)</span></mat-label>
		              <input
		                matInput
		                formControlName="bizManagerPhoneNumber"
		                [mask]="phoneMask"
		                [showMaskTyped]="false"
		                [errorStateMatcher]="matcher"
		                />
		                @if (form.get('bizManagerPhoneNumber')?.hasError('mask')) {
		                  <mat-error
		                    >This must be 10 digits</mat-error
		                    >
		                }
		              </mat-form-field>
		            </div>
		
		            <div class="col-lg-6 col-md-12">
		              <mat-form-field>
		                <mat-label>Email Address <span class="optional-label">(if any)</span></mat-label>
		                <input
		                  matInput
		                  formControlName="bizManagerEmailAddress"
		                  [errorStateMatcher]="matcher"
		                  placeholder="name@domain.com"
		                  maxlength="75"
		                  />
		                  @if (form.get('bizManagerEmailAddress')?.hasError('email')) {
		                    <mat-error>
		                      Must be a valid email address
		                    </mat-error>
		                  }
		                </mat-form-field>
		              </div>
		            </div>
		          </form>
		        </div>
		      </div>
		    </app-step-section>
		`,
	styles: [],
	standalone: false,
})
export class StepMdraBusinessManagerComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	phoneMask = SPD_CONSTANTS.phone.displayMask;

	subtitle = '';
	form = this.metalDealersApplicationService.businessManagerFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	ngOnInit(): void {
		const isRenewalOrUpdate = this.metalDealersApplicationService.isRenewalOrUpdate();
		this.subtitle = isRenewalOrUpdate
			? 'Confirm your business manager information'
			: 'Provide the business manager information';
	}
	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
