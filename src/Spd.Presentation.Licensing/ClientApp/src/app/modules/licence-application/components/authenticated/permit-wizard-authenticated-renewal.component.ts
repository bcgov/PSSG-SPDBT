import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { AppRoutes } from '@app/app-routing.module';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged } from 'rxjs';
import { PermitApplicationService } from '../../services/permit-application.service';
import { StepsPermitDetailsNewComponent } from '../anonymous/permit-wizard-steps/steps-permit-details-new.component';
import { StepsPermitIdentificationAuthenticatedComponent } from './permit-wizard-steps/steps-permit-identification-authenticated.component';
import { StepsPermitPurposeAuthenticatedComponent } from './permit-wizard-steps/steps-permit-purpose-authenticated.component';
import { StepsPermitReviewAuthenticatedComponent } from './permit-wizard-steps/steps-permit-review-authenticated.component';

@Component({
	selector: 'app-permit-wizard-authenticated-renewal',
	template: `
		<div class="row">
			<div class="col-12">
				<mat-stepper
					linear
					labelPosition="bottom"
					[orientation]="orientation"
					(selectionChange)="onStepSelectionChange($event)"
					#stepper
				>
					<mat-step [completed]="step1Complete">
						<ng-template matStepLabel>Permit Details</ng-template>
						<app-steps-permit-details-new
							(childNextStep)="onChildNextStep()"
							(saveAndExit)="onSaveAndExit()"
							(nextReview)="onGoToReview()"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-details-new>
					</mat-step>

					<mat-step [completed]="step2Complete">
						<ng-template matStepLabel>Purpose & Rationale</ng-template>
						<app-steps-permit-purpose-authenticated
							(childNextStep)="onChildNextStep()"
							(saveAndExit)="onSaveAndExit()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-purpose-authenticated>
					</mat-step>

					<mat-step [completed]="step3Complete">
						<ng-template matStepLabel>Identification</ng-template>
						<app-steps-permit-identification-authenticated
							(childNextStep)="onChildNextStep()"
							(saveAndExit)="onSaveAndExit()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-identification-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review & Confirm</ng-template>
						<app-steps-permit-review-authenticated
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextPayStep)="onNextPayStep()"
							(scrollIntoView)="onScrollIntoView()"
							(goToStep)="onGoToStep($event)"
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
})
export class PermitWizardAuthenticatedRenewalComponent extends BaseWizardComponent implements OnInit, AfterViewInit {
	readonly STEP_PERMIT_DETAILS = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_PURPOSE_AND_RATIONALE = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	@ViewChild(StepsPermitDetailsNewComponent)
	stepPermitDetailsComponent!: StepsPermitDetailsNewComponent;

	@ViewChild(StepsPermitPurposeAuthenticatedComponent)
	stepPurposeComponent!: StepsPermitPurposeAuthenticatedComponent;

	@ViewChild(StepsPermitIdentificationAuthenticatedComponent)
	stepIdentificationComponent!: StepsPermitIdentificationAuthenticatedComponent;

	@ViewChild(StepsPermitReviewAuthenticatedComponent)
	stepReviewComponent!: StepsPermitReviewAuthenticatedComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private dialog: MatDialog,
		private authenticationService: AuthenticationService,
		private hotToastService: HotToastService,
		private permitApplicationService: PermitApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		if (!this.permitApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
		}

		this.updateCompleteStatus();
	}

	ngAfterViewInit(): void {
		if (this.step3Complete) {
			this.stepper.selectedIndex = this.STEP_REVIEW;
		} else if (this.step2Complete) {
			this.stepper.selectedIndex = this.STEP_IDENTIFICATION;
		} else if (this.step1Complete) {
			this.stepper.selectedIndex = this.STEP_PURPOSE_AND_RATIONALE;
		}
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_PERMIT_DETAILS:
				this.stepPermitDetailsComponent?.onGoToFirstStep();
				break;
			case this.STEP_PURPOSE_AND_RATIONALE:
				this.stepPurposeComponent?.onGoToFirstStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW:
				this.stepReviewComponent?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_PERMIT_DETAILS:
				this.stepPermitDetailsComponent?.onGoToLastStep();
				break;
			case this.STEP_PURPOSE_AND_RATIONALE:
				this.stepPurposeComponent?.onGoToLastStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (this.permitApplicationService.isAutoSave()) {
			this.permitApplicationService.saveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					this.permitApplicationService.hasValueChanged = false;

					this.hotToastService.success('Permit information has been saved');

					if (stepper?.selected) stepper.selected.completed = true;
					stepper.next();

					switch (stepper.selectedIndex) {
						case this.STEP_PERMIT_DETAILS:
							this.stepPermitDetailsComponent?.onGoToFirstStep();
							break;
						case this.STEP_PURPOSE_AND_RATIONALE:
							this.stepPurposeComponent?.onGoToFirstStep();
							break;
						case this.STEP_IDENTIFICATION:
							this.stepIdentificationComponent?.onGoToFirstStep();
							break;
					}
				},
				error: (error: HttpErrorResponse) => {
					// only 403s will be here as an error
					if (error.status == 403) {
						this.handleDuplicateLicence();
					}
				},
			});
		} else {
			if (stepper?.selected) stepper.selected.completed = true;
			stepper.next();
		}
	}

	onNextPayStep(): void {
		this.permitApplicationService.submitPermitAuthenticated().subscribe({
			next: (_resp: any) => {
				this.hotToastService.success('Your permit renewal has been successfully submitted');
				this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
				this.hotToastService.error('An error occurred during the save. Please try again.');
			},
		});
	}

	// private payNow(licenceAppId: string): void {
	// 	this.commonApplicationService.payNow(licenceAppId,  `Payment for Case ID: ${application.applicationNumber}`);
	// }

	onGoToStep(step: number) {
		this.stepPermitDetailsComponent?.onGoToFirstStep();
		this.stepPurposeComponent?.onGoToFirstStep();
		this.stepIdentificationComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onSaveAndExit() {
		if (!this.authenticationService.isLoggedIn()) {
			this.exitAndLoseChanges();
			return;
		}

		this.permitApplicationService.saveLicenceStepAuthenticated().subscribe({
			next: (_resp: any) => {
				this.permitApplicationService.hasValueChanged = false;

				this.hotToastService.success('Licence information has been saved');
				this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
			},
			error: (error: HttpErrorResponse) => {
				// only 403s will be here as an error
				if (error.status == 403) {
					this.handleDuplicateLicence();
				}
			},
		});
	}

	private exitAndLoseChanges() {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to leave this application? All of your data will be lost.',
			actionText: 'Yes',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.router.navigate([AppRoutes.LANDING]);
				}
			});
	}

	onGoToReview() {
		if (this.permitApplicationService.isAutoSave()) {
			this.permitApplicationService.saveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					this.permitApplicationService.hasValueChanged = false;
					this.updateCompleteStatus();

					this.hotToastService.success('Licence information has been saved');

					setTimeout(() => {
						// hack... does not navigate without the timeout
						this.stepper.selectedIndex = this.STEP_REVIEW;
					}, 250);
				},
				error: (error: HttpErrorResponse) => {
					// only 403s will be here as an error
					if (error.status == 403) {
						this.handleDuplicateLicence();
					}
				},
			});
		} else {
			this.updateCompleteStatus();
			this.stepper.selectedIndex = this.STEP_REVIEW;
		}
	}

	onChildNextStep() {
		if (this.permitApplicationService.isAutoSave()) {
			this.permitApplicationService.saveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					this.permitApplicationService.hasValueChanged = false;
					this.hotToastService.success('Licence information has been saved');
					this.goToChildNextStep();
				},
				error: (error: HttpErrorResponse) => {
					// only 403s will be here as an error
					if (error.status == 403) {
						this.handleDuplicateLicence();
					}
				},
			});
		} else {
			this.goToChildNextStep();
		}
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.permitApplicationService.isStepPermitDetailsComplete();
		this.step2Complete = this.permitApplicationService.isStepPurposeAndRationaleComplete();
		this.step3Complete = this.permitApplicationService.isStepIdentificationComplete();

		// console.debug('iscomplete', this.step1Complete, this.step2Complete, this.step3Complete);
	}

	private handleDuplicateLicence(): void {
		const data: DialogOptions = {
			icon: 'error',
			title: 'Confirmation',
			message:
				'You already have the same kind of licence or licence application. Do you want to edit this licence information or return to your list?',
			actionText: 'Edit',
			cancelText: 'Go back',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (!response) {
					this.router.navigate([LicenceApplicationRoutes.pathUserApplications()]);
				}
			});
	}

	private goToChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_PERMIT_DETAILS:
				this.stepPermitDetailsComponent?.onGoToNextStep();
				break;
			case this.STEP_PURPOSE_AND_RATIONALE:
				this.stepPurposeComponent?.onGoToNextStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToNextStep();
				break;
		}
		this.updateCompleteStatus();
	}
}
