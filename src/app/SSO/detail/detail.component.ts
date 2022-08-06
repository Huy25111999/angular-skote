import { Component, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { infor } from 'src/app/model/infor';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditComponent } from '../management/modal-edit/modal-edit.component';
import { domain } from '../../model/domain';
import { EditDomainComponent } from '../managementDomain/edit-domain/edit-domain.component';
import { ModalUserDomainComponent } from '../modal-user-domain/modal-user-domain.component';
import { param } from 'jquery';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
}) 
export class DetailComponent implements OnInit {
  dataUser:any;
  index:any;
  listDomain : domain[]= [];

  username;
  email;
  address;
  phone;
  gender;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private modalService: NgbModal
  ) {
    this.index = this.route.snapshot.params['id'];
   }
  
  ngOnInit(): void {
    this.getListUserDomain(this.index);
    this.getDetailUser(this.index);
    
  }

  // Get ID
  getDetailUser(id){
    this.postService.getID(id).subscribe((res)=>{
      this.dataUser = res.data;
      console.log('detail : ',this.dataUser);
      this.username = this.dataUser.username;
      this.email = this.dataUser.email;
      this.address = this.dataUser.address;
      this.phone = this.dataUser.phone ;
      this.gender = this.dataUser.gender ; 
    });   
     
  }

  // Edit user
  openModalEdit(data)
  {
    const modalRef = this.modalService.open(ModalEditComponent, {size : 'lg'})
    modalRef.componentInstance.dtUser = data;
    modalRef.result.then((data) => {
      
      
    }, (reason) => {
      data = reason;
      this.getDetailUser(this.index);
    })
    
  }

  // Edit domain
  openEditDomain(data)
  {
    const modalRef = this.modalService.open(EditDomainComponent, {size : 'lg'})
    modalRef.componentInstance.dtUser = data;
    modalRef.result.then((data) => {
      
      
    }, (reason) => {
      data = reason;
      this.getDetailUser(this.index);
    })
    
  }

  //User-domain
  getListUserDomain(id)
  {
    this.postService.getUserDomain(id).subscribe(data => {
      console.log(data);
      this.listDomain = data.data;
      console.log("User-domain",this.listDomain);
    }, error => {
      console.log(error);
      
    })
  }
  

  openModalUserDomain(data: any)
  {
    const modalRef = this.modalService.open(ModalUserDomainComponent, { size : 'lg'})
    modalRef.componentInstance.idUser = data ;
    modalRef.result.then((data)=>{

    },(reason)=>{
      data = reason;
      this.getListUserDomain(this.index);
    })
    
  }



  // Submit update
  onUpdate()
  {
      console.log('Update: ',this.listDomain);
      const list : [] = [];
      const domainId = this.listDomain.filter( (e: any) => {  
        if (e.isChecked)
          return e
      }).map( e => e.id);
    
      this.postService.deleteListUserDomainJoin(this.index,domainId).subscribe(data => {
        console.log('update',data);
        this.getListUserDomain(this.index);
        
      }, error => {
        console.log(error);
        
      })
      this.getListUserDomain(this.index);
  }  

  
  deleteDomain(){
    Swal.fire({
      title: 'Xóa liên kết domain',
      text: 'Bạn có chắc chắn muốn khóa domain này không!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText:  'Đồng ý',
      
    }).then(result => {
      if (result.value) {
        Swal.fire('Khóa!','Bạn vừa khóa thành công.','success');
        this.onUpdate();
      }
    });
  }
}
