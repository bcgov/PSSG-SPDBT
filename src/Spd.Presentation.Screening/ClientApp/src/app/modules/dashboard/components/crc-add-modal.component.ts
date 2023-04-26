import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
	ApplicationInvitesCreateRequest,
	ApplicationInvitesCreateResponse,
	PayeePreferenceTypeCode,
} from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-crc-add-modal',
	template: `
		<div mat-dialog-title>{{ title }}</div>
		<mat-dialog-content>
			<form [formGroup]="form" novalidate>
				<div class="row mt-4">
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
						<div class="alert alert-danger d-flex align-items-center" role="alert" *ngIf="isDuplicateDetected">
							<mat-icon class="d-none d-md-block alert-icon me-2">warning</mat-icon>
							<div>
								Duplicates are not allowed. Update the data associated with the following:
								<ul>
									<li>Email: {{ duplicateEmail }}</li>
								</ul>
							</div>
						</div>
						<ng-container formArrayName="tableRows" *ngFor="let group of getFormControls.controls; let i = index">
							<mat-divider class="mb-3" *ngIf="i > 0"></mat-divider>
							<div class="row" [formGroupName]="i">
								<div class="col-xl-2 col-lg-4 col-md-6 col-sm-12 pe-md-0">
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
								<div class="col-xl-2 col-lg-4 col-md-6 col-sm-12 pe-md-0">
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
								<div class="col-xl-2 col-lg-4 col-md-6 col-sm-12 pe-md-0">
									<mat-form-field>
										<mat-label>Email Address</mat-label>
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
								<div class="col-xl-2 col-lg-4 col-md-6 col-sm-12 pe-md-0">
									<mat-form-field>
										<mat-label>Job Title</mat-label>
										<input matInput formControlName="jobTitle" [errorStateMatcher]="matcher" maxlength="100" />
										<mat-error *ngIf="group.get('jobTitle')?.hasError('required')">This is required</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-3 col-lg-3 col-md-6 col-sm-9" style="text-align: center;">
									<mat-button-toggle-group formControlName="payeeType" aria-label="Paid By">
										<mat-button-toggle class="button-toggle" [value]="payeePreferenceTypeCodes.Organization">
											Organization
										</mat-button-toggle>
										<mat-button-toggle class="button-toggle" [value]="payeePreferenceTypeCodes.Applicant">
											Applicant
										</mat-button-toggle>
									</mat-button-toggle-group>
									<div>
										<mat-hint style="white-space: nowrap;">Paid by</mat-hint>
									</div>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(group.get('payeeType')?.dirty || group.get('payeeType')?.touched) &&
											group.get('payeeType')?.invalid &&
											group.get('payeeType')?.hasError('required')
										"
										>An option must be selected</mat-error
									>
								</div>
								<div class="col-xl-1 col-lg-1 col-md-3 col-sm-3 mb-4 mb-md-0">
									<button
										mat-icon-button
										class="delete-row-button"
										matTooltip="Remove criminal record check"
										(click)="deleteRow(i)"
										[disabled]="oneRowExists"
										aria-label="Remove criminal record check"
									>
										<mat-icon>delete_outline</mat-icon>
									</button>
								</div>
							</div>
						</ng-container>
					</div>
					<div class="row">
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
							<button
								mat-stroked-button
								class="large w-100 mb-2"
								style="color: var(--color-green);"
								(click)="onAddRow()"
							>
								<mat-icon class="add-icon">add_circle</mat-icon>Add Another Screening
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
						Send Criminal Record Check
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
export class CrcAddModalComponent implements OnInit {
	isDuplicateDetected = false;
	duplicateName = '';
	duplicateEmail = '';

	readonly yesMessageSingular = 'Your criminal record check has been sent to the applicant';
	readonly yesMessageMultiple = 'Your criminal record checks have been sent to the applicants';

	matcher = new FormErrorStateMatcher();
	payeePreferenceTypeCodes = PayeePreferenceTypeCode;

	title: string = 'Add Criminal Record Check';
	form!: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private dialogRef: MatDialogRef<CrcAddModalComponent>,
		private applicationService: ApplicationService,
		private authenticationService: AuthenticationService,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			tableRows: this.formBuilder.array([]),
		});
		this.onAddRow();
	}

	initiateForm(): FormGroup {
		return this.formBuilder.group({
			firstName: new FormControl('', [Validators.required]),
			lastName: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, FormControlValidators.email]),
			jobTitle: new FormControl('', [Validators.required]),
			payeeType: new FormControl('', [Validators.required]),
		});
	}

	onAddRow() {
		const control = this.form.get('tableRows') as FormArray;
		control.push(this.initiateForm());
	}

	deleteRow(index: number) {
		const control = this.form.get('tableRows') as FormArray;
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
			title: 'Remove row',
			message: 'Are you sure you want to remove this criminal record check?',
			actionText: 'Yes, remove this row',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					const control = this.form.get('tableRows') as FormArray;
					control.removeAt(index);
				}
			});
	}

	onSendScreeningRequest(): void {
		this.isDuplicateDetected = false;
		this.form.markAllAsTouched();

		if (!this.form.valid) return;

		const control = (this.form.get('tableRows') as FormArray).value;

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
		this.promptVulnerableSector(body);
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
				} else {
					this.dialogRef.close({
						success: false,
					});
				}
			});
	}

	private checkForDuplicates(body: ApplicationInvitesCreateRequest): void {
		// Check for potential duplicate
		body.requireDuplicateCheck = true;
		const message =
			body.applicationInviteCreateRequests?.length == 1 ? this.yesMessageSingular : this.yesMessageMultiple;

		this.applicationService
			.apiOrgsOrgIdApplicationInvitesPost({ orgId: this.authenticationService.loggedInOrgId!, body })
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
						dupRows += `<li>${item.firstName} ${item.lastName} (${item.email})</li>`;
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
			.apiOrgsOrgIdApplicationInvitesPost({ orgId: this.authenticationService.loggedInOrgId!, body })
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

	get getFormControls() {
		const control = this.form.get('tableRows') as FormArray;
		return control;
	}

	get oneRowExists(): boolean {
		const control = this.form.get('tableRows') as FormArray;
		return control.length > 1 ? false : true;
	}
}
