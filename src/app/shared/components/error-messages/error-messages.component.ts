import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-messages',
  templateUrl: './error-messages.component.html',
  styleUrls: ['./error-messages.component.scss']
})
export class ErrorMessagesComponent implements OnInit {
  @Input() errorMsg: string;
  @Input() displayError: boolean;

  constructor() { }
  ngOnInit(): void {
  }
  ngOnchange(): void {
  }
}