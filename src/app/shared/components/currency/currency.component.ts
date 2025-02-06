import { Component, OnInit } from '@angular/core';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Directive({
  selector: '[appCurrency]'
})
export class CurrencyComponent{
  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private currencyPipe: CurrencyPipe
  ) {
    this.el = this.elementRef.nativeElement;
   }

   @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    let value = this.el.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters
    value = this.currencyPipe.transform(value, 'BOB', 'symbol', '1.2-2') || '';
    this.el.value = value;
  }

}
