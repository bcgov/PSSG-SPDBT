import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { GenderTypes } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-personal-information-renew-anonymous',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="middleName1" maxlength="40" />
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
								<input matInput formControlName="middleName2" maxlength="40" />
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Surname</mat-label>
								<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
								<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Date of Birth</mat-label>
								<input
									matInput
									[matDatepicker]="picker"
									formControlName="dateOfBirth"
									[max]="maxBirthDate"
									[errorStateMatcher]="matcher"
								/>
								<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
								<mat-datepicker #picker startView="multi-year"></mat-datepicker>
								<mat-error *ngIf="form.get('dateOfBirth')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>

						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Sex</mat-label>
								<mat-select
									formControlName="genderCode"
									(selectionChange)="onChangeGender($event)"
									[errorStateMatcher]="matcher"
								>
									<mat-option *ngFor="let gdr of genderTypes; let i = index" [value]="gdr.code">
										{{ gdr.desc }}
									</mat-option>
								</mat-select>
								<mat-error *ngIf="form.get('genderCode')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
					</div>

					<ng-container
						*ngIf="
							applicationTypeCode === applicationTypeCodes.Renewal ||
							applicationTypeCode === applicationTypeCodes.Update
						"
					>
						<mat-checkbox formControlName="hasLegalNameChanged" (change)="onUpdateInformation()">
							<span class="checklist-label">Update information</span>
						</mat-checkbox>
					</ng-container>
				</div>
			</div>
			<div class="row mt-2" *ngIf="hasLegalNameChanged.value" @showHideTriggerSlideAnimation>
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

					<div class="text-minor-heading mb-2">Upload your proof of legal name change</div>
					<app-file-upload
						(fileUploaded)="onFileUploaded($event)"
						(fileRemoved)="onFileRemoved()"
						[control]="attachments"
						[maxNumberOfFiles]="10"
						[files]="attachments.value"
					></app-file-upload>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
							form.get('attachments')?.invalid &&
							form.get('attachments')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CommonPersonalInformationRenewAnonymousComponent implements OnInit {
	genderTypes = GenderTypes;
	applicationTypeCodes = ApplicationTypeCode;
	matcher = new FormErrorStateMatcher();

	maxBirthDate = this.utilService.getBirthDateMax();

	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@Output() fileUploaded = new EventEmitter<File>();
	@Output() fileRemoved = new EventEmitter();

	constructor(private utilService: UtilService) {}

	ngOnInit(): void {
		this.disableData(true);
	}

	onFileUploaded(file: File): void {
		this.fileUploaded.emit(file);
	}

	onFileRemoved(): void {
		this.fileRemoved.emit();
	}

	onUpdateInformation(): void {
		if (this.hasLegalNameChanged.value) {
			this.enableData();
		} else {
			this.restoreData();
			this.disableData(true);
		}
	}

	onChangeGender(_event: MatSelectChange): void {
		if (this.applicationTypeCode !== ApplicationTypeCode.Update) return;

		const hasGenderChanged = this.genderCode.value !== this.origGenderCode.value;
		this.form.patchValue({ hasGenderChanged });
	}

	private enableData(): void {
		this.surname.enable({ emitEvent: false });
		this.givenName.enable({ emitEvent: false });
		this.middleName1.enable({ emitEvent: false });
		this.middleName2.enable({ emitEvent: false });
		this.genderCode.enable({ emitEvent: false });
	}

	private disableData(isAllData: boolean | undefined = false): void {
		this.surname.disable({ emitEvent: false });
		this.givenName.disable({ emitEvent: false });
		this.middleName1.disable({ emitEvent: false });
		this.middleName2.disable({ emitEvent: false });
		this.dateOfBirth.disable({ emitEvent: false });
		if (isAllData) {
			this.genderCode.disable({ emitEvent: false });
		}
	}

	private restoreData(): void {
		this.form.patchValue(
			{
				givenName: this.origGivenName.value,
				middleName1: this.origMiddleName1.value,
				middleName2: this.origMiddleName2.value,
				surname: this.origSurname.value,
				genderCode: this.origGenderCode.value,
				hasGenderChanged: false,
			},
			{ emitEvent: false }
		);
	}

	get surname(): FormControl {
		return this.form.get('surname') as FormControl;
	}
	get givenName(): FormControl {
		return this.form.get('givenName') as FormControl;
	}
	get middleName1(): FormControl {
		return this.form.get('middleName1') as FormControl;
	}
	get middleName2(): FormControl {
		return this.form.get('middleName2') as FormControl;
	}
	get dateOfBirth(): FormControl {
		return this.form.get('dateOfBirth') as FormControl;
	}
	get genderCode(): FormControl {
		return this.form.get('genderCode') as FormControl;
	}

	get origGivenName(): FormControl {
		return this.form.get('origGivenName') as FormControl;
	}
	get origMiddleName1(): FormControl {
		return this.form.get('origMiddleName1') as FormControl;
	}
	get origMiddleName2(): FormControl {
		return this.form.get('origMiddleName2') as FormControl;
	}
	get origSurname(): FormControl {
		return this.form.get('origSurname') as FormControl;
	}
	get origGenderCode(): FormControl {
		return this.form.get('origGenderCode') as FormControl;
	}
	get origDateOfBirth(): FormControl {
		return this.form.get('origDateOfBirth') as FormControl;
	}

	get hasLegalNameChanged(): FormControl {
		return this.form.get('hasLegalNameChanged') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
