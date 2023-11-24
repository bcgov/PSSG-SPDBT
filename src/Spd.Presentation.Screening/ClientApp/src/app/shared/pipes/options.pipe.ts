import { Pipe, PipeTransform } from '@angular/core';
import * as CodeDescTypes from 'src/app/core/code-types/code-desc-types.models';
import { UtilService } from 'src/app/core/services/util.service';

@Pipe({ name: 'options', pure: true })
export class OptionsPipe implements PipeTransform {
	constructor(private utilService: UtilService) {}

	transform(input: string | undefined, codeTableName: keyof typeof CodeDescTypes, defaultValue = ''): string {
		return input ? this.utilService.getDescByCode(codeTableName, input) : defaultValue;
	}
}
