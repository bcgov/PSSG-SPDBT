import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { BooleanTypeCode } from 'src/app/api/models';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-new-screening',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-8 col-lg-7 col-md-6 col-sm-12">
						<h2 class="mb-2 fw-normal">
							New Screening
							<div class="mt-2 fs-5 fw-light">Request up to 4 new screenings</div>
						</h2>
					</div>
					<div class="col-xl-4 col-lg-5 col-md-6 col-sm-12 my-auto">
						<button mat-flat-button class="large w-100 mat-green-button mb-2" (click)="onSendScreeningRequest()">
							Send Screening Request
						</button>
					</div>
				</div>
				<div class="row mt-4">
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
						<div class="alert alert-danger d-flex align-items-center" role="alert" *ngIf="isDuplicateDetected">
							<mat-icon class="d-none d-md-block alert-icon me-2">warning</mat-icon>
							<div>
								Duplicates are not allowed. Update the data associated with the following...
								<ul>
									<li>Name: {{ duplicateName }}</li>
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
										<input matInput type="text" formControlName="firstName" [errorStateMatcher]="matcher" />
										<mat-error *ngIf="group.get('firstName')?.hasError('required')">This is required</mat-error>
										<mat-error *ngIf="group.get('firstName')?.hasError('maxlength')">
											This must be at most 40 characters long
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 pe-md-0">
									<mat-form-field>
										<mat-label>Surname</mat-label>
										<input matInput type="text" formControlName="lastName" [errorStateMatcher]="matcher" />
										<mat-error *ngIf="group.get('lastName')?.hasError('required')">This is required</mat-error>
										<mat-error *ngIf="group.get('lastName')?.hasError('maxlength')">
											This must be at most 40 characters long
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 pe-md-0">
									<mat-form-field>
										<mat-label>Email Address</mat-label>
										<input matInput formControlName="email" type="email" required [errorStateMatcher]="matcher" />
										<mat-error *ngIf="group.get('email')?.hasError('email')"> Must be a valid email address </mat-error>
										<mat-error *ngIf="group.get('email')?.hasError('required')">This is required</mat-error>
										<mat-error *ngIf="group.get('email')?.hasError('maxlength')">
											This must be at most 75 characters long
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-2 col-lg-4 col-md-6 col-sm-12 pe-md-0">
									<mat-form-field>
										<mat-label>Job Title</mat-label>
										<input matInput formControlName="jobTitle" [errorStateMatcher]="matcher" />
										<mat-error *ngIf="group.get('jobTitle')?.hasError('required')">This is required</mat-error>
										<mat-error *ngIf="group.get('jobTitle')?.hasError('maxlength')">
											This must be at most 100 characters long
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-1 col-lg-3 col-md-3 col-sm-12">
									<mat-button-toggle-group formControlName="orgPaying" aria-label="Organization Paying">
										<mat-button-toggle class="paying-button-toggle" [value]="booleanTypeCodes.No">No</mat-button-toggle>
										<mat-button-toggle class="paying-button-toggle" [value]="booleanTypeCodes.Yes"
											>Yes</mat-button-toggle
										>
									</mat-button-toggle-group>
									<div>
										<mat-hint style="white-space: nowrap;">Organization Paying?</mat-hint>
									</div>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(group.get('orgPaying')?.dirty || group.get('orgPaying')?.touched) &&
											group.get('orgPaying')?.invalid &&
											group.get('orgPaying')?.hasError('required')
										"
										>An option must be selected</mat-error
									>
								</div>
								<div class="col-xl-1 col-lg-1 col-md-3 col-sm-12 mb-4 mb-md-0">
									<button
										mat-mini-fab
										class="delete-row-button"
										matTooltip="Delete screening request"
										(click)="deleteRow(i)"
										[disabled]="oneRowExists"
										aria-label="Delete screening request"
									>
										<mat-icon>delete</mat-icon>
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
				background-color: var(--color-red);
				color: var(--color-white);
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
	booleanTypeCodes = BooleanTypeCode;

	constructor(private formBuilder: FormBuilder, private hotToast: HotToastService, private dialog: MatDialog) {}

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
			firstName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
			lastName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
			email: new FormControl('', [Validators.email, Validators.required, Validators.maxLength(75)]),
			jobTitle: new FormControl('', [Validators.required, Validators.maxLength(100)]),
			orgPaying: new FormControl('', [Validators.required]),
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
				icon: 'error_outline',
				title: 'Delete Row',
				message: 'This row cannot be deleted. At least one row must exist.',
				cancelText: 'Close',
			};

			this.dialog.open(DialogComponent, { data });
			return;
		}

		const data: DialogOptions = {
			icon: 'error_outline',
			title: 'Delete Row',
			message: 'Are you sure you want to permanently delete this screening request?',
			actionText: 'Yes, delete this row',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					const control = this.form.get('tableRows') as FormArray;
					control.removeAt(index);
					this.hotToast.success('Row was successfully deleted');
				}
			});
	}

	onSendScreeningRequest(): void {
		this.isDuplicateDetected = false;
		this.form.markAllAsTouched();
		if (this.form.valid) {
			const control = (this.form.get('tableRows') as FormArray).value;
			const numberOfRequests = control.length;

			let seen = new Set();
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

			//TODO Call API to send screening requests
			// after success clear data and display toast

			// save screening requests
			this.hotToast.success(
				`${numberOfRequests} screening request${numberOfRequests > 1 ? 's were' : ' was'} successfully created`
			);
			this.form.reset();
			this.createEmptyForm();
		}
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
