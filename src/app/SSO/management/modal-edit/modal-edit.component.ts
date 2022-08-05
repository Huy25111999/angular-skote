import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/auth.models';
import { infor } from 'src/app/model/infor';
import { PostService } from '../../service/post.service';
import { NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { ManagementComponent } from '../management.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss']
})
export class ModalEditComponent implements OnInit {
  @Input() dtUser: any;

  inforUser: any;
  public subscription: Subscription;
  listUsers : infor[]= [];
  constructor(   
    private formBuilder: FormBuilder,
    private postService: PostService,
    public activeModal: NgbActiveModal,
    private route : Router,
    
  ) { }

  editForm: FormGroup = this.formBuilder.group({
    username:['',[Validators.required,Validators.maxLength(100)]],
    password:['',[Validators.required,Validators.minLength(6)]],
    email:['',[Validators.required, Validators.email]],
    phone:['',[Validators.required, Validators.maxLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    address:['',[Validators.required, Validators.maxLength(100)]],
    gender:['',[Validators.required]],
    position:['',[Validators.required, Validators.maxLength(10)]],
    active: null,
    id: null,
  })

  get f(){
    return this.editForm.controls;
  }

  ngOnInit(): void {
    console.log(this.dtUser);
    
    this.postService.getID(this.dtUser.id).subscribe(data => {
      console.log(data);
      this.inforUser = data.data;
      console.log("Id edit: ",this.inforUser);
      this.editForm.patchValue(data.data);

    }, error => {
      console.log(error);

    })

  }

  loadData()
  {
    this.postService.getAllUsers().subscribe(data => {
      console.log(data);
      this.listUsers = data.data.content;
      console.log('list: ',this.listUsers);
    }, error => {
      console.log(error);
    })
  }

  onSubmit() {
    this.editForm.value.gender = parseInt(this.editForm.value.gender);
    this.editForm.value.active = parseInt(this.editForm.value.active);
   
    this.postService.editUser(this.editForm.value).subscribe(data => {
    this.activeModal.dismiss(this.editForm.value);
    this.activeModal.close('Close click');
    this.success();
    // this.route.navigate(['/detail/{{this.dtUser.id}}']) ;
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
      title: 'Sửa người dùng thành công',
      showConfirmButton: false,
      timer: 1500
    });
  }

  error() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Sửa người dùng thất bại',
      showConfirmButton: false,
      timer: 1500
    });
  }
}
