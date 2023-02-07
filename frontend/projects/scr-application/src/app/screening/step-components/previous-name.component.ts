import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent, FormErrorStateMatcher } from 'projects/shared/src/public-api';
import { DialogOptions } from 'shared';

@Component({
	selector: 'app-previous-name',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<div class="title mb-5">Have you ever had a previous name?</div>
					<div class="row">
						<div class="offset-lg-1 col-lg-10 col-md-12 col-sm-12">
							<mat-radio-group
								class="funding-question__group"
								aria-label="Select an option"
								formControlName="previousNameFlag"
							>
								<mat-radio-button value="YES"> Yes </mat-radio-button>
								<ng-container *ngIf="previousNameFlag.value == 'YES'">
									<div class="mt-3">
										<ng-container
											formArrayName="tableRows"
											*ngFor="let group of getFormControls.controls; let i = index"
										>
											<div class="row" [formGroupName]="i">
												<div class="col-xl-4 col-lg-3 col-md-6 col-sm-12">
													<mat-form-field>
														<mat-label>First Name</mat-label>
														<input
															matInput
															type="text"
															formControlName="firstName"
															[errorStateMatcher]="matcher"
															required
														/>
														<mat-error *ngIf="group.get('firstName')?.hasError('required')">This is required</mat-error>
													</mat-form-field>
												</div>
												<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
													<mat-form-field>
														<mat-label>Middle Name (optional)</mat-label>
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
														color="warn"
														class="mb-3"
														matTooltip="Delete current row"
														(click)="deleteRow(i)"
														[disabled]="oneRowExists"
														aria-label="Delete row"
													>
														<mat-icon>delete</mat-icon>
													</button>
												</div>
											</div>
											<hr />
										</ng-container>
									</div>
									<div class="row">
										<div class="col-lg-6 col-md-8 col-sm-12">
											<button mat-stroked-button color="primary" (click)="addRow()">
												<mat-icon>add_circle</mat-icon>Add Another Name
											</button>
										</div>
									</div>
								</ng-container>

								<mat-divider class="my-3"></mat-divider>

								<mat-radio-button value="NO"> No </mat-radio-button>
								<mat-error
									*ngIf="
										(form.get('previousNameFlag')?.dirty || form.get('previousNameFlag')?.touched) &&
										form.get('previousNameFlag')?.invalid &&
										form.get('previousNameFlag')?.hasError('required')
									"
								>
									This is required
								</mat-error>
							</mat-radio-group>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [
		`
			hr {
				color: var(--color-primary-light);
			}

			.mat-mdc-mini-fab {
				top: 10px;
				width: 30px;
				height: 30px;
			}

			.card-section {
				background-color: #ededed !important;
				border-left: 3px solid var(--color-primary);
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class PreviousNameComponent implements OnInit {
	form!: FormGroup;
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			previousNameFlag: new FormControl('', [Validators.required]),
			tableRows: this.formBuilder.array([]),
		});
		this.addRow();
	}

	initiateForm(): FormGroup {
		return this.formBuilder.group({
			firstName: ['', [Validators.required]],
			middleNames: [''],
			previousSurname: ['', [Validators.required]],
		});
	}

	addRow() {
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
			message: 'Are you sure you want to permanently remove this row?',
			actionText: 'Yes, delete this row',
			cancelText: 'Go back',
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
		return this.form.valid;
	}

	get previousNameFlag(): FormControl {
		return this.form.get('previousNameFlag') as FormControl;
	}

	get oneRowExists(): boolean {
		const control = this.form.get('tableRows') as FormArray;
		return control.length > 1 ? false : true;
	}
}
