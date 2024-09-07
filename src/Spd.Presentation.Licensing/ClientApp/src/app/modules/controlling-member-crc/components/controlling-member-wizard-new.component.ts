import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ControllingMemberCrcAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { StepsControllingMemberBackgroundComponent } from '@app/modules/controlling-member-crc/components/steps-controlling-member-background.component';
import { StepsControllingMemberCitizenshipResidencyComponent } from '@app/modules/controlling-member-crc/components/steps-controlling-member-citizenship-residency.component';
import { StepsControllingMemberPersonalInformationComponent } from '@app/modules/controlling-member-crc/components/steps-controlling-member-personal-information.component';
import { StepsControllingMemberReviewComponent } from '@app/modules/controlling-member-crc/components/steps-controlling-member-review.component';
import { ControllingMemberCrcRoutes } from '@app/modules/controlling-member-crc/controlling-member-crc-routing.module';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'app-controlling-member-wizard-new',
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
						[applicationTypeCode]="applicationTypeCode"
						[showSaveAndExit]="isLoggedIn"
						(saveAndExit)="onSaveAndExit()"
						(scrollIntoView)="onScrollIntoView()"
						(cancelAndExit)="onCancelAndExit()"
						(childNextStep)="onChildNextStep()"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(nextReview)="onGoToReview()"
					></app-steps-controlling-member-personal-information>
				</mat-step>

				<mat-step [completed]="step2Complete">
					<ng-template matStepLabel>Citizenship & Residency</ng-template>
					<app-steps-controlling-member-citizenship-residency
						[isFormValid]="isFormValid"
						[applicationTypeCode]="applicationTypeCode"
						[showSaveAndExit]="isLoggedIn"
						(saveAndExit)="onSaveAndExit()"
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
						[applicationTypeCode]="applicationTypeCode"
						[showSaveAndExit]="isLoggedIn"
						(saveAndExit)="onSaveAndExit()"
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
						[showSaveAndExit]="isLoggedIn"
						(saveAndExit)="onSaveAndExit()"
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
})
export class ControllingMemberWizardNewComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_PERSONAL_INFORMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_CITIZENSHIP_RESIDENCY = 1;
	readonly STEP_BACKGROUND = 2;
	readonly STEP_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	isFormValid = false;
	isLoggedIn = false;

	applicationTypeCode!: ApplicationTypeCode;

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
		private hotToastService: HotToastService,
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
			this.controllingMembersService.submitControllingMemberCrcNewAuthenticated().subscribe({
				next: (_resp: StrictHttpResponse<ControllingMemberCrcAppCommandResponse>) => {
					this.hotToastService.success('Your Criminal Record Check has been successfully submitted');

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

		this.controllingMembersService.submitControllingMemberCrcNewAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<ControllingMemberCrcAppCommandResponse>) => {
				this.hotToastService.success('Your Criminal Record Check has been successfully submitted');

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

	onSaveAndExit(): void {
		if (!this.controllingMembersService.isSaveAndExit()) {
			return;
		}

		this.controllingMembersService.partialSaveStep(true).subscribe((_resp: any) => {
			this.router.navigateByUrl(
				ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_SUBMISSION_RECEIVED),
				{ state: { isSubmit: BooleanTypeCode.No } }
			);
		});
	}

	onCancelAndExit(): void {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to cancel your Criminal Record Check application?',
			actionText: 'Yes',
			cancelText: 'Close',
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

	private goToNextStep() {} // TODO fill in

	private goToChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_PERSONAL_INFORMATION:
				this.stepsPersonalInformationComponent?.onGoToNextStep();
				break;
			case this.STEP_CITIZENSHIP_RESIDENCY:
				this.stepsCitizenshipResidencyComponent?.onGoToNextStep();
				break;
			case this.STEP_BACKGROUND:
				this.stepBackgroundComponent?.onGoToNextStep();
				break;
			case this.STEP_REVIEW:
				this.stepReviewComponent?.onGoToNextStep();
				break;
		}
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_PERSONAL_INFORMATION:
				this.stepsPersonalInformationComponent?.onGoToFirstStep();
				break;
			case this.STEP_CITIZENSHIP_RESIDENCY:
				this.stepsCitizenshipResidencyComponent?.onGoToFirstStep();
				break;
			case this.STEP_BACKGROUND:
				this.stepBackgroundComponent?.onGoToFirstStep();
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
			case this.STEP_PERSONAL_INFORMATION:
				this.stepsPersonalInformationComponent?.onGoToLastStep();
				break;
			case this.STEP_CITIZENSHIP_RESIDENCY:
				this.stepsCitizenshipResidencyComponent?.onGoToLastStep();
				break;
			case this.STEP_BACKGROUND:
				this.stepBackgroundComponent?.onGoToLastStep();
				break;
			case this.STEP_REVIEW:
				this.stepReviewComponent?.onGoToLastStep();
				break;
		}
	}

	onGoToReview() {
		setTimeout(() => {
			// hack... does not navigate without the timeout
			this.stepper.selectedIndex = this.STEP_REVIEW;
		}, 250);
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.controllingMembersService.isStepPersonalInformationComplete();
		this.step2Complete = this.controllingMembersService.isStepCitizenshipAndResidencyComplete();
		this.step3Complete = this.controllingMembersService.isStepBackgroundComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete);
	}
}
