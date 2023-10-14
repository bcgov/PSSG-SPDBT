import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BooleanTypeCode } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	LicenceModelSubject,
} from '../licence-application.service';

@Component({
	selector: 'app-aliases',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Do you have any previous names?"></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group
									aria-label="Select an option"
									formControlName="previousNameFlag"
									(change)="onPreviousNameFlagChange()"
								>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('previousNameFlag')?.dirty || form.get('previousNameFlag')?.touched) &&
										form.get('previousNameFlag')?.invalid &&
										form.get('previousNameFlag')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>
						<div *ngIf="previousNameFlag.value == booleanTypeCodes.Yes">
							<div class="row">
								<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
									<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
									<div class="text-minor-heading fw-semibold mb-2">Previous Names</div>
									<ng-container formArrayName="aliases" *ngFor="let group of getFormControls.controls; let i = index">
										<div class="row" [formGroupName]="i">
											<div class="col-lg-6 col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
													<input matInput type="text" formControlName="givenName" maxlength="40" />
												</mat-form-field>
											</div>
											<div class="col-lg-6 col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
													<input matInput type="text" formControlName="middleName1" maxlength="40" />
												</mat-form-field>
											</div>
											<div class="col-lg-6 col-md-6 col-sm-12">
												<mat-form-field>
													<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
													<input matInput type="text" formControlName="middleName2" maxlength="40" />
												</mat-form-field>
											</div>
											<div class="col-md-6 col-sm-12" [ngClass]="moreThanOneRowExists ? 'col-lg-5' : 'col-lg-6'">
												<mat-form-field>
													<mat-label>Surname</mat-label>
													<input
														matInput
														type="text"
														formControlName="surname"
														required
														[errorStateMatcher]="matcher"
														maxlength="40"
													/>
													<mat-error *ngIf="group.get('surname')?.hasError('required')"> This is required </mat-error>
												</mat-form-field>
											</div>
											<div class="col-lg-1 col-md-6 col-sm-12">
												<button
													mat-mini-fab
													class="delete-row-button mb-3"
													matTooltip="Remove previous name"
													(click)="onDeleteRow(i)"
													*ngIf="moreThanOneRowExists"
													aria-label="Remove row"
												>
													<mat-icon>delete_outline</mat-icon>
												</button>
											</div>
											<mat-divider class="mb-3" *ngIf="moreThanOneRowExists"></mat-divider>
										</div>
									</ng-container>
									<div class="row mb-2" *ngIf="isAllowAliasAdd">
										<div class="col-12">
											<button mat-stroked-button (click)="onAddRow()" class="w-auto">
												<mat-icon class="add-icon">add_circle</mat-icon>Add Another Name
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
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
export class AliasesComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	booleanTypeCodes = BooleanTypeCode;

	aliasForm = this.formBuilder.group({
		givenName: new FormControl(''),
		middleName1: new FormControl(''),
		middleName2: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
	});

	form: FormGroup = this.licenceApplicationService.aliasesFormGroup;
	//  this.formBuilder.group({
	// 	previousNameFlag: new FormControl(null, [FormControlValidators.required]),
	// 	aliases: this.formBuilder.array([]),
	// });

	matcher = new FormErrorStateMatcher();

	constructor(
		private formBuilder: FormBuilder,
		private dialog: MatDialog,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				if (loaded.isLoaded) {
					// this.form.patchValue({
					// 	previousNameFlag: this.licenceApplicationService.licenceModel.previousNameFlag,
					// });
					// const aliases = this.licenceApplicationService.licenceModel.aliases ?? [];
					// if (aliases.length > 0) {
					// 	const control = this.form.get('aliases') as FormArray;
					// 	aliases.forEach((item) => {
					// 		control.push(this.licenceApplicationService.aliasesFormGroup);
					// 		// 	this.formBuilder.group({
					// 		// 		givenName: [item.givenName],
					// 		// 		middleName1: [item.middleName1],
					// 		// 		middleName2: [item.middleName2],
					// 		// 		surname: [item.surname, [FormControlValidators.required]],
					// 		// 	})
					// 		// );
					// 	});
					// }
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}

	onPreviousNameFlagChange(): void {
		if (this.form.value.previousNameFlag == BooleanTypeCode.Yes) {
			this.onAddRow();
		} else {
			this.aliases.clear();
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return this.form.value;
	}

	onAddRow() {
		const control = this.form.get('aliases') as FormArray;
		control.push(this.newAliasRow());
	}

	onDeleteRow(index: number) {
		const control = this.form.get('aliases') as FormArray;
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
			message: 'Are you sure you want to remove this previous name?',
			actionText: 'Yes, remove name',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					const control = this.form.get('aliases') as FormArray;
					control.removeAt(index);
				}
			});
	}

	private newAliasRow(): FormGroup {
		return this.formBuilder.group({
			givenName: [''],
			middleName1: [''],
			middleName2: [''],
			surname: ['', [FormControlValidators.required]],
		});
	}

	get getFormControls() {
		const control = this.form.get('aliases') as FormArray;
		return control;
	}

	get aliases(): FormArray {
		return this.form.get('aliases') as FormArray;
	}

	get previousNameFlag(): FormControl {
		return this.form.get('previousNameFlag') as FormControl;
	}

	get moreThanOneRowExists(): boolean {
		return this.aliases.length > 1;
	}

	get isAllowAliasAdd(): boolean {
		return this.aliases.length < SPD_CONSTANTS.maxNumberOfAliases;
	}
}
