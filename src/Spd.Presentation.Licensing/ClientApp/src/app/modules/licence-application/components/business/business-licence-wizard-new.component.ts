import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { BizTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { BusinessApplicationService } from '../../services/business-application.service';
import { StepsBusinessLicenceContactInformationNewComponent } from './steps-business-licence-contact-information-new.component';
import { StepsBusinessLicenceControllingMembersNewComponent } from './steps-business-licence-controlling-members-new.component';
import { StepsBusinessLicenceInformationNewComponent } from './steps-business-licence-information-new.component';
import { StepsBusinessLicenceReviewComponent } from './steps-business-licence-review.component';
import { StepsBusinessLicenceSelectionNewComponent } from './steps-business-licence-selection-new.component';

@Component({
	selector: 'app-business-licence-wizard-new',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Business Information</ng-template>
				<app-steps-business-licence-information-new
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
				></app-steps-business-licence-information-new>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Licence Selection</ng-template>
				<app-steps-business-licence-selection-new
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
				></app-steps-business-licence-selection-new>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Contact Information</ng-template>
				<app-steps-business-licence-contact-information-new
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-business-licence-contact-information-new>
			</mat-step>

			<mat-step [completed]="step4Complete" *ngIf="!isBusinessLicenceSoleProprietor">
				<ng-template matStepLabel>Controlling Members & Employees</ng-template>
				<app-steps-business-licence-controlling-members-new
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-business-licence-controlling-members-new>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-business-licence-review
					(saveAndExit)="onSaveAndExit()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(nextPayStep)="onNextPayStep()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-business-licence-review>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Pay</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class BusinessLicenceWizardNewComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_BUSINESS_INFORMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_SELECTION = 1;
	readonly STEP_CONTACT_INFORMATION = 2;
	readonly STEP_CONTROLLING_MEMBERS = 3;
	readonly STEP_REVIEW_AND_CONFIRM = 4;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	isFormValid = false;
	showSaveAndExit = false;

	isBusinessLicenceSoleProprietor = false;
	private businessModelValueChangedSubscription!: Subscription;

	@ViewChild(StepsBusinessLicenceInformationNewComponent)
	stepsBusinessInformationComponent!: StepsBusinessLicenceInformationNewComponent;
	@ViewChild(StepsBusinessLicenceSelectionNewComponent)
	stepsLicenceSelectionComponent!: StepsBusinessLicenceSelectionNewComponent;
	@ViewChild(StepsBusinessLicenceContactInformationNewComponent)
	stepsContactInformationComponent!: StepsBusinessLicenceContactInformationNewComponent;
	@ViewChild(StepsBusinessLicenceControllingMembersNewComponent)
	stepsControllingMembersComponent!: StepsBusinessLicenceControllingMembersNewComponent;
	@ViewChild(StepsBusinessLicenceReviewComponent)
	stepsReviewAndConfirm!: StepsBusinessLicenceReviewComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
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
				const bizTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'businessInformationData.bizTypeCode'
				)?.value;

				this.isBusinessLicenceSoleProprietor =
					bizTypeCode === BizTypeCode.NonRegisteredSoleProprietor ||
					bizTypeCode === BizTypeCode.RegisteredSoleProprietor;

				this.isFormValid = _resp;

				this.showSaveAndExit = this.businessApplicationService.isAutoSave();

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.businessModelValueChangedSubscription) this.businessModelValueChangedSubscription.unsubscribe();
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_BUSINESS_INFORMATION:
				this.stepsBusinessInformationComponent?.onGoToFirstStep();
				break;
			case this.STEP_LICENCE_SELECTION:
				this.stepsLicenceSelectionComponent?.onGoToFirstStep();
				break;
			case this.STEP_CONTACT_INFORMATION:
				this.stepsContactInformationComponent?.onGoToFirstStep();
				break;
			case this.STEP_CONTROLLING_MEMBERS:
				// If Sole Proprietor biz type, this step is not the controlling members step,
				// but the review step
				if (this.isBusinessLicenceSoleProprietor) {
					this.stepsReviewAndConfirm?.onGoToFirstStep();
				} else {
					this.stepsControllingMembersComponent?.onGoToFirstStep();
				}
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
			case this.STEP_BUSINESS_INFORMATION:
				this.stepsBusinessInformationComponent?.onGoToLastStep();
				break;
			case this.STEP_LICENCE_SELECTION:
				this.stepsLicenceSelectionComponent?.onGoToLastStep();
				break;
			case this.STEP_CONTACT_INFORMATION:
				this.stepsContactInformationComponent?.onGoToLastStep();
				break;
			case this.STEP_CONTROLLING_MEMBERS:
				this.stepsControllingMembersComponent?.onGoToLastStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToLastStep();
				break;
		}
	}

	// onNextPayStep(): void {
	// 	this.permitApplicationService.submitPermit().subscribe({
	// 		next: (_resp: any) => {
	// 			this.hotToastService.success('Your licence has been successfully submitted');
	// 			this.router.navigateByUrl(LicenceApplicationRoutes.pathPermitAnonymous());
	// 		},
	// 		error: (error: any) => {
	// 			console.log('An error occurred during save', error);
	// 			this.hotToastService.error('An error occurred during the save. Please try again.');
	// 		},
	// 	});
	// }

	// private payNow(licenceAppId: string): void {
	// 	this.commonApplicationService.payNow(licenceAppId, `Payment for Case ID: ${application.applicationNumber}`);
	// }

	// onNextStepperStep(stepper: MatStepper): void {
	// 	if (stepper?.selected) stepper.selected.completed = true;
	// 	stepper.next();
	// }

	onNextStepperStep(stepper: MatStepper): void {
		this.saveStep(stepper);
	}

	onNextPayStep(): void {
		// TODO empty function
	}

	onGoToStep(step: number) {
		this.stepsBusinessInformationComponent?.onGoToFirstStep();
		this.stepsLicenceSelectionComponent?.onGoToFirstStep();
		this.stepsContactInformationComponent?.onGoToFirstStep();
		this.stepsControllingMembersComponent?.onGoToFirstStep();
		this.stepsReviewAndConfirm?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onGoToReview() {
		setTimeout(() => {
			// hack... does not navigate without the timeout
			this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
		}, 250);
	}

	onChildNextStep() {
		this.saveStep();
	}

	private saveStep(stepper?: MatStepper): void {
		console.log('saveStep isAutoSave', this.businessApplicationService.isAutoSave());

		if (this.businessApplicationService.isAutoSave()) {
			this.businessApplicationService.saveBusinessLicenceStep().subscribe({
				next: (_resp: any) => {
					this.businessApplicationService.hasValueChanged = false;

					this.hotToastService.success('Business Licence information has been saved');

					if (stepper) {
						if (stepper?.selected) stepper.selected.completed = true;
						stepper.next();
					} else {
						this.goToChildNextStep();
					}

					// switch (stepper.selectedIndex) {
					// 	case this.STEP_LICENCE_SELECTION:
					// 		this.stepLicenceSelectionComponent?.onGoToFirstStep();
					// 		break;
					// 	case this.STEP_IDENTIFICATION:
					// 		this.stepIdentificationComponent?.onGoToFirstStep();
					// 		break;
					// }
				},
				error: (error: HttpErrorResponse) => {
					// only 403s will be here as an error
					// if (error.status == 403) {
					// 	this.handleDuplicateLicence();
					// }
				},
			});
		} else {
			if (stepper) {
				if (stepper?.selected) stepper.selected.completed = true;
				stepper.next();
			} else {
				this.goToChildNextStep();
			}
		}
	}

	private goToChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_BUSINESS_INFORMATION:
				this.stepsBusinessInformationComponent?.onGoToNextStep();
				break;
			case this.STEP_LICENCE_SELECTION:
				this.stepsLicenceSelectionComponent?.onGoToNextStep();
				break;
			case this.STEP_CONTACT_INFORMATION:
				this.stepsContactInformationComponent?.onGoToNextStep();
				break;
			case this.STEP_CONTROLLING_MEMBERS:
				this.stepsControllingMembersComponent?.onGoToNextStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToNextStep();
				break;
		}
	}

	onSaveAndExit(): void {
		if (!this.businessApplicationService.isSaveAndExit()) {
			return;
		}

		this.businessApplicationService.saveBusinessLicenceStep().subscribe({
			next: (_resp: any) => {
				this.businessApplicationService.hasValueChanged = false;

				this.hotToastService.success(
					'Your application has been successfully saved. Please note that inactive applications will expire in 30 days'
				);

				this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessApplications());
			},
			error: (error: HttpErrorResponse) => {
				// only 403s will be here as an error
				// if (error.status == 403) {
				// 	this.handleDuplicateLicence();
				// }
			},
		});
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.businessApplicationService.isStepBackgroundInformationComplete();
		this.step2Complete = this.businessApplicationService.isStepLicenceSelectionComplete();
		this.step3Complete = this.businessApplicationService.isStepContactInformationComplete();
		this.step4Complete = this.businessApplicationService.isStepControllingMembersAndEmployeesComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}
}
