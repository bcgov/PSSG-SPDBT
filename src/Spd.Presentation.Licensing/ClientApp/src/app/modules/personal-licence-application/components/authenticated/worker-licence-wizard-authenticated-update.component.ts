import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routing.module';
import { CommonApplicationService } from '@app/shared/services/common-application.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsWorkerLicenceReviewAuthenticatedComponent } from './worker-licence-wizard-step-components/steps-worker-licence-review-authenticated.component';
import { StepsWorkerLicenceUpdatesAuthenticatedComponent } from './worker-licence-wizard-step-components/steps-worker-licence-updates-authenticated.component';

@Component({
	selector: 'app-worker-licence-wizard-authenticated-update',
	template: `
		<div class="row">
			<div class="col-12">
				<mat-stepper
					linear
					labelPosition="bottom"
					[orientation]="orientation"
					class="mat-stepper-disable-header-navigation"
					(selectionChange)="onStepSelectionChange($event)"
					#stepper
				>
					<mat-step completed="true">
						<ng-template matStepLabel>Licence Confirmation</ng-template>
						<app-step-worker-licence-confirmation></app-step-worker-licence-confirmation>

						<app-wizard-footer
							(previousStepperStep)="onGotoUserProfile()"
							(nextStepperStep)="onGoToNextStep()"
						></app-wizard-footer>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Licence Updates</ng-template>
						<app-steps-worker-licence-updates-authenticated
							[showStepDogsAndRestraints]="showStepDogsAndRestraints"
							[hasBcscNameChanged]="hasBcscNameChanged"
							[hasGenderChanged]="hasGenderChanged"
							[isUpdateFlowWithHideReprintStep]="isUpdateFlowWithHideReprintStep"
							(childNextStep)="onChildNextStep()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-worker-licence-updates-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review & Confirm</ng-template>
						<app-steps-worker-licence-review-authenticated
							[applicationTypeCode]="applicationTypeCode"
							[licenceCost]="newLicenceCost"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextSubmitStep)="onSubmitStep()"
							(nextPayStep)="onNextPayStep()"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-worker-licence-review-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Pay</ng-template>
					</mat-step>
				</mat-stepper>
			</div>
		</div>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class WorkerLicenceWizardAuthenticatedUpdateComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	newLicenceAppId: string | null = null;
	newLicenceCost = 0;

	readonly STEP_LICENCE_CONFIRMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_UPDATES = 1;
	readonly STEP_REVIEW_AND_CONFIRM = 2;

	@ViewChild(StepsWorkerLicenceUpdatesAuthenticatedComponent)
	stepsLicenceUpdatesComponent!: StepsWorkerLicenceUpdatesAuthenticatedComponent;
	@ViewChild(StepsWorkerLicenceReviewAuthenticatedComponent)
	stepsReviewAuthenticatedComponent!: StepsWorkerLicenceReviewAuthenticatedComponent;

	applicationTypeCode!: ApplicationTypeCode;
	showStepDogsAndRestraints = false;
	hasBcscNameChanged = false;
	hasGenderChanged = false;

	// placeholder for flag - Update flow and data requiring reprint been changed (like categories),
	// if so, do not show the reprint step
	isUpdateFlowWithHideReprintStep = false;

	private licenceModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
		private commonApplicationService: CommonApplicationService,
		private licenceApplicationService: LicenceApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

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

	onGoToNextStep(): void {
		this.stepper.next();
	}

	onGotoUserProfile(): void {
		this.commonApplicationService.onGotoSwlUserProfile(ApplicationTypeCode.Update);
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_LICENCE_UPDATES:
				this.stepsLicenceUpdatesComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAuthenticatedComponent?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_LICENCE_CONFIRMATION:
				this.stepper.selectedIndex = 0;
				break;
			case this.STEP_LICENCE_UPDATES:
				this.stepsLicenceUpdatesComponent?.onGoToLastStep();
				break;
		}
	}

	onChildNextStep() {
		this.stepsLicenceUpdatesComponent?.onGoToNextStep();
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onSubmitStep(): void {
		if (this.newLicenceAppId) {
			if (this.newLicenceCost > 0) {
				this.stepsReviewAuthenticatedComponent?.onGoToLastStep();
			} else {
				this.router.navigateByUrl(
					PersonalLicenceApplicationRoutes.path(PersonalLicenceApplicationRoutes.LICENCE_UPDATE_SUCCESS)
				);
			}
		} else {
			this.licenceApplicationService
				.submitLicenceRenewalOrUpdateOrReplaceAuthenticated(this.isUpdateFlowWithHideReprintStep)
				.subscribe({
					next: (resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
						const workerLicenceCommandResponse = resp.body;

						// save this locally just in application payment fails
						this.newLicenceAppId = workerLicenceCommandResponse.licenceAppId!;
						this.newLicenceCost = workerLicenceCommandResponse.cost ?? 0;

						if (this.newLicenceCost > 0) {
							this.stepsReviewAuthenticatedComponent?.onGoToLastStep();
						} else {
							this.hotToastService.success('Your licence update has been successfully submitted');
							this.router.navigateByUrl(
								PersonalLicenceApplicationRoutes.path(PersonalLicenceApplicationRoutes.LICENCE_UPDATE_SUCCESS)
							);
						}
					},
					error: (error: any) => {
						console.log('An error occurred during save', error);
					},
				});
		}
	}

	onNextPayStep(): void {
		this.payNow(this.newLicenceAppId!);
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowPersonalLicenceAuthenticated(
			licenceAppId,
			'Payment for Security Worker Licence update'
		);
	}
}
