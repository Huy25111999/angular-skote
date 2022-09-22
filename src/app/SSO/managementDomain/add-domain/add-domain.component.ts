import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { domain } from 'src/app/model/domain';
import { UserService } from '../../service/user.service';
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
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private modalService : NgbModal,
    public activeModal: NgbActiveModal,
    private route: Router
  ) { }

  oneApp : domain[]= [];
  modalRef: any ;
  err: boolean = false;


  ngOnInit(): void {
    
  }
  
  formData:FormGroup = this.fb.group({
    id:[''],
    app:['',[Validators.required]],
    appCode:['',[Validators.required]],
    privateKey:['',[Validators.required]],
    status:['',[Validators.required]],
    description:['',[Validators.required]],
    hook: ['',[Validators.required]],
  })

  get f(){
    return this.formData.controls;
  }

  onSubmit()
  {
    console.log ("submit:", this.formData.value);
    this.userService.addDomain(this.formData.value).subscribe(data => {
     console.log(this.oneApp);
     console.log ("submit:", this.formData.value);
     this.activeModal.close('Close click');  
     this.activeModal.dismiss(this.formData.value);
     this.success();
    // this.route.navigate(['/domain'])     
   }, error => {
      this.err = true ;   


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
