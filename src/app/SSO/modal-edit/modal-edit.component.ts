import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss']
})
export class ModalEditComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  inputData = ['Tên người dùng (*)','Mật khẩu (*)','Email (*)','Số điện thoại','Địa chỉ']
  comboData = ['Hoạt động','Giới tính']

}
