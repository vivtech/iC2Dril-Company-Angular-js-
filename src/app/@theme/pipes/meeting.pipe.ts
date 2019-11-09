import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'meetingpipe'
})

export class MeetingPipe implements PipeTransform {

    transform(expiryDate: any, type: number) {
        console.log('meetingPipe', expiryDate, type);
        if (type === 1) {
            const oldDate = Date.parse(expiryDate);
            const checkExpire = Date.now() < oldDate;
            return checkExpire;
        } else {
            return true;
        }
    }
}
