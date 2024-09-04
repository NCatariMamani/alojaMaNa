import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
     <button class="btn btn-success btn-sm active" (click)="onClick1()">
      <i class="fas fa-hand-point-left" aria-hidden="true"></i>
    </button> 
   <!-- <i
      class="fa fa-eye"
      aria-hidden="true"
      (click)="onClick1()"
      style="color: #9D2449;"></i>-->
  `,
})
export class ButtonColumnInputComponent {
  @Input() label?: string;
  @Input() disabled?: boolean;
  @Input() rowData: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  onClick1() {
    this.onClick.emit(this.rowData);
  }
}
