import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, BizLicAppCommandResponse, BizTypeCode, ServiceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routes';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsBusinessLicenceReviewComponent } from './steps-business-licence-review.component';
import { StepsBusinessLicenceSelectionComponent } from './steps-business-licence-selection.component';
import { StepsBusinessLicenceSwlSpInformationComponent } from './steps-business-licence-swl-sp-information.component';

@Component({
	selector: 'app-business-licence-wizard-new-swl-sole-proprietor',
	template: `
		@if (isInitialized$ | async) {
		  <mat-stepper
		    [selectedIndex]="4"
		    linear
		    labelPosition="bottom"
		    [orientation]="orientation"
		    (selectionChange)="onStepSelectionChange($event)"
		    #stepper
		    >
		    <mat-step [editable]="false" [completed]="true">
		      <ng-template matStepLabel
		        >Licence<ng-container *ngTemplateOutlet="StepNameSpace"></ng-container>Selection</ng-template
		        >
		      </mat-step>
		      <mat-step [editable]="false" [completed]="true">
		        <ng-template matStepLabel>Background</ng-template>
		      </mat-step>
		      <mat-step [editable]="false" [completed]="true">
		        <ng-template matStepLabel>Identification</ng-template>
		      </mat-step>
		      <mat-step [editable]="false" [completed]="true">
		        <ng-template matStepLabel
		          >Review<ng-container *ngTemplateOutlet="StepNameSpace"></ng-container>Worker Licence</ng-template
		          >
		        </mat-step>
		        <mat-step [completed]="step1Complete">
		          <ng-template matStepLabel
		            >Business<ng-container *ngTemplateOutlet="StepNameSpace"></ng-container>Information</ng-template
		            >
		            <app-steps-business-licence-swl-sp-information
		              [applicationTypeCode]="applicationTypeCode"
		              [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		              [showSaveAndExit]="true"
		              (childNextStep)="onChildNextStep()"
		              (saveAndExit)="onSaveAndExit()"
		              (cancelAndExit)="onReturnToSwl()"
		              (nextStepperStep)="onNextStepperStep(stepper)"
		              (scrollIntoView)="onScrollIntoView()"
		            ></app-steps-business-licence-swl-sp-information>
		          </mat-step>
		          <mat-step [completed]="step2Complete">
		            <ng-template matStepLabel
		              >Business<ng-container *ngTemplateOutlet="StepNameSpace"></ng-container>Selection</ng-template
		              >
		              <app-steps-business-licence-selection
		                [serviceTypeCode]="serviceTypeCode"
		                [applicationTypeCode]="applicationTypeCode"
		                [bizTypeCode]="bizTypeCode"
		                [isBusinessLicenceSoleProprietor]="true"
		                [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		                [showSaveAndExit]="true"
		                (childNextStep)="onChildNextStep()"
		                (saveAndExit)="onSaveAndExit()"
		                (cancelAndExit)="onReturnToSwl()"
		                (previousStepperStep)="onPreviousStepperStep(stepper)"
		                (nextStepperStep)="onNextStepperStep(stepper)"
		                (scrollIntoView)="onScrollIntoView()"
		              ></app-steps-business-licence-selection>
		            </mat-step>
		            <mat-step completed="false">
		              <ng-template matStepLabel
		                >Review<ng-container *ngTemplateOutlet="StepNameSpace"></ng-container>Business Licence</ng-template
		                >
		                <app-steps-business-licence-review
		                  [applicationTypeCode]="applicationTypeCode"
		                  [showSaveAndExit]="true"
		                  [isBusinessLicenceSoleProprietor]="true"
		                  [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		                  [isBusinessStakeholdersWithoutSwlExist]="false"
		                  (saveAndExit)="onSaveAndExit()"
		                  (previousStepperStep)="onPreviousStepperStep(stepper)"
		                  (nextPayStep)="onNextPayStep()"
		                  (cancelAndExit)="onReturnToSwl()"
		                  (scrollIntoView)="onScrollIntoView()"
		                  (goToStep)="onGoToStep($event)"
		                ></app-steps-business-licence-review>
		              </mat-step>
		              <mat-step completed="false">
		                <ng-template matStepLabel>Pay</ng-template>
		              </mat-step>
		            </mat-stepper>
		          }
		
		          <ng-template #StepNameSpace>
		            <!-- wrap label in large view -->
		            <span class="d-xxl-none">&nbsp;</span><span class="d-none d-xxl-inline"><br /></span>
		          </ng-template>
		`,
	styles: [],
	standalone: false,
})
export class BusinessLicenceWizardNewSwlSoleProprietorComponent
	extends BaseWizardComponent
	implements OnInit, OnDestroy
{
	isInitialized$ = this.businessApplicationService.waitUntilInitialized$;

	readonly STEP_BUSINESS_INFORMATION = 4; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_SELECTION = 5;
	readonly STEP_REVIEW_AND_CONFIRM = 6;

	step1Complete = false;
	step2Complete = false;

	isSoleProprietorSimultaneousSWLAnonymous!: boolean;
	isSoleProprietorSimultaneousFlow!: boolean;

	serviceTypeCode!: ServiceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;
	bizTypeCode!: BizTypeCode;

	private businessModelValueChangedSubscription!: Subscription;

	@ViewChild(StepsBusinessLicenceSwlSpInformationComponent)
	stepsBusinessInformationComponent!: StepsBusinessLicenceSwlSpInformationComponent;
	@ViewChild(StepsBusinessLicenceSelectionComponent)
	stepsLicenceSelectionComponent!: StepsBusinessLicenceSelectionComponent;
	@ViewChild(StepsBusinessLicenceReviewComponent)
	stepsReviewAndConfirm!: StepsBusinessLicenceReviewComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private dialog: MatDialog,
		private utilService: UtilService,
		private commonApplicationService: CommonApplicationService,
		private businessApplicationService: BusinessApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessLicence());
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.businessModelValueChangedSubscription = this.businessApplicationService.businessModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.serviceTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'serviceTypeData.serviceTypeCode'
				)?.value;
				this.applicationTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;
				this.bizTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'businessInformationData.bizTypeCode'
				)?.value;

				this.isSoleProprietorSimultaneousSWLAnonymous = this.businessApplicationService.businessModelFormGroup.get(
					'isSoleProprietorSimultaneousSWLAnonymous'
				)?.value;
				this.isSoleProprietorSimultaneousFlow = this.businessApplicationService.businessModelFormGroup.get(
					'isSoleProprietorSimultaneousFlow'
				)?.value;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.businessModelValueChangedSubscription) this.businessModelValueChangedSubscription.unsubscribe();
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

	onNextPayStep(): void {
		this.businessApplicationService.submitBusinessLicenceWithSwlCombinedFlowNew().subscribe({
			next: (resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
				this.utilService.toasterSuccess(
					'Your business licence and security worker licence have been successfully submitted'
				);
				this.payNow(resp.body.licenceAppId!);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
				this.utilService.toasterError('An error occurred during the save. Please try again.');
			},
		});
	}

	onNextStepperStep(stepper: MatStepper): void {
		this.saveStep(stepper);
	}

	onGoToStep(step: number) {
		this.stepsBusinessInformationComponent?.onGoToFirstStep();
		this.stepsLicenceSelectionComponent?.onGoToFirstStep();
		this.stepsReviewAndConfirm?.onGoToFirstStep();
		this.stepper.selectedIndex = step + this.STEP_BUSINESS_INFORMATION; // add offset
	}

	onChildNextStep() {
		this.saveStep();
	}

	onSaveAndExit(): void {
		if (!this.businessApplicationService.isSaveAndExit()) {
			return;
		}

		this.businessApplicationService.partialSaveBusinessLicenceWithSwlCombinedFlow(true).subscribe({
			next: (_resp: any) => {
				this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
			},
			error: (error: HttpErrorResponse) => {
				this.handlePartialSaveError(error);
			},
		});
	}

	onReturnToSwl(): void {
		const message = this.isSoleProprietorSimultaneousSWLAnonymous
			? '<strong>Are you sure you want to cancel your security business licence application?</strong><br><br>If you cancel this application, you will have to re-submit your Security Worker Licence application.'
			: '<strong>Are you sure you want to cancel your security business licence application?</strong><br><br>You will be returned to the portal to pay the application fee for your security worker licence.';

		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message,
			actionText: 'Cancel Application',
			cancelText: 'Continue Application',
			wideButtons: true,
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					if (this.isSoleProprietorSimultaneousSWLAnonymous) {
						this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
					} else {
						this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathReturnFromBusinessLicenceSoleProprietor());
					}
				}
			});
	}

	private getSelectedIndexComponent(index: number): any {
		switch (index) {
			case this.STEP_BUSINESS_INFORMATION:
				return this.stepsBusinessInformationComponent;
			case this.STEP_LICENCE_SELECTION:
				return this.stepsLicenceSelectionComponent;
			case this.STEP_REVIEW_AND_CONFIRM:
				return this.stepsReviewAndConfirm;
		}
		return null;
	}

	private saveStep(stepper?: MatStepper): void {
		if (this.businessApplicationService.isAutoSave()) {
			this.businessApplicationService.partialSaveBusinessLicenceWithSwlCombinedFlow().subscribe({
				next: (_resp: any) => {
					if (stepper) {
						if (stepper?.selected) stepper.selected.completed = true;
						stepper.next();
					} else {
						this.goToChildNextStep();
					}
				},
				error: (error: HttpErrorResponse) => {
					this.handlePartialSaveError(error);
				},
			});
		} else if (stepper) {
			if (stepper?.selected) stepper.selected.completed = true;
			stepper.next();
		} else {
			this.goToChildNextStep();
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
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToNextStep();
				break;
		}
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowBusinessLicence(licenceAppId);
	}

	private handlePartialSaveError(error: HttpErrorResponse): void {
		// only 403s will be here as an error
		if (error.status == 403) {
			this.commonApplicationService.handleDuplicateBusinessLicence();
		}
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.businessApplicationService.isStepBackgroundInformationComplete();
		this.step2Complete = this.businessApplicationService.isStepLicenceSelectionComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete);
	}
}
