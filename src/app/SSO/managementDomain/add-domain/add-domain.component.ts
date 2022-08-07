import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { domain } from 'src/app/model/domain';
import { PostService } from '../../service/post.service';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-domain',
  templateUrl: './add-domain.component.html',
  styleUrls: ['./add-domain.component.scss']
})
export class AddDomainComponent implements OnInit {

  constructor(
    private common: PostService, 
    private formBuilder: FormBuilder,
    private postService: PostService,
    private modalService : NgbModal,
    public activeModal: NgbActiveModal,
    private route: Router
  ) { }

  oneDoMain : domain[]= [];
  modalRef: any ;
  formData:FormGroup; 

  get f(){
    return this.formData.controls;
  }

  ngOnInit(): void {
    this.formData = new FormGroup({
      domainName: new FormControl('',[Validators.required,Validators.maxLength(100)]),
      privateKey: new FormControl('',[Validators.required,Validators.maxLength(100)]),
      description: new FormControl('',[Validators.required,Validators.maxLength(200)]),
      status: new FormControl('',[Validators.required,Validators.maxLength(10)]),
      domainCode: new FormControl('',[Validators.required]),
      hook: new FormControl('',[Validators.required, Validators.maxLength(100)]),
    })
  }

  onSubmit()
  {

    this.postService.addDomain(this.formData.value).subscribe(data => {
     console.log(this.oneDoMain);
     console.log ("submit:", this.formData.value);
     this.activeModal.close('Close click');  
     this.success();
     this.route.navigate(['/domain'])     
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