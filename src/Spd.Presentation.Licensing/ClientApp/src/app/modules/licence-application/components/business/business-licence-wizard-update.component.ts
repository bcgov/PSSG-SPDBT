import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, BizTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { BusinessApplicationService } from '../../services/business-application.service';
import { CommonApplicationService } from '../../services/common-application.service';
import { StepBusinessLicenceConfirmationComponent } from './step-business-licence-confirmation.component';
import { StepsBusinessLicenceReviewComponent } from './steps-business-licence-review.component';
import { StepsBusinessLicenceUpdatesComponent } from './steps-business-licence-updates.component';

@Component({
	selector: 'app-business-licence-wizard-update',
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
						<app-step-business-licence-confirmation></app-step-business-licence-confirmation>

						<app-wizard-footer
							(previousStepperStep)="onGotoUserProfile()"
							(nextStepperStep)="onGoToNextStep()"
						></app-wizard-footer>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Licence Updates</ng-template>
						<app-steps-business-licence-updates
							[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
							(childNextStep)="onChildNextStep()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-business-licence-updates>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review & Confirm</ng-template>
						<app-steps-business-licence-review
							[workerLicenceTypeCode]="workerLicenceTypeCode"
							[applicationTypeCode]="applicationTypeCode"
							[isRenewalShortForm]="false"
							[showSaveAndExit]="false"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextPayStep)="onNextPayStep()"
							(scrollIntoView)="onScrollIntoView()"
							(goToStep)="onGoToStep($event)"
						></app-steps-business-licence-review>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Pay</ng-template>
					</mat-step>
				</mat-stepper>
			</div>
		</div>
	`,
	styles: [],
})
export class BusinessLicenceWizardUpdateComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	newLicenceAppId: string | null = null;
	newLicenceCost = 0;

	readonly STEP_LICENCE_CONFIRMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_UPDATES = 1;
	readonly STEP_REVIEW_AND_CONFIRM = 2;

	isFormValid = false;

	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;
	bizTypeCode!: BizTypeCode;

	isBusinessLicenceSoleProprietor!: boolean;
	private businessModelValueChangedSubscription!: Subscription;

	@ViewChild(StepBusinessLicenceConfirmationComponent)
	stepLicenceConfirmationComponent!: StepBusinessLicenceConfirmationComponent;
	@ViewChild(StepsBusinessLicenceUpdatesComponent) stepsLicenceUpdatesComponent!: StepsBusinessLicenceUpdatesComponent;
	@ViewChild(StepsBusinessLicenceReviewComponent) stepsReviewAndConfirm!: StepsBusinessLicenceReviewComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private commonApplicationService: CommonApplicationService,
		private businessApplicationService: BusinessApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.businessModelValueChangedSubscription = this.businessApplicationService.businessModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.workerLicenceTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'workerLicenceTypeData.workerLicenceTypeCode'
				)?.value;
				this.applicationTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;
				this.bizTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'businessInformationData.bizTypeCode'
				)?.value;

				this.isBusinessLicenceSoleProprietor = this.businessApplicationService.businessModelFormGroup.get(
					'isBusinessLicenceSoleProprietor'
				)?.value;

				// const membersWithoutSwl = this.businessApplicationService.businessModelFormGroup.get(
				// 	'controllingMembersData.membersWithoutSwl'
				// )?.value;
				// this.nonSwlControllingMembersExist = membersWithoutSwl?.length > 0;

				this.isFormValid = _resp;
			}
		);
	}

	ngOnDestroy() {
		if (this.businessModelValueChangedSubscription) this.businessModelValueChangedSubscription.unsubscribe();
	}

	onGoToNextStep(): void {
		this.stepper.next();
	}

	onGotoUserProfile(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_LICENCE_USER_PROFILE),
			{ state: { applicationTypeCode: this.applicationTypeCode } }
		);
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_LICENCE_UPDATES:
				this.stepsLicenceUpdatesComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_LICENCE_UPDATES:
				this.stepsLicenceUpdatesComponent?.onGoToLastStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToLastStep();
				break;
		}
	}

	// onNextPayStep(): void {
	// 	this.businessApplicationService.submitBusinessLicenceRenewalOrUpdateOrReplace().subscribe({
	// 		next: (resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
	// 			this.hotToastService.success('Your business licence renewal has been successfully submitted');
	// 			this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessApplications());
	// 			this.payNow(resp.body.licenceAppId!);
	// 		},
	// 		error: (error: any) => {
	// 			console.log('An error occurred during save', error);
	// 			this.hotToastService.error('An error occurred during the save. Please try again.');
	// 		},
	// 	});
	// }

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		this.stepsLicenceUpdatesComponent?.onGoToFirstStep();
		this.stepsReviewAndConfirm?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	// onGoToReview() {
	// 	this.goToReviewStep();
	// }

	// onChildNextStep() {
	// 	this.goToChildNextStep();
	// }

	onChildNextStep() {
		this.stepsLicenceUpdatesComponent?.onGoToNextStep();
	}

	onSubmitStep(): void {
		// if (this.newLicenceAppId) {
		// 	if (this.newLicenceCost > 0) {
		// 		this.stepsReviewAuthenticatedComponent?.onGoToLastStep();
		// 	} else {
		// 		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LICENCE_UPDATE_SUCCESS));
		// 	}
		// } else {
		// 	this.licenceApplicationService.submitLicenceRenewalOrUpdateOrReplaceAuthenticated().subscribe({
		// 		next: (resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
		// 			const workerLicenceCommandResponse = resp.body;
		// 			// save this locally just in application payment fails
		// 			this.newLicenceAppId = workerLicenceCommandResponse.licenceAppId!;
		// 			this.newLicenceCost = workerLicenceCommandResponse.cost ?? 0;
		// 			if (this.newLicenceCost > 0) {
		// 				this.stepsReviewAuthenticatedComponent?.onGoToLastStep();
		// 			} else {
		// 				this.hotToastService.success('Your licence update has been successfully submitted');
		// 				this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LICENCE_UPDATE_SUCCESS));
		// 			}
		// 		},
		// 		error: (error: any) => {
		// 			console.log('An error occurred during save', error);
		// 			this.hotToastService.error('An error occurred during the save. Please try again.');
		// 		},
		// 	});
		// }
	}

	onNextPayStep(): void {
		this.payNow(this.newLicenceAppId!);
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowPersonalLicenceAuthenticated(
			licenceAppId,
			'Payment for Business Licence update'
		);
	}

	// private goToChildNextStep() {
	// 	switch (this.stepper.selectedIndex) {
	// 		case this.STEP_LICENCE_CONFIRMATION:
	// 			this.stepsBusinessInformationComponent?.onGoToNextStep();
	// 			break;
	// 		case this.STEP_LICENCE_UPDATES:
	// 			this.stepsLicenceSelectionComponent?.onGoToNextStep();
	// 			break;
	// 		case this.STEP_REVIEW_AND_CONFIRM:
	// 			this.stepsReviewAndConfirm?.onGoToNextStep();
	// 			break;
	// 	}
	// }

	// private payNow(licenceAppId: string): void {
	// 	this.commonApplicationService.payNowBusinessLicence(
	// 		licenceAppId,
	// 		'Payment for renewal of Business Licence application'
	// 	);
	// }

	// private goToReviewStep(): void {
	// 		this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
	// }
}
