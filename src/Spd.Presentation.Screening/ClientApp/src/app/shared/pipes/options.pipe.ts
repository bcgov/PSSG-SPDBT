import { Pipe } from '@angular/core';
import * as CodeDescTypes from 'src/app/core/code-types/code-desc-types.models';
import { UtilService } from 'src/app/core/services/util.service';

@Pipe({ name: 'options', pure: true })
export class OptionsPipe {
	constructor(private utilService: UtilService) {}

	transform(input: string | undefined, codeTableName: keyof typeof CodeDescTypes, defaultValue: string = ''): string {
		return input ? this.utilService.getCodeDesc(codeTableName, input) : defaultValue;
	}
}
