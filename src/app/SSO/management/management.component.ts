import { Component, OnInit } from '@angular/core';
// import { publicEncrypt } from 'crypto';
import { ModalAddComponent } from '../modal-add/modal-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})

export class ManagementComponent implements OnInit
{

  constructor(
    private modalService : NgbModal
  ) { }

  ngOnInit(): void {
    console.log(this.geojson.data.length);
    console.log(this.geojson.data);
    // $('#data-table').dataTable();
  }

  public listDataSearch = ['Username','Phone number','Email'];
  dataTable = ['1','admin','333344445','admin@gmail.com','admin',''];

  geojson = {
    'data':[
      {
        'no':'1',
        'username':'admin',
        'phone':'333344445',
        'mail':'admin@gmail.com',
        'position':'admin',
      },
      {
        'no':'2',
        'username':'user',
        'phone':'555777888',
        'mail':'user@gmail.com',
        'position':'user',
      },
      {
        'no':'3',
        'username':'user',
        'phone':'555777888',
        'mail':'user@gmail.com',
        'position':'user',
      },
      {
        'no':'4',
        'username':'admin',
        'phone':'333344445',
        'mail':'admin@gmail.com',
        'position':'admin',
      }
    ]
  }
   public openModal():void
  {
    var open = document.getElementById("modal");
    var container = document.getElementById("containers");
    var topbar = document.getElementById("page-topbar");
    var sidebar = document.getElementById("sidebar-menu");
  }

  onOpenModal(){
    const modalRef = this.modalService.open(ModalAddComponent,{
      windowClass: 'custom-class'
    });
  }

  titleModalEdit()
  {
    var modal = document.getElementById("staticBackdropLabel");
    modal.textContent = "Sửa người dùng" 
  }
  titleModalAdd()
  {
    var modal = document.getElementById("staticBackdropLabel");
    modal.textContent = "Thêm người dùng" 
  }

}

