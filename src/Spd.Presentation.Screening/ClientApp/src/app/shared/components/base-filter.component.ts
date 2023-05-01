import { Component, EventEmitter, Output } from '@angular/core';

const FILTER_OPERATORS = {
	// equals: '==',
	// notEquals: '!=',
	// greaterThan: '>',
	// lessThan: '<',
	// greaterThanOrEqualTo: '>=',
	// lessThanOrEqualTo: '<=',
	contains: '@=',
	// startsWith: '_=',
	// doesNotContains: '!@=',
	// doesNotStartsWith: '!_=',
	// caseInsensitiveStringContains: '@=*',
	// caseInsensitiveStringStartsWith: '_=*',
	// caseInsensitiveStringEquals: '==*',
	// caseInsensitiveStringNotEquals: '!=*',
	// caseInsensitiveStringDoesNotContains: '!@=*',
	// caseInsensitiveStringDoesNotStartsWith: '!_=*',
};

export interface FilterQueryList {
	key: string;
	operator: keyof typeof FILTER_OPERATORS;
	value: any;
}

const FILTER_QUERY_DELIMITER: string = ',';

@Component({
	selector: 'app-base-filter',
	template: ``,
})
export class BaseFilterComponent {
	@Output() filterChange = new EventEmitter<string>();
	@Output() filterClear = new EventEmitter();
	@Output() filterClose = new EventEmitter();

	emitFilterClear() {
		this.filterClear.emit();
	}

	emitFilterClose() {
		this.filterClose.emit();
	}

	constructFilterString(filterQueryList: FilterQueryList[]) {
		return filterQueryList
			.map((filter) => `${filter.key}${FILTER_OPERATORS[filter.operator]}${filter.value}`)
			.join(FILTER_QUERY_DELIMITER);
	}
}
