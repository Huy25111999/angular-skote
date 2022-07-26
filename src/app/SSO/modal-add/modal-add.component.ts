import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/auth.models';
import { infor } from 'src/app/model/infor';
import { PostService } from '../service/post.service';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.component.html',
  styleUrls: ['./modal-add.component.scss']
})
export class ModalAddComponent implements OnInit {
  @Input() 
  listUsers : infor[]= [];
  edit:  infor[]= [];
  modalRef: any ;
  
  public formData:FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
    gender: new FormControl(''),
    position: new FormControl('')

  })

  // public formData2 = this.formBuilder.group({
  //   name:['',Validators.required],
  //   age:[''],
    
  // })

  name = '';
  constructor( 
    private common: PostService, 
    private formBuilder: FormBuilder,
    private postService: PostService,
    private modalService : NgbModal,
    public activeModal: NgbActiveModal,
    private route:Router
    ) { }

  ngOnInit(): void {
  }

  onSubmit()
  {
     this.formData.value.gender = parseInt(this.formData.value.gender)
     this.postService.addUser(this.formData.value).subscribe(data => {
      console.log(this.listUsers);
      console.log ("submit:", this.formData.value);
      this.activeModal.close('Close click');  
      this.success();
      this.route.navigate(['/management'])     
    }, error => {
      console.log(error);
      
      this.activeModal.close('Close click');  
      this.error();
    })
  }

  success() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Tạo mới thành công',
      showConfirmButton: false,
      timer: 1500
    });
  }

  error() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Tạo mới thất bại',
      showConfirmButton: false,
      timer: 1500
    });
  }

}
