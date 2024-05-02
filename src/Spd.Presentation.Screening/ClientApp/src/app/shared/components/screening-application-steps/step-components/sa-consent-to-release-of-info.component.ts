import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceTypeCode } from 'src/app/api/models';
import { UtilService } from 'src/app/core/services/util.service';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { AppInviteOrgData, CrcFormStepComponent } from '../screening-application.model';

@Component({
	selector: 'app-sa-consent-to-release-of-info',
	template: `
		<section class="step-section p-3">
			<form [formGroup]="form" novalidate>
				<div class="step">
					<app-step-title title="Consent to a Criminal Record Check"></app-step-title>

					<div class="row">
						<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
							<div class="conditions p-3 mb-3">
								<ng-container *ngIf="isMcfd">
									<app-sa-consent-to-release-mcfd
										[form]="form"
										(checkboxChanged)="onCheckboxChange()"
									></app-sa-consent-to-release-mcfd>
								</ng-container>

								<ng-container *ngIf="isCrrpa">
									<app-sa-consent-to-release-crrpa
										[form]="form"
										(checkboxChanged)="onCheckboxChange()"
									></app-sa-consent-to-release-crrpa>
								</ng-container>

								<ng-container *ngIf="isPssoa">
									<app-sa-consent-to-release-pssoa
										[form]="form"
										(checkboxChanged)="onCheckboxChange()"
									></app-sa-consent-to-release-pssoa>
								</ng-container>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="offset-md-2 col-md-8 col-sm-12 mt-4">
							<mat-form-field class="w-auto" style="background-color: unset;">
								<mat-label>Date Signed</mat-label>
								<input matInput formControlName="dateSigned" [errorStateMatcher]="matcher" />
								<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</form>
		</section>
	`,
	styles: [
		`
			.conditions {
				border: 1px solid var(--color-grey-light);
				box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
			}
		`,
	],
})
export class SaConsentToReleaseOfInfoComponent implements CrcFormStepComponent {
	matcher = new FormErrorStateMatcher();
	// crrpa flow uses agreeToCriminalCheck, agreeToVulnerableSectorSearch, check1, check2, check3, check4, check5, check6
	// pssoa flow uses agreeToCriminalCheck, check1, check2, check3
	// mcfd flow uses agreeToCriminalCheck, check1, check2, check3, check4, check5

	private _orgData: AppInviteOrgData | null = null;
	@Input() set orgData(value: AppInviteOrgData | null) {
		this._orgData = value;

		const isMcfd = value?.serviceType === ServiceTypeCode.Mcfd;

		this.form = this.formBuilder.group({
			agreeToCriminalCheck: new FormControl(null, [Validators.requiredTrue]),
			agreeToVulnerableSectorSearch: new FormControl(null, value?.isCrrpa ? [Validators.requiredTrue] : []),
			check1: new FormControl(null, [Validators.requiredTrue]),
			check2: new FormControl(null, [Validators.requiredTrue]),
			check3: new FormControl(null, [Validators.requiredTrue]),
			check4: new FormControl(null, isMcfd || value?.isCrrpa ? [Validators.requiredTrue] : []),
			check5: new FormControl(null, isMcfd || value?.isCrrpa ? [Validators.requiredTrue] : []),
			check6: new FormControl(null, value?.isCrrpa ? [Validators.requiredTrue] : []),
			dateSigned: new FormControl(null, [Validators.required]),
		});
	}
	get orgData(): AppInviteOrgData | null {
		return this._orgData;
	}

	form!: FormGroup;

	constructor(private formBuilder: FormBuilder, private utilService: UtilService) {}

	getDataToSave(): any {
		return {
			...this.form.value,
		};
	}

	isFormValid(): boolean {
		if (!this.form.valid) {
			this.utilService.scrollToCheckbox();
		}

		return this.form.valid;
	}

	onCheckboxChange(): void {
		const data = this.form.value;
		if (this.isMcfd) {
			if (data.agreeToCriminalCheck && data.check1 && data.check2 && data.check3 && data.check4 && data.check5) {
				this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
			} else {
				this.form.controls['dateSigned'].setValue('');
			}
		} else if (this.isCrrpa) {
			if (
				data.agreeToCriminalCheck &&
				data.agreeToVulnerableSectorSearch &&
				data.check1 &&
				data.check2 &&
				data.check3 &&
				data.check4 &&
				data.check5 &&
				data.check6
			) {
				this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
			} else {
				this.form.controls['dateSigned'].setValue('');
			}
		} else {
			if (data.agreeToCriminalCheck && data.check1 && data.check2 && data.check3) {
				this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
			} else {
				this.form.controls['dateSigned'].setValue('');
			}
		}
	}

	get isMcfd(): boolean {
		return this.orgData?.serviceType === ServiceTypeCode.Mcfd;
	}
	get isCrrpa(): boolean {
		return !this.isMcfd && this.orgData!.isCrrpa;
	}
	get isPssoa(): boolean {
		return !this.isMcfd && !this.orgData!.isCrrpa;
	}
}
