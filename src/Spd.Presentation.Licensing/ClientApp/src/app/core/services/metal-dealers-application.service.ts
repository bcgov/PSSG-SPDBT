import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from './config.service';
import { FileUtilService } from './file-util.service';
import { MetalDealersApplicationHelper } from './metal-dealers-application.helper';
import { UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class MetalDealersApplicationService extends MetalDealersApplicationHelper {
	modelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	modelFormGroup: FormGroup = this.formBuilder.group({
		businessOwnerData: this.businessOwnerFormGroup,
		businessManagerData: this.businessManagerFormGroup,
		businessAddressData: this.businessAddressFormGroup,
		businessMailingAddressData: this.businessMailingAddressFormGroup,
		branchesData: this.branchesFormGroup,
		consentAndDeclarationData: this.consentAndDeclarationFormGroup,
	});

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		utilService: UtilService,
		fileUtilService: FileUtilService
	) {
		super(formBuilder, configService, formatDatePipe, utilService, fileUtilService);
	}
}
