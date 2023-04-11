import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { ApplicationInviteCreateRequest, CheckApplicationInviteDuplicateResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-new-screening',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-9 col-xl-8 col-lg-7 col-md-6 col-sm-12">
						<h2 class="mb-2 fw-normal">Screening Invitations</h2>
					</div>
					<div class="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-12 my-auto">
						<button mat-raised-button class="large w-100 mat-green-button mb-2" (click)="onSendScreeningRequest()">
							<mat-icon>send</mat-icon>Send Screening Request
						</button>
					</div>
				</div>
				<div class="row mt-4">
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
						<div class="alert alert-danger d-flex align-items-center" role="alert" *ngIf="isDuplicateDetected">
							<mat-icon class="d-none d-md-block alert-icon me-2">warning</mat-icon>
							<div>
								Duplicates are not allowed. Update the data associated with the following:
								<ul>
									<!-- <li>Name: {{ duplicateName }}</li> -->
									<li>Email: {{ duplicateEmail }}</li>
								</ul>
							</div>
						</div>
						<ng-container formArrayName="tableRows" *ngFor="let group of getFormControls.controls; let i = index">
							<mat-divider class="mb-3"></mat-divider>
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
								<div class="col-xl-1 col-lg-3 col-md-3 col-sm-12">
									<mat-button-toggle-group formControlName="orgPay" aria-label="Organization Paying">
										<mat-button-toggle class="paying-button-toggle" [value]="false">No</mat-button-toggle>
										<mat-button-toggle class="paying-button-toggle" [value]="true">Yes</mat-button-toggle>
									</mat-button-toggle-group>
									<div>
										<mat-hint style="white-space: nowrap;">Organization Paying?</mat-hint>
									</div>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(group.get('orgPay')?.dirty || group.get('orgPay')?.touched) &&
											group.get('orgPay')?.invalid &&
											group.get('orgPay')?.hasError('required')
										"
										>An option must be selected</mat-error
									>
								</div>
								<div class="col-xl-1 col-lg-1 col-md-3 col-sm-12 mb-4 mb-md-0">
									<button
										mat-icon-button
										class="delete-row-button"
										matTooltip="Remove screening request"
										(click)="deleteRow(i)"
										[disabled]="oneRowExists"
										aria-label="Remove screening request"
									>
										<mat-icon>delete_outline</mat-icon>
									</button>
								</div>
							</div>
						</ng-container>
					</div>
					<div class="row">
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
							<button mat-stroked-button (click)="onAddRow()">
								<mat-icon class="add-icon">add_circle</mat-icon>Add Another Screening
							</button>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [
		`
			.paying-button-toggle {
				width: 51px;
			}

			.name-divider {
				background-color: var(--color-green);
			}

			.mat-mdc-mini-fab {
				top: 10px;
				width: 30px;
				height: 30px;
			}

			.delete-row-button:not([disabled]) {
				color: var(--color-red);
			}

			.add-icon {
				color: var(--color-green);
			}
		`,
	],
})
export class NewScreeningComponent implements OnInit {
	isDuplicateDetected = false;
	duplicateName = '';
	duplicateEmail = '';

	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	constructor(
		private formBuilder: FormBuilder,
		private applicationService: ApplicationService,
		private hotToast: HotToastService,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.createEmptyForm();
	}

	createEmptyForm(): void {
		this.form = this.formBuilder.group({
			tableRows: this.formBuilder.array([]),
		});
		this.onAddRow();
	}

	initiateForm(): FormGroup {
		return this.formBuilder.group({
			firstName: new FormControl('', [Validators.required]),
			lastName: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.email, Validators.required]),
			jobTitle: new FormControl('', [Validators.required]),
			orgPay: new FormControl('', [Validators.required]),
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
				title: 'Remove Row',
				message: 'This row cannot be removed. At least one row must exist.',
				cancelText: 'Close',
			};

			this.dialog.open(DialogComponent, { data });
			return;
		}

		const data: DialogOptions = {
			icon: 'warning',
			title: 'Remove Row',
			message: 'Are you sure you want to remove this screening request?',
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

		// Check for potential duplicate
		//TODO replace with proper org id
		this.applicationService
			.apiOrgsOrgIdDetectInviteDuplicatesPost({ orgId: '4165bdfe-7cb4-ed11-b83e-00505683fbf4', body: control })
			.pipe()
			.subscribe((dupres: Array<CheckApplicationInviteDuplicateResponse>) => {
				// At least one potential duplicate has been found
				if (dupres?.length > 0) {
					let dupRows = '';
					dupres.forEach((item) => {
						dupRows += `<li>${item.firstName} ${item.lastName} (${item.email})</li>`;
					});
					const dupMessage = `<ul>${dupRows}</ul>`;

					let dialogTitle = '';
					let dialogMessage = '';
					let dialogAction = '';

					if (dupres?.length > 1) {
						dialogTitle = 'Potential Duplicates Detected';
						dialogMessage = `Potential duplicates have been detected from the screening request you have attempted to send. Ensure that the applicants do not currently have a screening application in progress nor have been sent a screening invitation recently.<br/><br/>${dupMessage}Do you still wish to proceed?`;
						dialogAction = 'Yes, send requests';
					} else {
						dialogTitle = 'Potential Duplicate Detected';
						dialogMessage = `A potential duplicate has been detected from the screening request you have attempted to send. Ensure that the applicant does not currently have a screening application in progress nor have been sent a screening invitation recently.<br/><br/>${dupMessage}Do you still wish to proceed?`;
						dialogAction = 'Yes, send request';
					}

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
								this.promptVulnerableSector(control);
							}
						});
				} else {
					this.promptVulnerableSector(control);
				}
			});
	}

	promptVulnerableSector(body: Array<ApplicationInviteCreateRequest>): void {
		const vulnerableQuestionSingular =
			'In their role with your organization, will this person work directly with, or potentially have unsupervised access to, children and/or vulnerable adults?';
		const vulnerableQuestionMultiple =
			'In their roles with your organization, will these individuals work directly with, or potentially have unsupervised access to, children and/or vulnerable adults?';

		const criminalRecordCheckMessageSingular = `If the applicant will not have unsupervised access to children or vulnerable adults in this role, but they require a criminal record check for another reason, please <a href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check" target="_blank"> contact your local police or private agency</a>`;
		const criminalRecordCheckMessageMultiple = `If the applicants will not have unsupervised access to children or vulnerable adults in this role, but they require a criminal record check for another reason, please <a href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check" target="_blank"> contact your local police or private agency</a>`;

		const data: DialogOptions = {
			icon: 'info_outline',
			title: 'Vulnerable Sector',
			message: '',
			actionText: 'Yes',
			cancelText: 'No',
		};

		if (body.length == 1) {
			data.message = vulnerableQuestionSingular;

			this.dialog
				.open(DialogComponent, { data })
				.afterClosed()
				.subscribe((response: boolean) => {
					let noMessage = !response ? criminalRecordCheckMessageSingular : null;
					this.saveInviteRequests(body, noMessage);
				});
		} else {
			data.message = vulnerableQuestionMultiple;

			this.dialog
				.open(DialogComponent, { data })
				.afterClosed()
				.subscribe((response: boolean) => {
					let noMessage = !response ? criminalRecordCheckMessageMultiple : null;
					this.saveInviteRequests(body, noMessage);
				});
		}
	}

	saveInviteRequests(body: Array<ApplicationInviteCreateRequest>, noMessage: string | null): void {
		const numberOfRequests = body.length;

		//TODO replace with proper org id
		this.applicationService
			.apiOrgsOrgIdApplicationInvitesPost({ orgId: '4165bdfe-7cb4-ed11-b83e-00505683fbf4', body })
			.pipe()
			.subscribe((_resp: any) => {
				// after success clear data and display toast
				this.hotToast.success(
					`The screening request${numberOfRequests > 1 ? 's were' : ' was'} successfully sent to the applicant${
						numberOfRequests > 1 ? 's' : ''
					}`
				);

				if (noMessage) {
					const dialogOptions: DialogOptions = {
						icon: 'info_outline',
						title: 'Vulnerable Sector',
						message: noMessage,
						cancelText: 'Close',
					};

					this.dialog.open(DialogComponent, { data: dialogOptions });
				}

				this.form.reset();
				this.createEmptyForm();
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
