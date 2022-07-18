import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  constructor() { }

  geojson = {
    'data':[
      {
        'no':'1',
        'domain':'Quiz online',
        'key':'cdadasdasdaha',
        'description':'admin',
        'created-date' : '06/06/2022 12:12:12',
        'status':'active'
      },
      {
        'no':'2',
        'domain':'Quiz online',
        'key':'asdasdasdasdads',
        'description':'admin',
        'created-date' : '07/06/2022 12:12:12',
        'status':'active'
      },
      {
        'no':'3',
        'domain':'Quiz online',
        'key':'sdasdasdasdads',
        'description':'admin',
        'created-date' : '08/06/2022 12:12:12',
        'status':'active'
      }
    ]
  }
  dtOptions: DataTables.Settings = {};
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu : [5, 10, 25],
      processing: true
    };
  }

}
