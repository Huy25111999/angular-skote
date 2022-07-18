import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  geojson = {
    'data':[
      {
        'no':'1',
        'username':'admin',
        'phone':'333344445',
        'address':'Hà Nội',
        'gender': 'Nam',
        'mail':'admin@gmail.com',
        'position':'admin',
      },
      {
        'no':'2',
        'username':'user',
        'phone':'555777888',
        'address':'Hà Nội',
        'gender': 'Nam',
        'mail':'user@gmail.com',
        'position':'user',
      },
      {
        'no':'3',
        'username':'user',
        'phone':'555777888',
        'address':'Hà Nội',
        'gender': 'Nam',
        'mail':'user@gmail.com',
        'position':'user',
      },
      {
        'no':'4',
        'username':'admin',
        'phone':'333344445',
        'address':'Hà Nội',
        'gender': 'Nam',
        'mail':'admin@gmail.com',
        'position':'admin',
      }
    ]
  }
}
