import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { ApplicationService } from '@app/core/services/application.service';
import { ControllingMembersService } from '@app/core/services/controlling-members.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'app-controlling-members-wizard-anonymous-renew',
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
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Citizenship & Residency</ng-template>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Background</ng-template>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review</ng-template>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Submit</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class ControllingMembersWizardAnonymousRenewComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_PERSONAL_INFORMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_CITIZENSHIP = 1;
	readonly STEP_BACKGROUND = 2;
	readonly STEP_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	isFormValid = false;
	showSaveAndExit = true;

	applicationTypeCode!: ApplicationTypeCode;

	private controllingMembersModelValueChangedSubscription!: Subscription;

	// @ViewChild(StepsBusinessLicenceInformationComponent)
	// stepsBusinessInformationComponent!: StepsBusinessLicenceInformationComponent;
	// @ViewChild(StepsBusinessLicenceSelectionComponent)
	// stepsLicenceSelectionComponent!: StepsBusinessLicenceSelectionComponent;
	// @ViewChild(StepsBusinessLicenceContactInformationComponent)
	// stepsContactInformationComponent!: StepsBusinessLicenceContactInformationComponent;
	// @ViewChild(StepsBusinessLicenceControllingMembersComponent)
	// stepsControllingMembersComponent!: StepsBusinessLicenceControllingMembersComponent;
	// @ViewChild(StepsBusinessLicenceReviewComponent)
	// stepsReviewAndConfirm!: StepsBusinessLicenceReviewComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
		private commonApplicationService: ApplicationService,
		private controllingMembersService: ControllingMembersService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		// this.controllingMembersModelValueChangedSubscription = this.businessApplicationService.controllingMembersModelValueChanges$.subscribe(
		// 	(_resp: boolean) => {
		// 		this.workerLicenceTypeCode = this.businessApplicationService.controllingMembersModelFormGroup.get(
		// 			'workerLicenceTypeData.workerLicenceTypeCode'
		// 		)?.value;
		// 		this.applicationTypeCode = this.businessApplicationService.controllingMembersModelFormGroup.get(
		// 			'applicationTypeData.applicationTypeCode'
		// 		)?.value;
		// 		this.bizTypeCode = this.businessApplicationService.controllingMembersModelFormGroup.get(
		// 			'businessInformationData.bizTypeCode'
		// 		)?.value;

		// 		this.isBusinessLicenceSoleProprietor = this.businessApplicationService.controllingMembersModelFormGroup.get(
		// 			'isBusinessLicenceSoleProprietor'
		// 		)?.value;

		// 		const membersWithoutSwl = this.businessApplicationService.controllingMembersModelFormGroup.get(
		// 			'controllingMembersData.membersWithoutSwl'
		// 		)?.value;
		// 		this.nonSwlControllingMembersExist = membersWithoutSwl?.length > 0;

		// 		this.isFormValid = _resp;

		// 		this.updateCompleteStatus();
		// 	}
		// );
	}

	ngOnDestroy() {
		if (this.controllingMembersModelValueChangedSubscription)
			this.controllingMembersModelValueChangedSubscription.unsubscribe();
	}

	// override onStepSelectionChange(event: StepperSelectionEvent) {
	// 	switch (event.selectedIndex) {
	// 		case this.STEP_BUSINESS_INFORMATION:
	// 			this.stepsBusinessInformationComponent?.onGoToFirstStep();
	// 			break;
	// 		case this.STEP_LICENCE_SELECTION:
	// 			this.stepsLicenceSelectionComponent?.onGoToFirstStep();
	// 			break;
	// 		case this.STEP_CONTACT_INFORMATION:
	// 		case this.STEP_REVIEW_AND_CONFIRM_SOLE_PROPRIETOR:
	// 			if (this.isBusinessLicenceSoleProprietor) {
	// 				this.stepsReviewAndConfirm?.onGoToFirstStep();
	// 			} else {
	// 				this.stepsContactInformationComponent?.onGoToFirstStep();
	// 			}
	// 			break;
	// 		case this.STEP_CONTROLLING_MEMBERS:
	// 			// If Sole Proprietor biz type, this step is not the controlling members step,
	// 			// but the review step
	// 			if (this.isBusinessLicenceSoleProprietor) {
	// 				this.stepsReviewAndConfirm?.onGoToFirstStep();
	// 			} else {
	// 				this.stepsControllingMembersComponent?.onGoToFirstStep();
	// 			}
	// 			break;
	// 		case this.STEP_REVIEW_AND_CONFIRM:
	// 			this.stepsReviewAndConfirm?.onGoToFirstStep();
	// 			break;
	// 	}

	// 	super.onStepSelectionChange(event);
	// }

	// onPreviousStepperStep(stepper: MatStepper): void {
	// 	stepper.previous();

	// 	switch (stepper.selectedIndex) {
	// 		case this.STEP_BUSINESS_INFORMATION:
	// 			this.stepsBusinessInformationComponent?.onGoToLastStep();
	// 			break;
	// 		case this.STEP_LICENCE_SELECTION:
	// 			this.stepsLicenceSelectionComponent?.onGoToLastStep();
	// 			break;
	// 		case this.STEP_CONTACT_INFORMATION:
	// 		case this.STEP_REVIEW_AND_CONFIRM_SOLE_PROPRIETOR:
	// 			if (this.isBusinessLicenceSoleProprietor) {
	// 				this.stepsReviewAndConfirm?.onGoToLastStep();
	// 			} else {
	// 				this.stepsContactInformationComponent?.onGoToLastStep();
	// 			}
	// 			break;
	// 		case this.STEP_CONTROLLING_MEMBERS:
	// 			this.stepsControllingMembersComponent?.onGoToLastStep();
	// 			break;
	// 		case this.STEP_REVIEW_AND_CONFIRM:
	// 			this.stepsReviewAndConfirm?.onGoToLastStep();
	// 			break;
	// 	}
	// }

	// onNextPayStep(): void {
	// 	this.businessApplicationService.submitBusinessLicenceNew().subscribe({
	// 		next: (resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
	// 			this.hotToastService.success('Your business licence has been successfully submitted');
	// 			this.payNow(resp.body.licenceAppId!);
	// 		},
	// 		error: (error: any) => {
	// 			console.log('An error occurred during save', error);
	// 		},
	// 	});
	// }

	// onNextStepperStep(stepper: MatStepper): void {
	// 	this.saveStep(stepper);
	// }

	// onGoToStep(step: number) {
	// 	this.stepsBusinessInformationComponent?.onGoToFirstStep();
	// 	this.stepsLicenceSelectionComponent?.onGoToFirstStep();
	// 	this.stepsContactInformationComponent?.onGoToFirstStep();
	// 	this.stepsControllingMembersComponent?.onGoToFirstStep();
	// 	this.stepsReviewAndConfirm?.onGoToFirstStep();
	// 	this.stepper.selectedIndex = step;
	// }

	// onGoToReview() {
	// 	if (this.businessApplicationService.isAutoSave()) {
	// 		this.businessApplicationService.partialSaveBusinessLicenceStep().subscribe({
	// 			next: (_resp: any) => {
	// 				setTimeout(() => {
	// 					// hack... does not navigate without the timeout
	// 					this.goToReviewStep();
	// 				}, 250);
	// 			},
	// 			error: (error: HttpErrorResponse) => {
	// 				this.handlePartialSaveError(error);
	// 			},
	// 		});
	// 	} else {
	// 		this.goToReviewStep();
	// 	}
	// }

	// onChildNextStep() {
	// 	this.saveStep();
	// }

	// onSaveAndExit(): void {
	// 	if (!this.businessApplicationService.isSaveAndExit()) {
	// 		return;
	// 	}

	// 	this.businessApplicationService.partialSaveBusinessLicenceStep(true).subscribe({
	// 		next: (_resp: any) => {
	// 			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
	// 		},
	// 		error: (error: HttpErrorResponse) => {
	// 			this.handlePartialSaveError(error);
	// 		},
	// 	});
	// }

	// private saveStep(stepper?: MatStepper): void {
	// 	if (this.businessApplicationService.isAutoSave()) {
	// 		this.businessApplicationService.partialSaveBusinessLicenceStep().subscribe({
	// 			next: (_resp: any) => {
	// 				if (stepper) {
	// 					if (stepper?.selected) stepper.selected.completed = true;
	// 					stepper.next();
	// 				} else {
	// 					this.goToChildNextStep();
	// 				}
	// 			},
	// 			error: (error: HttpErrorResponse) => {
	// 				this.handlePartialSaveError(error);
	// 			},
	// 		});
	// 	} else if (stepper) {
	// 		if (stepper?.selected) stepper.selected.completed = true;
	// 		stepper.next();
	// 	} else {
	// 		this.goToChildNextStep();
	// 	}
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

	// private payNow(licenceAppId: string): void {
	// 	this.commonApplicationService.payNowBusinessLicence(licenceAppId, 'Payment for new Business Licence application');
	// }

	// private goToReviewStep(): void {
	// 	if (this.isBusinessLicenceSoleProprietor) {
	// 		this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM_SOLE_PROPRIETOR;
	// 	} else {
	// 		this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
	// 	}
	// }

	// private handlePartialSaveError(error: HttpErrorResponse): void {
	// 	// only 403s will be here as an error
	// 	if (error.status == 403) {
	// 		this.commonApplicationService.handleDuplicateLicence();
	// 	}
	// }

	// private updateCompleteStatus(): void {
	// 	this.step1Complete = this.businessApplicationService.isStepBackgroundInformationComplete();
	// 	this.step2Complete = this.businessApplicationService.isStepLicenceSelectionComplete();
	// 	this.step3Complete = this.businessApplicationService.isStepContactInformationComplete();
	// 	this.step4Complete = this.businessApplicationService.isStepControllingMembersAndEmployeesComplete();

	// 	console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	// }
}
