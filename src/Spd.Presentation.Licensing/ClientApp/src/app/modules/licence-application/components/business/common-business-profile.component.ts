import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BizTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BusinessLicenceTypes } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { HotToastService } from '@ngneat/hot-toast';
import { CommonBusinessBcBranchesComponent } from './common-business-bc-branches.component';
import {
	LookupByLicenceNumberDialogData,
	ModalLookupByLicenceNumberComponent,
} from './modal-lookup-by-licence-number.component';

@Component({
	selector: 'app-common-business-profile',
	template: `
		<div class="row mt-3">
			<div class="col-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Business Information</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="mt-3">
							<section>
								<form [formGroup]="businessInformationFormGroup" novalidate>
									<div class="row">
										<div class="col-lg-6 col-md-12">
											<div class="mb-3">
												<ng-container *ngIf="isBusinessLicenceSoleProprietor">
													<app-alert type="info" icon="" [showBorder]="false">
														The name of your business must be your name, as it appears on your security worker licence
													</app-alert>
												</ng-container>
												<div class="text-primary-color fw-semibold">Legal Business Name</div>
												<div class="text-primary-color fs-5">{{ legalBusinessName.value | default }}</div>
											</div>
											<div class="mb-3">
												<div class="text-primary-color fw-semibold">
													Trade or 'Doing Business As' Name
													<mat-icon matTooltip="This is the name commonly used to refer to your business"
														>info</mat-icon
													>
												</div>

												<ng-container *ngIf="isBizTradeNameReadonly.value; else EditBizTradeName">
													<div class="text-primary-color fs-5">{{ bizTradeName.value | default }}</div>
												</ng-container>
												<ng-template #EditBizTradeName>
													<mat-form-field>
														<input
															matInput
															formControlName="bizTradeName"
															[errorStateMatcher]="matcher"
															maxlength="160"
														/>
													</mat-form-field>
												</ng-template>
											</div>
										</div>

										<div class="col-lg-6 col-md-12">
											<app-alert type="info" icon="" [showBorder]="false">
												If you are unsure of your business type, check your
												<a class="large" href="https://www.account.bcregistry.gov.bc.ca/decide-business" target="_blank"
													>BC Registries account</a
												>.
											</app-alert>
											<mat-form-field>
												<mat-label>Business Type</mat-label>
												<mat-select formControlName="bizTypeCode" [errorStateMatcher]="matcher">
													<mat-option *ngFor="let item of businessTypes; let i = index" [value]="item.code">
														{{ item.desc }}
													</mat-option>
												</mat-select>
												<mat-error *ngIf="businessInformationFormGroup.get('bizTypeCode')?.hasError('required')"
													>This is required</mat-error
												>
											</mat-form-field>
										</div>
									</div>

									<div *ngIf="isBusinessLicenceSoleProprietor" @showHideTriggerSlideAnimation>
										<mat-divider class="mat-divider-main my-3"></mat-divider>
										<div class="row mb-3">
											<div class="col-md-6 col-sm-12"><div class="text-minor-heading">Sole Proprietor</div></div>
											<div class="col-md-6 col-sm-12 text-end" *ngIf="!isReadonly">
												<button mat-flat-button color="primary" class="large w-auto" (click)="onLookupSoleProprietor()">
													Search for Sole Proprietor
												</button>
											</div>
										</div>

										<div class="my-2">
											<ng-container *ngIf="soleProprietorLicenceId.value; else SearchForSP">
												<app-alert type="success" icon="check_circle">
													<div class="row">
														<div class="col-lg-4 col-md-6 col-sm-12 mt-2 mt-lg-0">
															<div class="text-primary-color">Name</div>
															<div class="text-primary-color fs-5">{{ soleProprietorLicenceHolderName.value }}</div>
														</div>
														<div class="col-lg-4 col-md-6 col-sm-12 mt-2 mt-lg-0">
															<div class="text-primary-color">Security Worker Licence Number</div>
															<div class="text-primary-color fs-5">{{ soleProprietorLicenceNumber.value }}</div>
														</div>
														<div class="col-lg-2 col-md-6 col-sm-12 mt-2 mt-lg-0">
															<div class="text-primary-color">Expiry Date</div>
															<div class="text-primary-color fs-5">
																{{
																	soleProprietorLicenceExpiryDate.value | formatDate : constants.date.formalDateFormat
																}}
															</div>
														</div>
														<div class="col-lg-2 col-md-6 col-sm-12 mt-2 mt-lg-0">
															<div class="text-primary-color">Licence Status</div>
															<div class="text-primary-color fs-5 fw-bold">
																{{ soleProprietorLicenceStatusCode.value }}
															</div>
														</div>
													</div>
												</app-alert>
											</ng-container>
											<ng-template #SearchForSP>
												<app-alert type="warning" icon="">
													Search for a sole proprietor with a valid security worker licence
												</app-alert>
											</ng-template>

											<mat-error
												class="mat-option-error mb-4"
												*ngIf="
													(businessInformationFormGroup.get('soleProprietorLicenceId')?.dirty ||
														businessInformationFormGroup.get('soleProprietorLicenceId')?.touched) &&
													businessInformationFormGroup.get('soleProprietorLicenceId')?.invalid &&
													businessInformationFormGroup.get('soleProprietorLicenceId')?.hasError('required')
												"
											>
												A valid security worker licence must be selected
											</mat-error>

											<div
												class="col-12"
												*ngIf="
													(businessInformationFormGroup.dirty || businessInformationFormGroup.touched) &&
													businessInformationFormGroup.invalid &&
													!businessInformationFormGroup.get('soleProprietorLicenceId')?.hasError('required') &&
													businessInformationFormGroup.hasError('licencemustbeactive')
												"
											>
												<app-alert type="danger" icon="error">
													<div>
														You must have a valid security worker licence to apply for a sole proprietor business
														licence.
													</div>
													<div class="mt-2">
														To renew your security worker licence, visit
														<a href="https://www.google.ca" target="_blank">Security worker licencing</a>. Once you have
														your renewed licence, return to complete your business licence application.
													</div>
												</app-alert>
											</div>

											<div class="row">
												<div class="col-lg-4 col-md-7 col-sm-12">
													<mat-form-field>
														<mat-label>Email Address</mat-label>
														<input
															matInput
															formControlName="soleProprietorSwlEmailAddress"
															[errorStateMatcher]="matcher"
															placeholder="name@domain.com"
															maxlength="75"
														/>
														<mat-error
															*ngIf="
																businessInformationFormGroup.get('soleProprietorSwlEmailAddress')?.hasError('required')
															"
															>This is required</mat-error
														>
														<mat-error
															*ngIf="
																businessInformationFormGroup.get('soleProprietorSwlEmailAddress')?.hasError('email')
															"
															>Must be a valid email address</mat-error
														>
													</mat-form-field>
												</div>

												<div class="col-lg-4 col-md-5 col-sm-12">
													<mat-form-field>
														<mat-label>Phone Number</mat-label>
														<input
															matInput
															formControlName="soleProprietorSwlPhoneNumber"
															[errorStateMatcher]="matcher"
															maxlength="30"
															appPhoneNumberTransform
														/>
														<mat-error
															*ngIf="
																businessInformationFormGroup.get('soleProprietorSwlPhoneNumber')?.hasError('required')
															"
															>This is required</mat-error
														>
													</mat-form-field>
												</div>
											</div>
										</div>
									</div>
								</form>
							</section>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Mailing Address</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="mt-3">
							<div class="mb-4 text-primary-color">
								This address is from your Business BCeID. If you need to make any updates, please
								<a href="https://www.bceid.ca" target="_blank">visit BCeID</a>.
							</div>

							<section>
								<app-common-business-mailing-address
									[form]="businessMailingAddressFormGroup"
									[isWizardStep]="false"
									[isReadonly]="true"
									[isCheckboxReadOnly]="isReadonly"
								></app-common-business-mailing-address>
							</section>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>

			<div class="col-lg-6 col-md-12">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Business Address</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="mt-3">
							<div class="mb-4 text-primary-color">
								Provide your business address, if different from your mailing address
							</div>

							<ng-container *ngIf="isMailingTheSame; else mailingIsDifferentSection">
								<div class="mb-3">
									<mat-icon style="vertical-align: bottom;">label_important</mat-icon> The business address and mailing
									address are the same
								</div>
							</ng-container>
							<ng-template #mailingIsDifferentSection>
								<section>
									<app-common-address
										[form]="businessAddressFormGroup"
										[isWizardStep]="false"
										[isReadonly]="isReadonly"
									></app-common-address>
								</section>
							</ng-template>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>

			<div class="col-lg-6 col-md-12" *ngIf="!isBcBusinessAddress">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>B.C. Business Address</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="mt-3">
							<app-alert type="info" icon="" [showBorder]="false">
								Provide an address in British Columbia for document service
							</app-alert>

							<section>
								<app-common-address
									[form]="bcBusinessAddressFormGroup"
									[isWizardStep]="false"
									[isReadonly]="isReadonly"
								></app-common-address>
							</section>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>

			<div class="col-12" *ngIf="!isBusinessLicenceSoleProprietor">
				<mat-accordion>
					<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
						<mat-expansion-panel-header>
							<mat-panel-title>Branches in B.C.</mat-panel-title>
						</mat-expansion-panel-header>

						<div class="mt-3">
							<section>
								<app-common-business-bc-branches
									[form]="branchesInBcFormGroup"
									[isReadonly]="isReadonly"
								></app-common-business-bc-branches>
							</section>
						</div>
					</mat-expansion-panel>
				</mat-accordion>
			</div>
		</div>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CommonBusinessProfileComponent implements OnInit, LicenceChildStepperStepComponent {
	constants = SPD_CONSTANTS;
	matcher = new FormErrorStateMatcher();

	businessTypes = BusinessLicenceTypes;

	@Input() businessInformationFormGroup!: FormGroup;
	@Input() businessAddressFormGroup!: FormGroup;
	@Input() bcBusinessAddressFormGroup!: FormGroup;
	@Input() businessMailingAddressFormGroup!: FormGroup;
	@Input() branchesInBcFormGroup!: FormGroup;
	@Input() isReadonly = true;
	@Input() isBcBusinessAddress = true;

	@ViewChild(CommonBusinessBcBranchesComponent) businessBcBranchesComponent!: CommonBusinessBcBranchesComponent;

	constructor(private dialog: MatDialog, private hotToastService: HotToastService) {}

	ngOnInit(): void {
		if (this.isReadonly) {
			this.bizTypeCode.disable({ emitEvent: false });
			this.soleProprietorSwlEmailAddress.disable({ emitEvent: false });
			this.soleProprietorSwlPhoneNumber.disable({ emitEvent: false });
		} else {
			this.bizTypeCode.enable();
			this.soleProprietorSwlEmailAddress.enable();
			this.soleProprietorSwlPhoneNumber.enable();
		}
	}

	isFormValid(): boolean {
		this.businessInformationFormGroup.markAllAsTouched();

		const isValid1 = this.businessInformationFormGroup.valid;
		const isValid2 = this.isFormGroupValid(this.businessAddressFormGroup);
		const isValid3 = this.isBcBusinessAddress ? true : this.isFormGroupValid(this.bcBusinessAddressFormGroup);
		const isValid4 = this.isMailingTheSame ? true : this.isFormGroupValid(this.businessAddressFormGroup);
		const isValid5 = this.isBusinessLicenceSoleProprietor ? true : this.businessBcBranchesComponent.isFormValid();

		console.debug('[CommonBusinessProfileComponent] isFormValid', isValid1, isValid2, isValid3, isValid4, isValid5);

		return isValid1 && isValid2 && isValid3 && isValid4 && isValid5;
	}

	onLookupSoleProprietor(): void {
		const dialogOptions: LookupByLicenceNumberDialogData = {
			title: 'Select Sole Proprietor',
			subtitle: 'A sole proprietor must have a valid security worker licence',
			lookupWorkerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence,
			isExpiredLicenceSearch: false,
			isLoggedIn: true,
		};
		this.dialog
			.open(ModalLookupByLicenceNumberComponent, {
				width: '800px',
				data: dialogOptions,
				autoFocus: true,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				if (resp?.data) {
					this.businessInformationFormGroup.patchValue(
						{
							soleProprietorLicenceId: resp.data.licenceId,
							soleProprietorLicenceHolderName: resp.data.licenceHolderName,
							soleProprietorLicenceNumber: resp.data.licenceNumber,
							soleProprietorLicenceExpiryDate: resp.data.expiryDate,
							soleProprietorLicenceStatusCode: resp.data.licenceStatusCode,
						},
						{ emitEvent: false }
					);
					this.hotToastService.success('A sole proprietor was successfully selected');
				}
			});
	}

	private isFormGroupValid(form: FormGroup): boolean {
		form.markAllAsTouched();
		return form.valid;
	}

	get isMailingTheSame(): boolean {
		return this.businessMailingAddressFormGroup.get('isMailingTheSame')?.value ?? false;
	}

	get isBusinessLicenceSoleProprietor(): boolean {
		return (
			this.bizTypeCode.value === BizTypeCode.NonRegisteredSoleProprietor ||
			this.bizTypeCode.value === BizTypeCode.RegisteredSoleProprietor
		);
	}
	get legalBusinessName(): FormControl {
		return this.businessInformationFormGroup.get('legalBusinessName') as FormControl;
	}
	get bizTradeName(): FormControl {
		return this.businessInformationFormGroup.get('bizTradeName') as FormControl;
	}
	get isBizTradeNameReadonly(): FormControl {
		return this.businessInformationFormGroup.get('isBizTradeNameReadonly') as FormControl;
	}
	get bizTypeCode(): FormControl {
		return this.businessInformationFormGroup.get('bizTypeCode') as FormControl;
	}
	get soleProprietorLicenceId(): FormControl {
		return this.businessInformationFormGroup.get('soleProprietorLicenceId') as FormControl;
	}
	get soleProprietorLicenceHolderName(): FormControl {
		return this.businessInformationFormGroup.get('soleProprietorLicenceHolderName') as FormControl;
	}
	get soleProprietorLicenceNumber(): FormControl {
		return this.businessInformationFormGroup.get('soleProprietorLicenceNumber') as FormControl;
	}
	get soleProprietorLicenceExpiryDate(): FormControl {
		return this.businessInformationFormGroup.get('soleProprietorLicenceExpiryDate') as FormControl;
	}
	get soleProprietorLicenceStatusCode(): FormControl {
		return this.businessInformationFormGroup.get('soleProprietorLicenceStatusCode') as FormControl;
	}
	get soleProprietorSwlEmailAddress(): FormControl {
		return this.businessInformationFormGroup.get('soleProprietorSwlEmailAddress') as FormControl;
	}
	get soleProprietorSwlPhoneNumber(): FormControl {
		return this.businessInformationFormGroup.get('soleProprietorSwlPhoneNumber') as FormControl;
	}
}
