import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, PermitAppCommandResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { ApplicationService } from '@app/core/services/application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { PermitApplicationService } from '@core/services/permit-application.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsPermitReviewAuthenticatedComponent } from './permit-wizard-step-components/steps-permit-review-authenticated.component';
import { StepsPermitUpdatesAuthenticatedComponent } from './permit-wizard-step-components/steps-permit-updates-authenticated.component';

@Component({
	selector: 'app-permit-wizard-authenticated-update',
	template: `
		<div class="row">
			<div class="offset-xl-1 col-xl-10 col-lg-12">
				<mat-stepper
					linear
					labelPosition="bottom"
					[orientation]="orientation"
					class="mat-stepper-disable-header-navigation"
					(selectionChange)="onStepSelectionChange($event)"
					#stepper
				>
					<mat-step completed="true">
						<ng-template matStepLabel>Permit Confirmation</ng-template>
						<app-step-permit-confirmation
							[workerLicenceTypeCode]="workerLicenceTypeCode"
						></app-step-permit-confirmation>

						<app-wizard-footer
							(previousStepperStep)="onGotoUserProfile()"
							(nextStepperStep)="onGoToNextStep()"
						></app-wizard-footer>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Permit Updates</ng-template>
						<app-steps-permit-updates-authenticated
							[workerLicenceTypeCode]="workerLicenceTypeCode"
							[applicationTypeCode]="applicationTypeCode"
							[hasBcscNameChanged]="hasBcscNameChanged"
							[hasGenderChanged]="hasGenderChanged"
							[showEmployerInformation]="showEmployerInformation"
							(childNextStep)="onChildNextStep()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-updates-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review & Confirm</ng-template>
						<app-steps-permit-review-authenticated
							[workerLicenceTypeCode]="workerLicenceTypeCode"
							[applicationTypeCode]="applicationTypeCode"
							[showEmployerInformation]="showEmployerInformation"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextSubmitStep)="onSubmitStep()"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-review-authenticated>
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
export class PermitWizardAuthenticatedUpdateComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	newLicenceAppId: string | null = null;

	readonly STEP_PERMIT_CONFIRMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_PERMIT_UPDATES = 1;
	readonly STEP_REVIEW_AND_CONFIRM = 2;

	@ViewChild(StepsPermitUpdatesAuthenticatedComponent) stepsUpdatesComponent!: StepsPermitUpdatesAuthenticatedComponent;
	@ViewChild(StepsPermitReviewAuthenticatedComponent) stepsReviewComponent!: StepsPermitReviewAuthenticatedComponent;

	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;
	isFormValid = false;
	showSaveAndExit = false;
	showEmployerInformation = false;
	hasBcscNameChanged = false;
	hasGenderChanged = false;

	private permitModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: ApplicationService
	) {
		super(breakpointObserver);

		const state = this.router.getCurrentNavigation()?.extras.state;
		this.workerLicenceTypeCode = state && state['workerLicenceTypeCode'];
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.permitModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.workerLicenceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'workerLicenceTypeData.workerLicenceTypeCode'
				)?.value;
				this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				if (this.workerLicenceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit) {
					const bodyArmourRequirement = this.permitApplicationService.permitModelFormGroup.get(
						'permitRequirementData.bodyArmourRequirementFormGroup'
					)?.value;

					this.showEmployerInformation = !!bodyArmourRequirement.isMyEmployment;
				} else {
					const armouredVehicleRequirement = this.permitApplicationService.permitModelFormGroup.get(
						'permitRequirementData.armouredVehicleRequirementFormGroup'
					)?.value;

					this.showEmployerInformation = !!armouredVehicleRequirement.isMyEmployment;
				}

				this.hasBcscNameChanged = this.permitApplicationService.permitModelFormGroup.get(
					'personalInformationData.hasBcscNameChanged'
				)?.value;

				this.hasGenderChanged = this.permitApplicationService.permitModelFormGroup.get(
					'personalInformationData.hasGenderChanged'
				)?.value;
			}
		);
	}

	ngOnDestroy() {
		if (this.permitModelChangedSubscription) this.permitModelChangedSubscription.unsubscribe();
	}

	onGoToNextStep(): void {
		this.stepper.next();
	}

	onGotoUserProfile(): void {
		this.commonApplicationService.onGotoPermitUserProfile(this.workerLicenceTypeCode, ApplicationTypeCode.Update);
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_PERMIT_CONFIRMATION:
				this.stepsUpdatesComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewComponent?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_PERMIT_CONFIRMATION:
				this.stepper.selectedIndex = 0;
				break;
			case this.STEP_PERMIT_UPDATES:
				this.stepsUpdatesComponent?.onGoToLastStep();
				break;
		}
	}

	onChildNextStep() {
		this.stepsUpdatesComponent?.onGoToNextStep();
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onSubmitStep(): void {
		this.permitApplicationService.submitPermitRenewalOrUpdateAuthenticated().subscribe({
			next: (resp: StrictHttpResponse<PermitAppCommandResponse>) => {
				const permitCommandResponse = resp.body;

				// save this locally just in application payment fails
				this.newLicenceAppId = permitCommandResponse.licenceAppId!;

				this.hotToastService.success('Your permit update has been successfully submitted');
				this.router.navigateByUrl(
					PersonalLicenceApplicationRoutes.path(PersonalLicenceApplicationRoutes.PERMIT_UPDATE_SUCCESS)
				);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}
}
