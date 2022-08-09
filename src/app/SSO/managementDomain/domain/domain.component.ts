import { Component, OnInit } from '@angular/core';
import { PostService } from '../../service/post.service';
import { domain } from '../../../model/domain';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDomainComponent } from '../add-domain/add-domain.component';
import { EditDomainComponent } from '../edit-domain/edit-domain.component';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  p: number = 1;
  count: number = 0;
  page: number = 1;
  domainName:any;
  pageSize = 10;
  listDomain : domain[]= [];
  totalSize:number;
 

  constructor(
    private postService: PostService, 
    private modalService : NgbModal,
    private router: Router
    ) { }


  ngOnInit(): void {
    this.onSearch(false);
  }

  getListDomain()
  {
    this.postService.getAllDomain().subscribe(data => {
      console.log(data);
      this.listDomain = data.data.content;
      console.log("Domain",this.listDomain);
    }, error => {
      console.log(error);
      
    })
  }

  openModalAdd(data)
  {
    const modalRef = this.modalService.open(AddDomainComponent, { size : 'lg'})
    modalRef.componentInstance.listDomain = data ;
    modalRef.result.then((data)=>{

    },(reason)=>{
      data = reason;
      this.listDomain ;
    })
  }

  openModalEdit(data)
  {
    const modalRef = this.modalService.open(EditDomainComponent,{ size : 'lg'})
    modalRef.componentInstance.dtDomain = data;
    modalRef.result.then( data=>{

    },reason =>{
      data = reason;
      this.listDomain;
      
    })
  }

//pagination

  public formData:FormGroup = new FormGroup({
    domainName: new FormControl(''),
  })


  onSearch(flag)
  {
    console.log(this.formData.value);
    this.postService.searchDomain( {
      ...this.formData.value, page: this.page, pageSize: this.pageSize
    }).subscribe(data => {
      this.listDomain = data.data.content;
      console.log('list doamin : ',this.listDomain)
      // this.page = data.data.totalElements;
      this.totalSize = data.data.totalElements;
      console.log('_________', this.totalSize)
    }, error => {
      // this.router.navigate(['/account/login']);
      console.log(error);
    })

  }
 
  onPageChange(event: any) {
    this.page = event;
    this.onSearch(true);
  }

  pageChangeEvent(event: any) {
    this.page = 1;
    this.pageSize = event;
    this.onSearch(true);
  }



  // Lock / unclock domain
  
  lockDomain(id)
  {
    this.postService.lockDomain(id).subscribe(data => {
      console.log("success: lock", id);
         console.log('----------',this.listDomain);
         this.onSearch(true);
    }, error => {
      console.log(error);
    })
  }

  unlockDomain(id){
    this.postService.unlockDomain(id).subscribe(data => {
      console.log("success: Unclock", id);
      console.log('----------',this.listDomain);
      this.onSearch(true);
    }, err => {
      console.log(err);
      
    })
  }

  unlockOneDomain(id){
    Swal.fire({
      title:'Mở khóa domain',
      text: 'Bạn có chắc chắn muốn mở khóa domain này không!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Đồng ý!'
      
    }).then(result => {
      if (result.value) {
        Swal.fire('Mở khóa!', 'Bạn vừa mở khóa thành công.','success');
        this.unlockDomain(id);
       
      }
    });
  }

  lockOneDomain(id){
    Swal.fire({
      title: 'Khóa người dùng',
      text: 'Bạn có chắc chắn muốn khóa domain này không!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText:  'Đồng ý',
      
    }).then(result => {
      if (result.value) {
        Swal.fire('Khóa!','Bạn vừa khóa thành công.','success');
        this.lockDomain(id);
      }
    });
  }

}
