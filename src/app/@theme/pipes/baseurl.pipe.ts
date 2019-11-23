import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({ name: 'baseURL' })

export class BaseURLPipe implements PipeTransform {

  transform(input: string): string {
    const url = input.startsWith('http');
    if (url) {
        return input;
    } else {
        return input;
        // input && input.length
        // ? environment.adminUrl + input.replace('public/', '/')
        // : input;
    }
  }

}
