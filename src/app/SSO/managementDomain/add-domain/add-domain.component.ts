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
  message: string ; 
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
  err: boolean = false;

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
    this.message = '' ;
    this.err = false ; 
    this.postService.addDomain(this.formData.value).subscribe(data => {
     console.log(this.oneDoMain);
     console.log ("submit:", this.formData.value);
     this.activeModal.close('Close click');  
     this.activeModal.dismiss(this.formData.value);
     this.success();
     this.route.navigate(['/domain'])     
   }, error => {
      this.err = true ;   
      this.message = error ; 
      console.log(this.message);
      return ;

    //  this.activeModal.close('Close click');  
    //  this.error();
   })
  }

  closeModal(){
    Swal.fire({
      text: 'Dữ liệu nhập chưa được lưu lại, bạn có muốn đóng tab không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText:  'Đồng ý',

    }).then(result => {
      if (result.value) {
          this.activeModal.close('Close click'); 
      }
    });
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
