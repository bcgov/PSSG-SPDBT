import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LicenceFeeService, WorkerLicensingService } from 'src/app/api/services';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { LicenceApplicationHelper } from './licence-application.helper';

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationService extends LicenceApplicationHelper {
	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		workerLicensingService: WorkerLicensingService,
		licenceFeeService: LicenceFeeService,
		formatDatePipe: FormatDatePipe
	) {
		super(formBuilder, configService, licenceFeeService, workerLicensingService, formatDatePipe);
	}
}
