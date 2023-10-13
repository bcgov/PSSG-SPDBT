import { Pipe } from '@angular/core';
import { BooleanTypeCode } from 'src/app/api/models';
import * as CodeDescTypes from 'src/app/core/code-types/code-desc-types.models';
import { UtilService } from 'src/app/core/services/util.service';

@Pipe({ name: 'options', pure: true })
export class OptionsPipe {
	constructor(private utilService: UtilService) {}

	transform(
		input: string | boolean | null | undefined,
		codeTableName: keyof typeof CodeDescTypes,
		defaultValue: string = ''
	): string {
		if (typeof input == 'boolean') {
			return input ? BooleanTypeCode.Yes : BooleanTypeCode.No;
		}
		return input ? this.utilService.getDescByCode(codeTableName, input) : defaultValue;
	}
}
