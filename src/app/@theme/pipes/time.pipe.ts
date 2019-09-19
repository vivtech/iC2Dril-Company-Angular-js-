import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minuteSeconds'
})

export class MinuteSecondsPipe implements PipeTransform {

    transform(value: number): string {
        const minutes: number = Math.floor(value / 60);
        if (minutes < 1) {
            return (value - minutes * 60) + ' min';
        }
        if (value - minutes * 60 < 1) {
            return minutes + ' hr';
        }
        return minutes + ' hr ' + (value - minutes * 60) + ' min';
    }
}
