import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button class="btn btn-primary btn-sm active" (click)="onClick1()">
      <i class="fas fa-broom" aria-hidden="true"></i>
    </button>
    <!--<i
      class="fas fa-clock"
      aria-hidden="true"
      (click)="onClick1()"
      style="color: #9D2449;"></i>-->
  `,
})
export class ButtonColumnAddComponent {
  @Input() label?: string;
  @Input() disabled?: boolean;
  @Input() rowData: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  onClick1() {
    this.onClick.emit(this.rowData);
  }
}
