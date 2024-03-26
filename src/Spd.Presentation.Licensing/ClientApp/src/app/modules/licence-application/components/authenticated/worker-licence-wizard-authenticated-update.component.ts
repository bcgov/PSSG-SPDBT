import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { Subscription } from 'rxjs';
import { LicenceApplicationService } from '../../services/licence-application.service';
import { StepWorkerLicenceCategoryComponent } from '../shared/worker-licence-wizard-steps/step-worker-licence-category.component';
import { StepWorkerLicenceDogsAuthorizationComponent } from '../shared/worker-licence-wizard-steps/step-worker-licence-dogs-authorization.component';
import { StepWorkerLicencePhotographOfYourselfComponent } from '../shared/worker-licence-wizard-steps/step-worker-licence-photograph-of-yourself.component';
import { StepWorkerLicenceReprintComponent } from '../shared/worker-licence-wizard-steps/step-worker-licence-reprint.component';
import { StepWorkerLicenceRestraintsComponent } from '../shared/worker-licence-wizard-steps/step-worker-licence-restraints.component';
import { StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent } from './worker-licence-wizard-steps/step-worker-licence-summary-review-update-authenticated.component';

@Component({
	selector: 'app-worker-licence-wizard-authenticated-update',
	template: `
		<div class="row">
			<div class="offset-xl-1 col-xl-10 col-lg-12">
				<mat-stepper class="child-stepper" linear (selectionChange)="onStepSelectionChange($event)" #stepper>
					<mat-step completed="true">
						<app-step-worker-licence-confirmation></app-step-worker-licence-confirmation>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" (click)="onGotoUserProfile()">
									Previous
								</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button
									mat-flat-button
									color="primary"
									class="large mb-2"
									(click)="onFormValidNextStep(STEP_LICENCE_CONFIRMATION)"
								>
									Next
								</button>
							</div>
						</div>
					</mat-step>

					<mat-step *ngIf="hasBcscNameChanged">
						<app-step-worker-licence-review-name-change></app-step-worker-licence-review-name-change>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button
									mat-flat-button
									color="primary"
									class="large mb-2"
									(click)="onFormValidNextStep(STEP_NAME_CHANGE)"
								>
									Next
								</button>
							</div>
						</div>
					</mat-step>

					<mat-step *ngIf="hasBcscNameChanged">
						<app-step-worker-licence-reprint></app-step-worker-licence-reprint>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_REPRINT)">
									Next
								</button>
							</div>
						</div>
					</mat-step>

					<mat-step *ngIf="hasGenderChanged">
						<app-step-worker-licence-photograph-of-yourself
							[applicationTypeCode]="applicationTypeCodes.Update"
						></app-step-worker-licence-photograph-of-yourself>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button
									mat-flat-button
									color="primary"
									class="large mb-2"
									(click)="onFormValidNextStep(STEP_PHOTOGRAPH_OF_YOURSELF)"
								>
									Next
								</button>
							</div>
						</div>
					</mat-step>

					<mat-step>
						<app-step-worker-licence-category
							[applicationTypeCode]="applicationTypeCodes.Update"
						></app-step-worker-licence-category>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button
									mat-flat-button
									color="primary"
									class="large mb-2"
									(click)="onFormValidNextStep(STEP_LICENCE_CATEGORY)"
								>
									Next
								</button>
							</div>
						</div>
					</mat-step>

					<mat-step *ngIf="showStepDogsAndRestraints">
						<app-step-worker-licence-restraints
							[applicationTypeCode]="applicationTypeCodes.Update"
						></app-step-worker-licence-restraints>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button
									mat-flat-button
									color="primary"
									class="large mb-2"
									(click)="onFormValidNextStep(STEP_RESTRAINTS)"
								>
									Next
								</button>
							</div>
						</div>
					</mat-step>

					<mat-step *ngIf="showStepDogsAndRestraints">
						<app-step-worker-licence-dogs-authorization
							[applicationTypeCode]="applicationTypeCodes.Update"
						></app-step-worker-licence-dogs-authorization>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_DOGS)">
									Next
								</button>
							</div>
						</div>
					</mat-step>

					<mat-step>
						<app-step-worker-licence-summary-review-update-authenticated></app-step-worker-licence-summary-review-update-authenticated>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button mat-flat-button color="primary" class="large mb-2" (click)="onPayNow(STEP_SUMMARY)">Pay</button>
							</div>
						</div>
					</mat-step>
				</mat-stepper>
			</div>
		</div>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class WorkerLicenceWizardAuthenticatedUpdateComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	applicationTypeCodes = ApplicationTypeCode;

	readonly STEP_LICENCE_CONFIRMATION = 0;
	readonly STEP_NAME_CHANGE = 1;
	readonly STEP_REPRINT = 2;
	readonly STEP_PHOTOGRAPH_OF_YOURSELF = 3;
	readonly STEP_LICENCE_CATEGORY = 4;
	readonly STEP_DOGS = 5;
	readonly STEP_RESTRAINTS = 6;
	readonly STEP_SUMMARY = 7;

	showStepDogsAndRestraints = false;
	hasBcscNameChanged = false;
	hasGenderChanged = false;

	@ViewChild(StepWorkerLicenceReprintComponent)
	stepLicenceReprintComponent!: StepWorkerLicenceReprintComponent;

	@ViewChild(StepWorkerLicencePhotographOfYourselfComponent)
	stepLicencePhotographOfYourselfComponent!: StepWorkerLicencePhotographOfYourselfComponent;

	@ViewChild(StepWorkerLicenceCategoryComponent)
	licenceCategoryComponent!: StepWorkerLicenceCategoryComponent;

	@ViewChild(StepWorkerLicenceRestraintsComponent)
	restraintsComponent!: StepWorkerLicenceRestraintsComponent;

	@ViewChild(StepWorkerLicenceDogsAuthorizationComponent)
	dogsComponent!: StepWorkerLicenceDogsAuthorizationComponent;

	@ViewChild(StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent)
	licenceSummaryComponent!: StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent;

	private licenceModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private licenceApplicationService: LicenceApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
		}

		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.showStepDogsAndRestraints = this.licenceApplicationService.licenceModelFormGroup.get(
					'categorySecurityGuardFormGroup.isInclude'
				)?.value;

				this.hasBcscNameChanged = this.licenceApplicationService.licenceModelFormGroup.get(
					'personalInformationData.hasBcscNameChanged'
				)?.value;

				this.hasGenderChanged = this.licenceApplicationService.licenceModelFormGroup.get(
					'personalInformationData.hasGenderChanged'
				)?.value;
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	onGotoUserProfile(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
				LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
			),
			{ state: { applicationTypeCode: ApplicationTypeCode.Update } }
		);
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.stepper.next();
	}

	onPayNow(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
	}

	private dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_LICENCE_CONFIRMATION:
				return true;
			case this.STEP_NAME_CHANGE:
				return true;
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				return this.stepLicencePhotographOfYourselfComponent.isFormValid();
			case this.STEP_REPRINT:
				return this.stepLicenceReprintComponent.isFormValid();
			case this.STEP_LICENCE_CATEGORY:
				return this.licenceCategoryComponent.isFormValid();
			case this.STEP_RESTRAINTS:
				return this.restraintsComponent.isFormValid();
			case this.STEP_DOGS:
				return this.dogsComponent.isFormValid();
			case this.STEP_SUMMARY:
				return this.licenceSummaryComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
