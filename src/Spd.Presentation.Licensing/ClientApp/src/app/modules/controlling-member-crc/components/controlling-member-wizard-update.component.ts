import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ControllingMemberCrcAppCommandResponse, ServiceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { UtilService } from '@app/core/services/util.service';
import { StepsControllingMemberBackgroundComponent } from '@app/modules/controlling-member-crc/components/steps-controlling-member-background.component';
import { StepsControllingMemberCitizenshipResidencyComponent } from '@app/modules/controlling-member-crc/components/steps-controlling-member-citizenship-residency.component';
import { StepsControllingMemberPersonalInformationComponent } from '@app/modules/controlling-member-crc/components/steps-controlling-member-personal-information.component';
import { StepsControllingMemberReviewComponent } from '@app/modules/controlling-member-crc/components/steps-controlling-member-review.component';
import { ControllingMemberCrcRoutes } from '@app/modules/controlling-member-crc/controlling-member-crc-routes';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { Subscription, distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'app-controlling-member-wizard-update',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
			<mat-stepper
				linear
				labelPosition="bottom"
				[orientation]="orientation"
				(selectionChange)="onStepSelectionChange($event)"
				#stepper
			>
				<mat-step [completed]="step1Complete">
					<ng-template matStepLabel>Personal Information</ng-template>
					<app-steps-controlling-member-personal-information
						[isFormValid]="isFormValid"
						[applicationTypeCode]="applicationTypeCodeUpdate"
						[isLoggedIn]="isLoggedIn"
						[showSaveAndExit]="false"
						(scrollIntoView)="onScrollIntoView()"
						(cancelAndExit)="onCancelAndExit()"
						(childNextStep)="onChildNextStep()"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(nextReview)="onGoToReview()"
					></app-steps-controlling-member-personal-information>
				</mat-step>

				<mat-step [completed]="step2Complete">
					<ng-template matStepLabel>Identification</ng-template>
					<app-steps-controlling-member-citizenship-residency
						[isFormValid]="isFormValid"
						[applicationTypeCode]="applicationTypeCodeUpdate"
						[showSaveAndExit]="false"
						(scrollIntoView)="onScrollIntoView()"
						(cancelAndExit)="onCancelAndExit()"
						(childNextStep)="onChildNextStep()"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextReview)="onGoToReview()"
					></app-steps-controlling-member-citizenship-residency>
				</mat-step>

				<mat-step [completed]="step3Complete">
					<ng-template matStepLabel>Background</ng-template>
					<app-steps-controlling-member-background
						[isFormValid]="isFormValid"
						[applicationTypeCode]="applicationTypeCodeUpdate"
						[showSaveAndExit]="false"
						(scrollIntoView)="onScrollIntoView()"
						(cancelAndExit)="onCancelAndExit()"
						(childNextStep)="onChildNextStep()"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextReview)="onGoToReview()"
					></app-steps-controlling-member-background>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Review</ng-template>
					<app-steps-controlling-member-review
						(scrollIntoView)="onScrollIntoView()"
						[showSaveAndExit]="false"
						[applicationTypeCode]="applicationTypeCodeUpdate"
						(cancelAndExit)="onCancelAndExit()"
						(childNextStep)="onChildNextStep()"
						(nextStepperStep)="onSubmitNow()"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(goToStep)="onGoToStep($event)"
					></app-steps-controlling-member-review>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Submit</ng-template>
				</mat-step>
			</mat-stepper>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class ControllingMemberWizardUpdateComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_PERSONAL_INFORMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_CITIZENSHIP_RESIDENCY = 1;
	readonly STEP_BACKGROUND = 2;
	readonly STEP_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	isFormValid = false;
	isLoggedIn = false;

	applicationTypeCodeUpdate = ApplicationTypeCode.Update;

	private controllingMembersModelValueChangedSubscription!: Subscription;

	@ViewChild(StepsControllingMemberPersonalInformationComponent)
	stepsPersonalInformationComponent!: StepsControllingMemberPersonalInformationComponent;
	@ViewChild(StepsControllingMemberCitizenshipResidencyComponent)
	stepsCitizenshipResidencyComponent!: StepsControllingMemberCitizenshipResidencyComponent;
	@ViewChild(StepsControllingMemberBackgroundComponent)
	stepBackgroundComponent!: StepsControllingMemberBackgroundComponent;
	@ViewChild(StepsControllingMemberReviewComponent)
	stepReviewComponent!: StepsControllingMemberReviewComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private dialog: MatDialog,
		private utilService: UtilService,
		private commonApplicationService: CommonApplicationService,
		private authenticationService: AuthenticationService,
		private controllingMembersService: ControllingMemberCrcService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.controllingMembersService.initialized) {
			this.router.navigateByUrl(
				ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_INVITATION)
			);
			return;
		}

		this.isLoggedIn = this.authenticationService.isLoggedIn();

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.controllingMembersModelValueChangedSubscription =
			this.controllingMembersService.controllingMembersModelValueChanges$.subscribe((_resp: boolean) => {
				this.isFormValid = _resp;

				this.updateCompleteStatus();
			});
	}

	ngOnDestroy() {
		if (this.controllingMembersModelValueChangedSubscription) {
			this.controllingMembersModelValueChangedSubscription.unsubscribe();
		}
	}

	onChildNextStep() {
		if (this.controllingMembersService.isAutoSave()) {
			this.controllingMembersService.partialSaveStep(false).subscribe((_resp: any) => {
				this.goToChildNextStep();
			});
		} else {
			this.goToChildNextStep();
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (this.controllingMembersService.isAutoSave()) {
			this.controllingMembersService.partialSaveStep(false).subscribe((_resp: any) => {
				if (stepper?.selected) stepper.selected.completed = true;
				stepper.next();
			});
		} else {
			if (stepper?.selected) stepper.selected.completed = true;
			stepper.next();
		}
	}

	onSubmitNow(): void {
		if (this.isLoggedIn) {
			this.controllingMembersService.submitControllingMemberCrcUpdateAuthenticated().subscribe({
				next: (_resp: StrictHttpResponse<ControllingMemberCrcAppCommandResponse>) => {
					const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
						ServiceTypeCode.SecurityBusinessLicenceControllingMemberCrc,
						ApplicationTypeCode.Update
					);
					this.utilService.toasterSuccess(successMessage);

					this.router.navigateByUrl(
						ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_SUBMISSION_RECEIVED),
						{ state: { isSubmit: BooleanTypeCode.Yes } }
					);
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});
			return;
		}

		this.controllingMembersService.submitControllingMemberCrcUpdateAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<ControllingMemberCrcAppCommandResponse>) => {
				const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
					ServiceTypeCode.SecurityBusinessLicenceControllingMemberCrc,
					ApplicationTypeCode.Update
				);
				this.utilService.toasterSuccess(successMessage);

				this.router.navigateByUrl(
					ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_SUBMISSION_RECEIVED),
					{ state: { isSubmit: BooleanTypeCode.Yes } }
				);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	onCancelAndExit(): void {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message:
				'Are you sure you want to exit?<br><br>If you exit this application, you will have to restart your Criminal Record Check application.',
			actionText: 'Exit',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.router.navigateByUrl(
						ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_INVITATION)
					);
				}
			});
	}

	onGoToStep(step: number) {
		this.stepsPersonalInformationComponent?.onGoToFirstStep();
		this.stepsCitizenshipResidencyComponent?.onGoToFirstStep();
		this.stepBackgroundComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	private goToChildNextStep() {
		const component = this.getSelectedIndexComponent(this.stepper.selectedIndex);
		component?.onGoToNextStep();
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		const component = this.getSelectedIndexComponent(event.selectedIndex);
		component?.onGoToFirstStep();

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		const component = this.getSelectedIndexComponent(stepper.selectedIndex);
		component?.onGoToLastStep();
	}

	onGoToReview() {
		setTimeout(() => {
			// hack... does not navigate without the timeout
			this.stepper.selectedIndex = this.STEP_REVIEW;
		}, 250);
	}

	private getSelectedIndexComponent(index: number): any {
		switch (index) {
			case this.STEP_PERSONAL_INFORMATION:
				return this.stepsPersonalInformationComponent;
			case this.STEP_CITIZENSHIP_RESIDENCY:
				return this.stepsCitizenshipResidencyComponent;
			case this.STEP_BACKGROUND:
				return this.stepBackgroundComponent;
			case this.STEP_REVIEW:
				return this.stepReviewComponent;
		}
		return null;
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.controllingMembersService.isStepPersonalInformationComplete();
		this.step2Complete = this.controllingMembersService.isStepCitizenshipAndResidencyComplete();
		this.step3Complete = this.controllingMembersService.isStepBackgroundComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete);
	}
}
