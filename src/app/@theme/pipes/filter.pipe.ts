import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Filterpipe'
})

export class FilterPipe implements PipeTransform {
    // tslint:disable-next-line: ban-types
    transform(args: any[], value: Object): any {
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        let filter: any;
        if (value !== undefined) {
            const val = args.filter(item => item.id === value);
            filter = val[0];
            // console.log('Argument', filter[0]);
        }
        if (filter !== undefined) {
            return filter.name;
        }
    }
}
