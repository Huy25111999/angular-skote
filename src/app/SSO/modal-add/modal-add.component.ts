import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.component.html',
  styleUrls: ['./modal-add.component.scss']
})
export class ModalAddComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



  inputData = ['Tên người dùng (*)','Mật khẩu (*)','Email (*)','Số điện thoại','Địa chỉ']
  comboData = ['Hoạt động','Giới tính']

}
