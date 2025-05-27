import { Pipe, PipeTransform } from '@angular/core';
import * as CodeDescTypes from '@app/core/code-types/code-desc-types.models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';

@Pipe({
	name: 'options',
	pure: true,
	standalone: false,
})
export class OptionsPipe implements PipeTransform {
	constructor(private utilService: UtilService) {}

	transform(
		input: string | boolean | null | undefined,
		codeTableName: keyof typeof CodeDescTypes,
		defaultValue = ''
	): string {
		if (typeof input == 'boolean') {
			return input ? BooleanTypeCode.Yes : BooleanTypeCode.No;
		}
		return input ? this.utilService.getDescByCode(codeTableName, input) : defaultValue;
	}
}
