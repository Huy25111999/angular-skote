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
  
  public formData:FormGroup = new FormGroup({
    domainName: new FormControl(''),
    privateKey: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl(''),
    domainCode: new FormControl(''),
    hook: new FormControl(''),
  })
  ngOnInit(): void {
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
