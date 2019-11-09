import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minuteSeconds'
})

export class MinuteSecondsPipe implements PipeTransform {

    transform(value: number): string {
        const minutes: number = Math.floor(value / 60);
        if (minutes < 1) {
            return (value - minutes * 60 <= 1) ? (value - minutes * 60) + ' min' : (value - minutes * 60) + ' mins';
        } else if (value - minutes * 60 < 1) {
            return (minutes <= 1) ?  minutes + ' hr' : minutes + ' hrs';
        }
        // tslint:disable-next-line: max-line-length
        return (minutes <= 1) ?  minutes + ' hr' : minutes + ' hrs' + (value - minutes * 60 <= 1) ? (value - minutes * 60) + ' min' : (value - minutes * 60) + ' mins';
    }
}
