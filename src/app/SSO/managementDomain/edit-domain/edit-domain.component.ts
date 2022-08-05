import { Component, Input, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../../service/post.service';
import { domain } from 'src/app/model/domain';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-domain',
  templateUrl: './edit-domain.component.html',
  styleUrls: ['./edit-domain.component.scss']
})
export class EditDomainComponent implements OnInit {
  @Input() dtDomain: any ;
  oneDomain: domain[] = [];
  inforDomain: any;
  public subcription: Subscription ; 
  
  constructor(
    private postService: PostService,
    public activeModal: NgbActiveModal,
    private formBuilder:FormBuilder,
    private route: Router

  ) { }

  editForm:FormGroup = this.formBuilder.group({
    domainName: null,
    privateKey: null,
    description: null,
    status: null,
    domainCode: null,
    hook: null,
    id:null,
  })

  ngOnInit(): void {
    console.log(this.dtDomain);
    this.postService.getDomainByID(this.dtDomain.id).subscribe(data =>{
      console.log('------',data.data);
      this.inforDomain = data.data;
      console.log("Infor a domain : ", this.inforDomain)
      this.editForm.patchValue(data.data);
    }, error =>{
      console.log(error);
    })
  }

  loadData()
  {
    this.postService.getAllDomain().subscribe(data => {
      console.log(data);
      this.oneDomain = data.data.content;
      console.log('list: ',this.oneDomain);
    }, error => {
      console.log(error);
    })
  }

  onSubmit()
  {
      this.editForm.value.status = parseInt(this.editForm.value.status);
      this.postService.editDomain(this.editForm.value).subscribe(data => {
      this.activeModal.dismiss(this.editForm.value);
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
      title: 'Sửa domain thành công',
      showConfirmButton: false,
      timer: 1500
    });
  }

  error() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Sửa domain thất bại',
      showConfirmButton: false,
      timer: 1500
    });
  }
}
