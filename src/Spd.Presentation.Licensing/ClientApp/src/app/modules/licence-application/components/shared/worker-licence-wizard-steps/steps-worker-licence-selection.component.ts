import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { Subscription } from 'rxjs';
import { StepWorkerLicenceCategoryComponent } from './step-worker-licence-category.component';
import { StepWorkerLicenceDogsAuthorizationComponent } from './step-worker-licence-dogs-authorization.component';
import { StepWorkerLicenceExpiredComponent } from './step-worker-licence-expired.component';
import { StepWorkerLicenceRestraintsComponent } from './step-worker-licence-restraints.component';
import { StepWorkerLicenceSoleProprietorComponent } from './step-worker-licence-sole-proprietor.component';
import { StepWorkerLicenceTermComponent } from './step-worker-licence-term.component';

@Component({
	selector: 'app-steps-worker-licence-selection',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New">
					<app-step-worker-licence-checklist-new></app-step-worker-licence-checklist-new>

					<div class="row wizard-button-row">
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12 mx-auto">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
					<!-- <div class="row wizard-button-row">
						<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
							<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
						</div>
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div> -->
				</ng-container>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Renewal">
					<app-step-worker-licence-checklist-renewal></app-step-worker-licence-checklist-renewal>

					<div class="row wizard-button-row">
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12 mx-auto">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</ng-container>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Update">
					<app-step-worker-licence-checklist-update></app-step-worker-licence-checklist-update>

					<div class="row wizard-button-row">
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12 mx-auto">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</ng-container>
			</mat-step>

			<mat-step
				*ngIf="
					applicationTypeCode === applicationTypeCodes.Update || applicationTypeCode === applicationTypeCodes.Renewal
				"
			>
				<app-step-worker-licence-confirmation
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-confirmation>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
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

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-worker-licence-sole-proprietor
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-sole-proprietor>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_SOLE_PROPRIETOR)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode === applicationTypeCodes.New">
				<app-step-worker-licence-expired></app-step-worker-licence-expired>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_LICENCE_EXPIRED)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_LICENCE_EXPIRED)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-category
					[applicationTypeCode]="applicationTypeCode"
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
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_LICENCE_CATEGORY)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepDogsAndRestraints">
				<app-step-worker-licence-restraints></app-step-worker-licence-restraints>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_RESTRAINTS)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_RESTRAINTS)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_RESTRAINTS)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepDogsAndRestraints">
				<app-step-worker-licence-dogs-authorization></app-step-worker-licence-dogs-authorization>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_DOGS)" *ngIf="isLoggedIn">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_DOGS)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_DOGS)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-worker-licence-term [applicationTypeCode]="applicationTypeCode"></app-step-worker-licence-term>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_LICENCE_TERM)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_LICENCE_TERM)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_LICENCE_TERM)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsWorkerLicenceSelectionComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	readonly STEP_SOLE_PROPRIETOR = 1;
	readonly STEP_LICENCE_CONFIRMATION = 2;
	readonly STEP_LICENCE_EXPIRED = 5;
	readonly STEP_LICENCE_CATEGORY = 6;
	readonly STEP_DOGS = 8;
	readonly STEP_RESTRAINTS = 9;
	readonly STEP_LICENCE_TERM = 7;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isLoggedIn = false;
	isFormValid = false;
	applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(StepWorkerLicenceSoleProprietorComponent)
	soleProprietorComponent!: StepWorkerLicenceSoleProprietorComponent;

	@ViewChild(StepWorkerLicenceExpiredComponent)
	licenceExpiredComponent!: StepWorkerLicenceExpiredComponent;

	@ViewChild(StepWorkerLicenceCategoryComponent)
	licenceCategoryComponent!: StepWorkerLicenceCategoryComponent;

	@ViewChild(StepWorkerLicenceRestraintsComponent)
	restraintsComponent!: StepWorkerLicenceRestraintsComponent;

	@ViewChild(StepWorkerLicenceDogsAuthorizationComponent)
	dogsComponent!: StepWorkerLicenceDogsAuthorizationComponent;

	@ViewChild(StepWorkerLicenceTermComponent)
	licenceTermComponent!: StepWorkerLicenceTermComponent;

	categorySecurityGuardFormGroup: FormGroup = this.licenceApplicationService.categorySecurityGuardFormGroup;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {
		super();
	}

	ngOnInit(): void {
		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
			(isLoggedIn: boolean) => {
				this.isLoggedIn = isLoggedIn;
			}
		);

		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelValueChanges$.subscribe(
			(_resp: boolean) => {
				// console.debug('licenceModelValueChanges$', _resp);
				this.isFormValid = _resp;

				this.applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
	}

	onCancel(): void {
		this.router.navigate([LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous()]);
	}

	override onGoToNextStep() {
		console.debug('onGoToNextStep', this.childstepper.selectedIndex);

		if (this.childstepper.selectedIndex === 2 && this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.nextStepperStep.emit(true);
			return;
		}
		this.childstepper.next();
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_SOLE_PROPRIETOR:
				return this.soleProprietorComponent.isFormValid();
			case this.STEP_LICENCE_CONFIRMATION:
				return true;
			case this.STEP_LICENCE_EXPIRED:
				return this.licenceExpiredComponent.isFormValid();
			case this.STEP_LICENCE_CATEGORY:
				return this.licenceCategoryComponent.isFormValid();
			case this.STEP_RESTRAINTS:
				return this.restraintsComponent.isFormValid();
			case this.STEP_DOGS:
				return this.dogsComponent.isFormValid();
			case this.STEP_LICENCE_TERM:
				return this.licenceTermComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get showStepDogsAndRestraints(): boolean {
		return this.categorySecurityGuardFormGroup.get('isInclude')?.value;
	}
}
