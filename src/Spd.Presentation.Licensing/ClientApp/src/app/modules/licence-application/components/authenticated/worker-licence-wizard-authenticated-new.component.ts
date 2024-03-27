import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routing.module';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { StepsWorkerLicenceSelectionComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/steps-worker-licence-selection.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged } from 'rxjs';
import { CommonApplicationService } from '../../services/common-application.service';
import { StepsWorkerLicenceIdentificationAuthenticatedComponent } from './worker-licence-wizard-steps/steps-worker-licence-identification-authenticated.component';
import { StepsWorkerLicenceReviewAuthenticatedComponent } from './worker-licence-wizard-steps/steps-worker-licence-review-authenticated.component';

@Component({
	selector: 'app-worker-licence-wizard-authenticated-new',
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
						<ng-template matStepLabel> Licence Selection </ng-template>
						<app-steps-worker-licence-selection
							(childNextStep)="onLicenceSelectionChildNextStep()"
							(saveAndExit)="onSaveAndExit()"
							(nextReview)="onGoToReview()"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-worker-licence-selection>
					</mat-step>

					<mat-step [completed]="step2Complete">
						<ng-template matStepLabel>Identification</ng-template>
						<app-steps-worker-licence-identification-authenticated
							(childNextStep)="onChildNextStep()"
							(saveAndExit)="onSaveAndExit()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-worker-licence-identification-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review & Confirm</ng-template>
						<app-steps-worker-licence-review-authenticated
							[applicationTypeCode]="applicationTypeCodeNew"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextPayStep)="onNextPayStep()"
							(scrollIntoView)="onScrollIntoView()"
							(goToStep)="onGoToStep($event)"
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
})
export class WorkerLicenceWizardAuthenticatedNewComponent extends BaseWizardComponent implements OnInit {
	applicationTypeCodeNew = ApplicationTypeCode.New;

	readonly STEP_LICENCE_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_IDENTIFICATION = 1;
	readonly STEP_REVIEW = 2;

	step1Complete = false;
	step2Complete = false;

	@ViewChild(StepsWorkerLicenceSelectionComponent)
	stepLicenceSelectionComponent!: StepsWorkerLicenceSelectionComponent;

	@ViewChild(StepsWorkerLicenceIdentificationAuthenticatedComponent)
	stepIdentificationComponent!: StepsWorkerLicenceIdentificationAuthenticatedComponent;

	@ViewChild(StepsWorkerLicenceReviewAuthenticatedComponent)
	stepReviewAuthenticatedComponent!: StepsWorkerLicenceReviewAuthenticatedComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private dialog: MatDialog,
		private authenticationService: AuthenticationService,
		private hotToastService: HotToastService,
		private licenceApplicationService: LicenceApplicationService,
		private commonApplicationService: CommonApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
		}

		this.updateCompleteStatus();
	}

	// ngAfterViewInit(): void {
	// if (this.step2Complete) {
	// 	this.stepper.selectedIndex = this.STEP_REVIEW;
	// } else if (this.step1Complete) {
	// 	this.stepper.selectedIndex = this.STEP_IDENTIFICATION;
	// }
	// }

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToFirstStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW:
				this.stepReviewAuthenticatedComponent?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToLastStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (this.licenceApplicationService.isAutoSave()) {
			this.licenceApplicationService.saveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					this.licenceApplicationService.hasValueChanged = false;

					this.hotToastService.success('Licence information has been saved');

					if (stepper?.selected) stepper.selected.completed = true;
					stepper.next();

					switch (stepper.selectedIndex) {
						case this.STEP_LICENCE_SELECTION:
							this.stepLicenceSelectionComponent?.onGoToFirstStep();
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
		this.licenceApplicationService.submitLicenceNewAuthenticated().subscribe({
			next: (_resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
				this.hotToastService.success('Your licence has been successfully submitted');
				this.payNow(_resp.body.licenceAppId!);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
				this.hotToastService.error('An error occurred during the save. Please try again.');
			},
		});
	}

	onGoToStep(step: number) {
		this.stepLicenceSelectionComponent?.onGoToFirstStep();
		this.stepIdentificationComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onSaveAndExit() {
		if (!this.authenticationService.isLoggedIn()) {
			this.exitAndLoseChanges();
			return;
		}

		this.licenceApplicationService.saveLicenceStepAuthenticated().subscribe({
			next: (_resp: any) => {
				this.licenceApplicationService.hasValueChanged = false;

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
		if (this.licenceApplicationService.isAutoSave()) {
			this.licenceApplicationService.saveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					this.licenceApplicationService.hasValueChanged = false;
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

	onLicenceSelectionChildNextStep(): void {
		const isStepToSave = this.stepLicenceSelectionComponent?.isStepToSave();
		if (isStepToSave) {
			this.onChildNextStep();
			return;
		}

		this.goToChildNextStep();
	}

	onChildNextStep() {
		if (this.licenceApplicationService.isAutoSave()) {
			this.licenceApplicationService.saveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					this.licenceApplicationService.hasValueChanged = false;
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
		this.step1Complete = this.licenceApplicationService.isStepLicenceSelectionComplete();
		this.step2Complete = this.licenceApplicationService.isStepIdentificationComplete();

		// console.debug('iscomplete', this.step1Complete, this.step2Complete);
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
			case this.STEP_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToNextStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToNextStep();
				break;
		}
		this.updateCompleteStatus();
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowAuthenticated(
			licenceAppId,
			'Payment for New Security Worker Licence Application'
		);
	}
}
