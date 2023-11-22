import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { LicenceStepperStepComponent } from '../../licence-application.helper';
import { LicenceApplicationService } from '../../licence-application.service';
import { DogsAuthorizationComponent } from '../dogs-authorization.component';
import { LicenceAccessCodeComponent } from '../licence-access-code.component';
import { LicenceCategoryComponent } from '../licence-category.component';
import { LicenceExpiredComponent } from '../licence-expired.component';
import { LicenceTermComponent } from '../licence-term.component';
import { RestraintsAuthorizationComponent } from '../restraints-authorization.component';
import { SoleProprietorComponent } from '../sole-proprietor.component';

@Component({
	selector: 'app-step-licence-selection',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-sole-proprietor></app-sole-proprietor>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
						<!-- <button mat-stroked-button color="primary" class="large mb-2" *ngIf="licenceAppId" (click)="onCancel()">
							Cancel
						</button> -->
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_SOLE_PROPRIETOR)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-checklist></app-checklist>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-licence-expired></app-licence-expired>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_LICENCE_EXPIRED)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_LICENCE_EXPIRED)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_LICENCE_EXPIRED)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-licence-category></app-licence-category>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_LICENCE_CATEGORY)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_LICENCE_CATEGORY)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_LICENCE_CATEGORY)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepDogsAndRestraints">
				<app-restraints-authorization></app-restraints-authorization>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_RESTRAINTS)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_RESTRAINTS)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_RESTRAINTS)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepDogsAndRestraints">
				<app-dogs-authorization></app-dogs-authorization>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_DOGS)" *ngIf="isLoggedIn">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_DOGS)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_DOGS)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-licence-term></app-licence-term>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_LICENCE_TERM)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_LICENCE_TERM)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_LICENCE_TERM)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepLicenceSelectionComponent implements OnInit, OnDestroy, LicenceStepperStepComponent {
	readonly STEP_SOLE_PROPRIETOR = '1';
	readonly STEP_ACCESS_CODE = '2';
	readonly STEP_LICENCE_EXPIRED = '5';
	readonly STEP_LICENCE_CATEGORY = '6';
	readonly STEP_DOGS = '8';
	readonly STEP_RESTRAINTS = '9';
	readonly STEP_LICENCE_TERM = '7';

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isLoggedIn = false;
	isFormValid = false;
	// licenceAppId: string | null = null;

	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() childNextStep: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() saveAndExit: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() nextReview: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild(SoleProprietorComponent)
	soleProprietorComponent!: SoleProprietorComponent;

	@ViewChild(LicenceAccessCodeComponent)
	licenceAccessCodeComponent!: LicenceAccessCodeComponent;

	@ViewChild(LicenceExpiredComponent)
	licenceExpiredComponent!: LicenceExpiredComponent;

	@ViewChild(LicenceCategoryComponent)
	licenceCategoryComponent!: LicenceCategoryComponent;

	@ViewChild(RestraintsAuthorizationComponent)
	restraintsComponent!: RestraintsAuthorizationComponent;

	@ViewChild(DogsAuthorizationComponent)
	dogsComponent!: DogsAuthorizationComponent;

	@ViewChild(LicenceTermComponent)
	licenceTermComponent!: LicenceTermComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	categorySecurityGuardFormGroup: FormGroup = this.licenceApplicationService.categorySecurityGuardFormGroup;

	constructor(
		private authProcessService: AuthProcessService,
		private router: Router,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.isFormValid = this.licenceApplicationService.licenceModelFormGroup.valid;
		// this.licenceAppId = this.licenceApplicationService.licenceModelFormGroup.value.licenceAppId;

		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				this.isFormValid = this.licenceApplicationService.licenceModelFormGroup.valid;
				//TODO hide previous when already saved licence
				// console.log('xxxxxxxxxxxxx', this.licenceApplicationService.licenceModelFormGroup);
				// this.licenceAppId = this.licenceApplicationService.licenceModelFormGroup.controls['licenceAppId'].value;
				//
			});

		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
			(isLoggedIn: boolean) => {
				this.isLoggedIn = isLoggedIn;
			}
		);
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	onStepNext(formNumber: string): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.nextStepperStep.emit(true);
	}

	onSaveAndExit(formNumber: string): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.saveAndExit.emit(true);
	}

	onNextReview(formNumber: string): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.nextReview.emit(true);
	}

	onStepPrevious(): void {
		this.router.navigate([
			LicenceApplicationRoutes.pathSecurityWorkerLicence(LicenceApplicationRoutes.APPLICATION_TYPE),
		]);
	}

	onCancel(): void {
		this.router.navigate([LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_UNAUTH)]);
	}

	onFormValidNextStep(formNumber: string): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.childNextStep.emit(true);
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	onGoToNextStep() {
		this.childstepper.next();
	}

	onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
	}

	onGoToLastStep() {
		this.childstepper.selectedIndex = this.childstepper.steps.length - 1;
	}

	private dirtyForm(step: string): boolean {
		switch (step) {
			case this.STEP_SOLE_PROPRIETOR:
				return this.soleProprietorComponent.isFormValid();
			case this.STEP_ACCESS_CODE:
				return this.licenceAccessCodeComponent.isFormValid();
			case this.STEP_LICENCE_EXPIRED:
				return this.licenceExpiredComponent.isFormValid();
			case this.STEP_LICENCE_CATEGORY:
				return this.licenceCategoryComponent.isFormValid();
			case this.STEP_RESTRAINTS:
				return this.restraintsComponent.isFormValid();
			case this.STEP_DOGS:
				return this.dogsComponent.isFormValid();
			case this.STEP_LICENCE_TERM:
				return this.licenceTermComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get showStepDogsAndRestraints(): boolean {
		return this.categorySecurityGuardFormGroup.get('isInclude')?.value;
	}
}
