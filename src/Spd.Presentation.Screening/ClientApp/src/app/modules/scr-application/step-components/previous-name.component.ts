import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BooleanTypeCode } from 'src/app/api/models';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { ScreeningFormStepComponent } from '../scr-application.component';

@Component({
	selector: 'app-previous-name',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title title="Have you ever had a previous name?"></app-step-title>
					<div class="row">
						<div class="offset-md-4 col-md-4 col-sm-12">
							<mat-radio-group aria-label="Select an option" formControlName="previousNameFlag">
								<mat-radio-button class="wide-radio" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-3"></mat-divider>
								<mat-radio-button class="wide-radio" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('previousNameFlag')?.dirty || form.get('previousNameFlag')?.touched) &&
									form.get('previousNameFlag')?.invalid &&
									form.get('previousNameFlag')?.hasError('required')
								"
								>An option must be selected</mat-error
							>
						</div>
					</div>

					<div class="row mt-4" *ngIf="previousNameFlag.value == booleanTypeCodes.Yes">
						<div class="offset-lg-1 col-lg-10 col-md-12 col-sm-12">
							<mat-divider class="my-3" style="border-top-color: var(--color-primary-light);"></mat-divider>
							<div class="text-minor-heading fw-semibold mb-2">Previous Names</div>
							<ng-container formArrayName="tableRows" *ngFor="let group of getFormControls.controls; let i = index">
								<div class="row" [formGroupName]="i">
									<div class="col-xl-4 col-lg-3 col-md-6 col-sm-12">
										<mat-form-field>
											<mat-label>First Name <span class="optional-label">(optional)</span></mat-label>
											<input matInput type="text" formControlName="firstName" [errorStateMatcher]="matcher" />
										</mat-form-field>
									</div>
									<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
										<mat-form-field>
											<mat-label>Middle Name <span class="optional-label">(optional)</span></mat-label>
											<input matInput type="text" formControlName="middleNames" />
										</mat-form-field>
									</div>
									<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12">
										<mat-form-field>
											<mat-label>Previous Surname</mat-label>
											<input
												matInput
												type="text"
												formControlName="previousSurname"
												[errorStateMatcher]="matcher"
												required
											/>
											<mat-error *ngIf="group.get('previousSurname')?.hasError('required')">
												This is required
											</mat-error>
										</mat-form-field>
									</div>
									<div class="col-xl-1 col-lg-1 col-md-6 col-sm-12">
										<button
											mat-mini-fab
											style="background-color: var(--color-red);color: var(--color-white);"
											class="mb-3"
											matTooltip="Delete previous name"
											(click)="deleteRow(i)"
											[disabled]="oneRowExists"
											aria-label="Delete row"
										>
											<mat-icon>delete</mat-icon>
										</button>
									</div>
								</div>
							</ng-container>
						</div>
						<div class="row">
							<div class="offset-lg-1 col-lg-4 col-md-6 col-sm-12">
								<button mat-stroked-button style="color: var(--color-green);" (click)="onAddRow()">
									<mat-icon>add_circle</mat-icon>Add Another Name
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [
		`
			.name-divider {
				background-color: var(--color-green);
			}

			.mat-mdc-mini-fab {
				top: 10px;
				width: 30px;
				height: 30px;
			}
		`,
	],
})
export class PreviousNameComponent implements OnInit, ScreeningFormStepComponent {
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	booleanTypeCodes = BooleanTypeCode;

	constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			previousNameFlag: new FormControl('', [Validators.required]),
			tableRows: this.formBuilder.array([]),
		});
		this.onAddRow();
	}

	initiateForm(): FormGroup {
		return this.formBuilder.group({
			firstName: [''],
			middleNames: [''],
			previousSurname: ['', [Validators.required]],
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
			message: 'Are you sure you want to permanently delete this previous name?',
			actionText: 'Yes, delete this name',
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

	get getFormControls() {
		const control = this.form.get('tableRows') as FormArray;
		return control;
	}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		if (!this.previousNameFlag || !this.previousNameFlag.value) return false;
		return this.previousNameFlag.value == BooleanTypeCode.Yes ? this.form.valid : true;
	}

	get previousNameFlag(): FormControl {
		return this.form.get('previousNameFlag') as FormControl;
	}

	get oneRowExists(): boolean {
		const control = this.form.get('tableRows') as FormArray;
		return control.length > 1 ? false : true;
	}
}
