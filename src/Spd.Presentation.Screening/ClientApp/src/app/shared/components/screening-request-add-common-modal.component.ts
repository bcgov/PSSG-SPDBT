import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import {
	ApplicationInviteCreateRequest,
	ApplicationInvitePrepopulateDataResponse,
	ApplicationInvitesCreateRequest,
	ApplicationInvitesCreateResponse,
	BooleanTypeCode,
	MinistryResponse,
	ScreeningTypeCode,
	ServiceTypeCode,
} from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import {
	PayerPreferenceTypes,
	ScreeningTypes,
	SelectOptions,
	ServiceTypes,
} from 'src/app/core/code-types/model-desc.models';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { OptionsService } from 'src/app/core/services/options.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

export interface ScreeningRequestAddDialogData {
	portal: PortalTypeCode;
	orgId: string;
	isPsaUser?: boolean;
	clearanceId?: string;
	clearanceAccessId?: string;
	inviteDefault?: ApplicationInviteCreateRequest;
}

@Component({
	selector: 'app-screening-request-add-common-modal',
	template: `
		<div mat-dialog-title>Add {{ requestName }}</div>
		<mat-dialog-content>
			<form [formGroup]="form" novalidate>
				<div class="row mt-4">
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
						<div class="alert alert-danger d-flex" role="alert" *ngIf="isDuplicateDetected">
							<mat-icon class="d-none d-md-block alert-icon me-2">warning</mat-icon>
							<div>
								Duplicates are not allowed. Update the data associated with the following:
								<ul>
									<li>Email: {{ duplicateEmail }}</li>
								</ul>
							</div>
						</div>
						<ng-container formArrayName="crcs" *ngFor="let group of getFormControls.controls; let i = index">
							<mat-divider class="mat-divider-main mb-3" *ngIf="i > 0"></mat-divider>
							<div class="row" [formGroupName]="i">
								<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 pe-md-0">
									<mat-form-field>
										<mat-label>Given Name</mat-label>
										<input
											matInput
											type="text"
											formControlName="firstName"
											[errorStateMatcher]="matcher"
											maxlength="40"
										/>
										<mat-error *ngIf="group.get('firstName')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 pe-md-0">
									<mat-form-field>
										<mat-label>Surname</mat-label>
										<input
											matInput
											type="text"
											formControlName="lastName"
											[errorStateMatcher]="matcher"
											maxlength="40"
										/>
										<mat-error *ngIf="group.get('lastName')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 pe-md-0">
									<mat-form-field>
										<mat-label>Email</mat-label>
										<input
											matInput
											formControlName="email"
											type="email"
											required
											[errorStateMatcher]="matcher"
											maxlength="75"
										/>
										<mat-error *ngIf="group.get('email')?.hasError('email')"> Must be a valid email address </mat-error>
										<mat-error *ngIf="group.get('email')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 pe-md-0">
									<mat-form-field>
										<mat-label>Job Title</mat-label>
										<input matInput formControlName="jobTitle" [errorStateMatcher]="matcher" maxlength="100" />
										<mat-error *ngIf="group.get('jobTitle')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>

								<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 pe-md-0" *ngIf="showScreeningType">
									<mat-form-field>
										<mat-label>Application Type</mat-label>
										<mat-select formControlName="screeningType" [errorStateMatcher]="matcher">
											<mat-option *ngFor="let scr of screeningTypes" [value]="scr.code">
												{{ scr.desc }}
											</mat-option>
										</mat-select>
										<mat-error *ngIf="group.get('screeningType')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>

								<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 pe-md-0" *ngIf="showMinistries">
									<mat-form-field>
										<mat-label>Ministry</mat-label>
										<mat-select
											formControlName="orgId"
											(selectionChange)="onChangeMinistry($event, i)"
											[errorStateMatcher]="matcher"
										>
											<mat-option *ngFor="let ministry of ministries" [value]="ministry.id">
												{{ ministry.name }}
											</mat-option>
										</mat-select>
										<mat-error *ngIf="group.get('orgId')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>

								<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 pe-md-0" *ngIf="showServiceType">
									<mat-form-field>
										<mat-label>Service Type</mat-label>
										<mat-select
											formControlName="serviceType"
											(selectionChange)="onChangeServiceType($event, i)"
											[errorStateMatcher]="matcher"
										>
											<mat-option *ngFor="let srv of serviceTypes[i]" [value]="srv.code">
												{{ srv.desc }}
											</mat-option>
										</mat-select>
										<mat-error *ngIf="group.get('serviceType')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>

								<div
									class="col-xl-3 col-lg-4 col-md-6 col-sm-12 pe-md-0"
									*ngIf="showPaidByPsso[i] || isNotVolunteerOrg"
								>
									<mat-form-field>
										<mat-label>Paid by</mat-label>
										<mat-select formControlName="payeeType" [errorStateMatcher]="matcher">
											<mat-option *ngFor="let payer of payerPreferenceTypes" [value]="payer.code">
												{{ payer.desc }}
											</mat-option>
										</mat-select>
										<mat-error *ngIf="group.get('payeeType')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>

								<div class="col-xl-1 col-lg-1 col-md-3 col-sm-3 mb-4 mb-md-0">
									<button
										mat-icon-button
										class="delete-row-button"
										matTooltip="Remove criminal record check"
										(click)="onDeleteRow(i)"
										*ngIf="rowsExist"
										aria-label="Remove criminal record check"
									>
										<mat-icon>delete_outline</mat-icon>
									</button>
								</div>
							</div>
							<ng-container *ngIf="showPssoVsWarning[i]">
								<app-alert type="warning">{{ pssoVsWarning }}</app-alert>
							</ng-container>
						</ng-container>
					</div>
					<div class="row" *ngIf="isAllowMultiple">
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
							<button
								mat-stroked-button
								class="large w-100 mb-2"
								style="color: var(--color-green);"
								(click)="onAddRow()"
							>
								<mat-icon class="add-icon">add_circle</mat-icon>Add Another Request
							</button>
						</div>
					</div>
				</div>
			</form>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-lg-3 col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-lg-6 col-lg-3 offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onSendScreeningRequest()">
						Send {{ requestName }}
					</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [
		`
			.button-toggle {
				width: 130px;
			}

			.delete-row-button:not([disabled]) {
				color: var(--color-red);
			}
		`,
	],
})
export class ScreeningRequestAddCommonModalComponent implements OnInit {
	pssoVsWarning = SPD_CONSTANTS.message.pssoVsWarning;

	ministries: Array<MinistryResponse> = [];
	portal: PortalTypeCode | null = null;
	isNotVolunteerOrg = false;
	isDuplicateDetected = false;
	isAllowMultiple = false;
	isPsaUser = false;
	orgId: string | null = null;
	duplicateName = '';
	duplicateEmail = '';

	readonly yesMessageSingular = 'Your criminal record check has been sent to the applicant';
	readonly yesMessageMultiple = 'Your criminal record checks have been sent to the applicants';

	showServiceType = false;
	serviceTypeDefault: ServiceTypeCode | null = null;
	serviceTypes: Array<SelectOptions[]> = [];
	showPaidByPsso: Array<boolean> = [];
	portalTypeCodes = PortalTypeCode;
	showPssoVsWarning: Array<boolean> = [];

	showScreeningType = false;
	screeningTypes = ScreeningTypes;
	payerPreferenceTypes = PayerPreferenceTypes;

	requestName = '';
	form!: FormGroup;

	matcher = new FormErrorStateMatcher();

	constructor(
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<ScreeningRequestAddCommonModalComponent>,
		private applicationService: ApplicationService,
		private authUserBceidService: AuthUserBceidService,
		private utilService: UtilService,
		private optionsService: OptionsService,
		private dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public dialogData: ScreeningRequestAddDialogData
	) {}

	ngOnInit(): void {
		this.portal = this.dialogData?.portal;
		this.isPsaUser = this.dialogData?.isPsaUser ?? false;
		this.orgId = this.dialogData?.orgId ?? null;

		this.ministries = this.optionsService.getMinistries();

		this.form = this.formBuilder.group({
			crcs: this.formBuilder.array([]),
		});

		if (this.portal == PortalTypeCode.Crrp) {
			this.setupCrrp();
		} else {
			this.setupPsso();
		}

		const clearanceId = this.dialogData?.clearanceId;
		if (clearanceId) {
			this.isAllowMultiple = false;
			this.applicationService
				.apiOrgsOrgIdClearancesExpiredClearanceIdGet({
					orgId: this.authUserBceidService.bceidUserInfoProfile?.orgId!,
					clearanceId,
				})
				.pipe()
				.subscribe((resp: ApplicationInvitePrepopulateDataResponse) => {
					this.addFirstRow(resp);
				});
		} else {
			this.isAllowMultiple = true;
			this.addFirstRow(this.dialogData?.inviteDefault);
		}
	}

	initiateForm(inviteDefault?: ApplicationInvitePrepopulateDataResponse | ApplicationInviteCreateRequest): FormGroup {
		let screeningTypeCodeDefault = '';
		if (!this.showScreeningType) {
			screeningTypeCodeDefault = inviteDefault?.screeningType ? inviteDefault?.screeningType : ScreeningTypeCode.Staff;
		}

		let serviceTypeCodeDefault: ServiceTypeCode | null = null;
		if (this.portal == PortalTypeCode.Crrp) {
			serviceTypeCodeDefault = inviteDefault?.serviceType ? inviteDefault?.serviceType : this.serviceTypeDefault;
		} else if (!this.isPsaUser) {
			serviceTypeCodeDefault = ServiceTypeCode.Psso;
		}

		const orgIdDefault = this.orgId;

		const newForm = this.formBuilder.group(
			{
				firstName: new FormControl(inviteDefault ? inviteDefault.firstName : '', [FormControlValidators.required]),
				lastName: new FormControl(inviteDefault ? inviteDefault.lastName : '', [FormControlValidators.required]),
				email: new FormControl(inviteDefault ? inviteDefault.email : '', [
					Validators.required,
					FormControlValidators.email,
				]),
				jobTitle: new FormControl(inviteDefault ? inviteDefault.jobTitle : '', [FormControlValidators.required]),
				payeeType: new FormControl(inviteDefault ? inviteDefault.payeeType : null, [FormControlValidators.required]),
				screeningType: new FormControl(screeningTypeCodeDefault),
				serviceType: new FormControl(serviceTypeCodeDefault),
				orgId: new FormControl(orgIdDefault),
			},
			{
				validators: [
					FormGroupValidators.conditionalRequiredValidator('screeningType', (_form) => this.showScreeningType ?? false),
					FormGroupValidators.conditionalRequiredValidator('serviceType', (_form) => this.showServiceType ?? false),
					FormGroupValidators.conditionalRequiredValidator('payeeType', (_form) =>
						this.isPayeeTypeRequired(_form.get('serviceType')?.value ?? false)
					),
					FormGroupValidators.conditionalRequiredValidator(
						'orgId',
						(_form) => this.portal == PortalTypeCode.Psso && this.isPsaUser
					),
				],
			}
		);
		return newForm;
	}

	onChangeMinistry(event: MatSelectChange, index: number): void {
		this.populatePssoServiceTypes(event.value, index);
	}


	onChangeServiceType(event: MatSelectChange, index: number): void {
		this.setShowPaidByPsso(event.value, index);
		this.setPssoVsWarning(event.value, index);
	}

	onAddRow() {
		const crcsArray = this.form.get('crcs') as FormArray;
		crcsArray.push(this.initiateForm());
		this.form.setControl('crcs', crcsArray);

		this.populatePssoServiceTypes(this.orgId!, crcsArray.length - 1);
	}

	onDeleteRow(index: number) {
		const control = this.form.get('crcs') as FormArray;
		if (control.length == 1) {
			const data: DialogOptions = {
				icon: 'warning',
				title: 'Remove row',
				message: 'This row cannot be removed. At least one row must exist.',
				cancelText: 'Close',
			};

			this.dialog.open(DialogComponent, { data });
			return;
		}

		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this criminal record check?',
			actionText: 'Yes, remove row',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					const control = this.form.get('crcs') as FormArray;
					control.removeAt(index);
				}
			});
	}

	onSendScreeningRequest(): void {
		this.isDuplicateDetected = false;
		this.form.markAllAsTouched();

		if (!this.form.valid) return;

		const control: Array<ApplicationInviteCreateRequest> = (this.form.get('crcs') as FormArray).value;

		const seen = new Set();
		let duplicateInfo: any;
		const hasDuplicates = control.some(function (currentObject: any) {
			duplicateInfo = currentObject;
			return seen.size === seen.add(currentObject.email).size;
		});

		if (hasDuplicates) {
			this.isDuplicateDetected = true;
			this.duplicateName = `${duplicateInfo.firstName} ${duplicateInfo.lastName}`;
			this.duplicateEmail = duplicateInfo.email;
			return;
		}

		// Vulnerable sector check
		const body: ApplicationInvitesCreateRequest = {
			applicationInviteCreateRequests: control,
			requireDuplicateCheck: true,
		};

		const clearanceAccessId = this.dialogData?.clearanceAccessId;
		if (clearanceAccessId) {
			body.applicationInviteCreateRequests?.forEach((item) => {
				item.originalClearanceAccessId = clearanceAccessId;
			});
		}

		if (this.portal == PortalTypeCode.Psso) {
			// see if any crcs have PSSO+VS
			const pssoVs = control.filter(
				(item) => item.serviceType == ServiceTypeCode.PssoVs || item.serviceType == ServiceTypeCode.PeCrcVs
			);
			if (pssoVs.length > 0) {
				this.promptVulnerableSector(body);
			} else {
				this.checkForDuplicates(body);
			}
		} else {
			this.promptVulnerableSector(body);
		}
	}

	private setPssoVsWarning(serviceTypeCode: ServiceTypeCode, index: number) {
		this.showPssoVsWarning[index] = serviceTypeCode === ServiceTypeCode.PssoVs;
	}

	private addFirstRow(inviteDefault?: ApplicationInvitePrepopulateDataResponse | ApplicationInviteCreateRequest) {
		const crcsArray = this.form.get('crcs') as FormArray;
		crcsArray.push(this.initiateForm(inviteDefault));

		this.populatePssoServiceTypes(this.orgId!, crcsArray.length - 1);
	}

	private promptVulnerableSector(body: ApplicationInvitesCreateRequest): void {
		const vulnerableQuestionSingular =
			'In their role with your organization, will this person work directly with, or potentially have unsupervised access to, children and/or vulnerable adults?';
		const vulnerableQuestionMultiple =
			'In their roles with your organization, will these individuals work directly with, or potentially have unsupervised access to, children and/or vulnerable adults?';

		const data: DialogOptions = {
			icon: 'info_outline',
			title: 'Vulnerable sector',
			message: '',
			actionText: 'Yes',
			cancelText: 'No',
		};

		data.message =
			body.applicationInviteCreateRequests?.length == 1 ? vulnerableQuestionSingular : vulnerableQuestionMultiple;

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.checkForDuplicates(body);
				} else {
					this.promptVulnerableSectorNo(body);
				}
			});
	}

	private promptVulnerableSectorNo(body: ApplicationInvitesCreateRequest): void {
		const vulnerableQuestionSingular = `If the applicant will not have unsupervised access to children or vulnerable adults in this role, but they require a criminal record check for another reason, please <a href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check" target="_blank"> contact your local police detachment</a>`;
		const vulnerableQuestionMultiple = `If the applicants will not have unsupervised access to children or vulnerable adults in this role, but they require a criminal record check for another reason, please <a href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check" target="_blank"> contact your local police detachment</a>`;

		const data: DialogOptions = {
			icon: 'info_outline',
			title: 'Criminal record check',
			message: '',
			actionText: 'Cancel request',
			cancelText: 'Previous',
		};

		data.message =
			body.applicationInviteCreateRequests?.length == 1 ? vulnerableQuestionSingular : vulnerableQuestionMultiple;

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (!response) {
					this.promptVulnerableSector(body);
				}
			});
	}

	private checkForDuplicates(body: ApplicationInvitesCreateRequest): void {
		// Check for potential duplicate
		body.requireDuplicateCheck = true;
		const message =
			body.applicationInviteCreateRequests?.length == 1 ? this.yesMessageSingular : this.yesMessageMultiple;

		this.applicationService
			.apiOrgsOrgIdApplicationInvitesPost({ orgId: this.dialogData?.orgId!, body })
			.pipe()
			.subscribe((dupres: ApplicationInvitesCreateResponse) => {
				if (dupres.createSuccess) {
					this.handleSaveSuccess(message);
					return;
				}

				if (dupres.duplicateResponses && dupres.duplicateResponses.length > 0) {
					const duplicateResponses = dupres.duplicateResponses ? dupres.duplicateResponses : [];
					// At least one potential duplicate has been found
					let dupRows = '';
					duplicateResponses.forEach((item) => {
						dupRows += `<li>${item.firstName} ${item.lastName}`;
						if (item.email) {
							dupRows += `(${item.email ?? ''})`;
						}
						dupRows += `</li>`;
					});
					const dupMessage = `<ul>${dupRows}</ul>`;

					let dialogTitle = '';
					let dialogMessage = '';
					let dialogAction = '';

					if (duplicateResponses.length > 1) {
						dialogTitle = 'Potential duplicates detected';
						dialogMessage = `Your organization has submitted a criminal record check for these applicants within the last 30 days.<br/><br/>${dupMessage}How would you like to proceed?`;
					} else {
						dialogTitle = 'Potential duplicate detected';
						dialogMessage = `Your organization has submitted a criminal record check for this applicant within the last 30 days.<br/><br/>${dupMessage}How would you like to proceed?`;
					}
					dialogAction = 'Submit';

					const data: DialogOptions = {
						icon: 'warning',
						title: dialogTitle,
						message: dialogMessage,
						actionText: dialogAction,
						cancelText: 'Cancel',
					};

					this.dialog
						.open(DialogComponent, { data })
						.afterClosed()
						.subscribe((response: boolean) => {
							if (response) {
								this.saveInviteRequests(body, message);
							}
						});
				}
			});
	}

	private saveInviteRequests(body: ApplicationInvitesCreateRequest, message: string): void {
		body.requireDuplicateCheck = false;
		this.applicationService
			.apiOrgsOrgIdApplicationInvitesPost({ orgId: this.dialogData?.orgId!, body })
			.pipe()
			.subscribe((_resp: any) => {
				this.handleSaveSuccess(message);
			});
	}

	private handleSaveSuccess(message: string): void {
		this.dialogRef.close({
			success: true,
			message,
		});
	}

	private setupCrrp(): void {
		this.requestName = 'Criminal Record Check';

		// using bceid
		const orgProfile = this.authUserBceidService.bceidUserOrgProfile!;
		this.isNotVolunteerOrg = orgProfile?.isNotVolunteerOrg ?? false;

		if (this.isNotVolunteerOrg) {
			const licenseesNeedVulnerableSectorScreening =
				orgProfile.licenseesNeedVulnerableSectorScreening === BooleanTypeCode.Yes;
			const contractorsNeedVulnerableSectorScreening =
				orgProfile.contractorsNeedVulnerableSectorScreening === BooleanTypeCode.Yes;

			this.showScreeningType = this.utilService.getShowScreeningType(
				licenseesNeedVulnerableSectorScreening,
				contractorsNeedVulnerableSectorScreening
			);
			this.screeningTypes = this.utilService.getScreeningTypes(
				licenseesNeedVulnerableSectorScreening,
				contractorsNeedVulnerableSectorScreening
			);
		} else {
			this.showScreeningType = false;
		}

		const serviceTypes = orgProfile?.serviceTypes ?? [];
		if (serviceTypes.length > 0) {
			if (serviceTypes.length == 1) {
				this.serviceTypeDefault = serviceTypes[0];
			} else {
				this.showServiceType = true;
				this.serviceTypes[0] = ServiceTypes.filter((item) => serviceTypes.includes(item.code as ServiceTypeCode));
			}
		}
	}

	private setupPsso(): void {
		this.requestName = 'Criminal Record Check';

		// using idir
		this.isNotVolunteerOrg = false;
		this.showScreeningType = false;
		this.showServiceType = true;
	}

	private setShowPaidByPsso(serviceTypeCode: ServiceTypeCode, index: number) {
		if (this.portal != PortalTypeCode.Psso) {
			return;
		}

		this.showPaidByPsso[index] = this.isPeCrc(serviceTypeCode);
	}

	private populatePssoServiceTypes(orgId: string, index: number) {
		if (this.portal != PortalTypeCode.Psso) {
			return;
		}

		const currentMinistry = this.ministries.find((item: MinistryResponse) => item.id === orgId);
		const serviceTypes =
			currentMinistry?.serviceTypeCodes?.map(
				(item: ServiceTypeCode) => ServiceTypes.find((option: SelectOptions) => option.code === item)!
			) ?? [];
		serviceTypes.sort((a: SelectOptions, b: SelectOptions) =>
			this.utilService.compareByStringUpper(a.desc ?? '', b.desc)
		);
		this.serviceTypes[index] = serviceTypes;

		const control = this.form.get('crcs') as FormArray;
		const crcFormGroup = control.at(index) as FormGroup;

		if (this.isPsaUser && crcFormGroup) {
			const defaultServiceTypeCode = serviceTypes.length === 1 ? (serviceTypes[0].code as string) : null;
			crcFormGroup.patchValue({ serviceType: defaultServiceTypeCode }, { emitEvent: false });
		}
	}

	isPayeeTypeRequired(serviceTypeCode: ServiceTypeCode): boolean {
		if (this.portal === PortalTypeCode.Psso) {
			return this.isPeCrc(serviceTypeCode);
		}

		return this.isNotVolunteerOrg;
	}

	private isPeCrc(serviceTypeCode: ServiceTypeCode): boolean {
		return serviceTypeCode === ServiceTypeCode.PeCrc || serviceTypeCode === ServiceTypeCode.PeCrcVs;
	}

	get getFormControls() {
		const control = this.form.get('crcs') as FormArray;
		return control;
	}

	get rowsExist(): boolean {
		const control = this.form.get('crcs') as FormArray;
		return control.length > 1;
	}

	get showMinistries(): boolean {
		return this.portal === PortalTypeCode.Psso && this.isPsaUser === true;
	}
}
