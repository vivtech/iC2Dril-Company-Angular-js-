import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duration'
})
export class DurationPipe implements PipeTransform {
    transform(value: number, data: any): string {
        switch (value) {
            case 1:
                return 'medium';
                break;
            case 2:
                return 'shortTime';
                break;
            case 3:
                return 'h:mm a, EEEE';
                break;
            case 4:
                return  'd, h:mm a'
                break;
        }
    }
}
