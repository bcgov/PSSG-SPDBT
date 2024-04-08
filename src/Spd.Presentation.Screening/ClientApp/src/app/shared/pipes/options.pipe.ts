import { Pipe, PipeTransform } from '@angular/core';
import * as CodeDescTypes from 'src/app/core/code-types/code-desc-types.models';
import { UtilService } from 'src/app/core/services/util.service';

@Pipe({ name: 'options', pure: true })
export class OptionsPipe implements PipeTransform {
	constructor(private utilService: UtilService) {}

	transform(input: string | undefined, codeTableName: keyof typeof CodeDescTypes, defaultValue = ''): string {
		if (!input) {
			return defaultValue;
		}
		const desc = this.utilService.getDescByCode(codeTableName, input);
		return desc ? desc : defaultValue;
	}
}
