import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cancel-modal',
  templateUrl: './cancel-modal.html',
  styleUrls: ['./cancel-modal.css']
})
export class CancelModalComponent implements OnInit {
    @Input() data;

    constructor(public modal: NgbActiveModal) { }

    ngOnInit() {
    }

    passBack() {
        this.modal.close(this.data);
    }

}
