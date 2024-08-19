import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ControllingMemberCrcAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { ControllingMembersService } from '@app/core/services/controlling-members.service';
import { StepsControllingMemberBackgroundComponent } from '@app/modules/controlling-member-crc/shared/steps-controlling-member-background.component';
import { StepsControllingMemberCitizenshipResidencyComponent } from '@app/modules/controlling-member-crc/shared/steps-controlling-member-citizenship-residency.component';
import { StepsControllingMemberPersonalInformationComponent } from '@app/modules/controlling-member-crc/shared/steps-controlling-member-personal-information.component';
import { StepsControllingMemberReviewComponent } from '@app/modules/controlling-member-crc/shared/steps-controlling-member-review.component';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { ControllingMemberCrcRoutes } from '../controlling-member-crc-routing.module';

@Component({
	selector: 'app-controlling-member-wizard-anonymous-new',
	template: `
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
					[showSaveAndExit]="false"
					[applicationTypeCode]="applicationTypeCode"
					(scrollIntoView)="onScrollIntoView()"
					(cancelAndExit)="onCancelAndExit()"
					(childNextStep)="onChildNextStep()"
					(nextStepperStep)="onNextStepperStep(stepper)"
				></app-steps-controlling-member-personal-information>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Citizenship & Residency</ng-template>
				<app-steps-controlling-member-citizenship-residency
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					[applicationTypeCode]="applicationTypeCode"
					(scrollIntoView)="onScrollIntoView()"
					(cancelAndExit)="onCancelAndExit()"
					(childNextStep)="onChildNextStep()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
				></app-steps-controlling-member-citizenship-residency>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Background</ng-template>
				<app-steps-controlling-member-background
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					[applicationTypeCode]="applicationTypeCode"
					(scrollIntoView)="onScrollIntoView()"
					(cancelAndExit)="onCancelAndExit()"
					(childNextStep)="onChildNextStep()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
				></app-steps-controlling-member-background>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review</ng-template>
				<app-steps-controlling-member-review
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					[applicationTypeCode]="applicationTypeCode"
					(scrollIntoView)="onScrollIntoView()"
					(cancelAndExit)="onCancelAndExit()"
					(childNextStep)="onChildNextStep()"
					(nextStepperStep)="onSubmitNow()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
				></app-steps-controlling-member-review>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Submit</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class ControllingMemberWizardAnonymousNewComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_PERSONAL_INFORMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_CITIZENSHIP_RESIDENCY = 1;
	readonly STEP_BACKGROUND = 2;
	readonly STEP_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	isFormValid = false;
	showSaveAndExit = false;

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
		private controllingMembersService: ControllingMembersService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.controllingMembersModelValueChangedSubscription =
			this.controllingMembersService.controllingMembersModelValueChanges$.subscribe((_resp: boolean) => {
				// 		this.isFormValid = _resp;
				// 		this.updateCompleteStatus();
			});
	}

	ngOnDestroy() {
		if (this.controllingMembersModelValueChangedSubscription)
			this.controllingMembersModelValueChangedSubscription.unsubscribe();
	}

	onChildNextStep() {
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

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onSubmitNow(): void {
		this.controllingMembersService.submitControllingMemberCrcAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<ControllingMemberCrcAppCommandResponse>) => {
				this.hotToastService.success('Your Criminal Record Check has been successfully submitted');
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
						ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_LOGIN)
					);
				}
			});
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

	// onGoToStep(step: number) {
	// 	this.stepsBusinessInformationComponent?.onGoToFirstStep();
	// 	this.stepsLicenceSelectionComponent?.onGoToFirstStep();
	// 	this.stepsContactInformationComponent?.onGoToFirstStep();
	// 	this.stepsControllingMembersComponent?.onGoToFirstStep();
	// 	this.stepsReviewAndConfirm?.onGoToFirstStep();
	// 	this.stepper.selectedIndex = step;
	// }

	// onChildNextStep() {
	// 	this.saveStep();
	// }

	// private goToChildNextStep() {
	// 	switch (this.stepper.selectedIndex) {
	// 		case this.STEP_BUSINESS_INFORMATION:
	// 			this.stepsBusinessInformationComponent?.onGoToNextStep();
	// 			break;
	// 		case this.STEP_LICENCE_SELECTION:
	// 			this.stepsLicenceSelectionComponent?.onGoToNextStep();
	// 			break;
	// 		case this.STEP_CONTACT_INFORMATION:
	// 			this.stepsContactInformationComponent?.onGoToNextStep();
	// 			break;
	// 		case this.STEP_CONTROLLING_MEMBERS:
	// 			this.stepsControllingMembersComponent?.onGoToNextStep();
	// 			break;
	// 		case this.STEP_REVIEW_AND_CONFIRM:
	// 			this.stepsReviewAndConfirm?.onGoToNextStep();
	// 			break;
	// 	}
	// }

	// private updateCompleteStatus(): void {
	// 	this.step1Complete = this.controllingMembersService.isStepBackgroundInformationComplete();
	// 	this.step2Complete = this.controllingMembersService.isStepLicenceSelectionComplete();
	// 	this.step3Complete = this.controllingMembersService.isStepContactInformationComplete();
	// 	this.step4Complete = this.controllingMembersService.isStepControllingMembersAndEmployeesComplete();

	// 	console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	// }
}
