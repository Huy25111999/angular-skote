import { Component, OnInit } from '@angular/core';
import { PostService } from '../../service/post.service';
import { domain } from '../../../model/domain';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDomainComponent } from '../add-domain/add-domain.component';
import { EditDomainComponent } from '../edit-domain/edit-domain.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  p: number = 1;
  count: number = 0;
  listDomain : domain[]= [];

  constructor(
    private postService: PostService, 
    private modalService : NgbModal,
    ) { }

  // dtOptions: DataTables.Settings = {};
  ngOnInit(): void {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 5,
    //   lengthMenu : [5, 10, 25],
    //   processing: true
    // };
    this.getListDomain();
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

  // Lock / unclock domain

  // getIdUser(id)
  // {
  //   this.postService.getID(id).subscribe(data => {
  //     console.log(id);
  //     this.listDomain = data;
  //     console.log('list: ',this.listDomain)
  //   }, error => {
  //     console.log(error);
  //   })
  //   console.log('user: ',id);
  //   console.log('----------',this.listDomain);
    
  // }
  
  lockDomain(id)
  {
    this.postService.lockDomain(id).subscribe(data => {
      console.log("success: lock", id);
         console.log('----------',this.listDomain);
    }, error => {
      console.log(error);
    })
  }

  unlockDomain(id){
    this.postService.unlockDomain(id).subscribe(data => {
      console.log("success: Unclock", id);
      console.log('----------',this.listDomain);
    }, err => {
      console.log(err);
      
    })
  }

  lockOneDomain(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Khóa domain',
        text: 'Bạn có chắc chắn muốn khóa domain này không!',
        icon: 'warning',
        confirmButtonText: 'Yes, lock it!',
        cancelButtonText: 'No, cancel!',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            'Khóa!',
            'Bạn vừa khóa thành công.',
            'success'
          );
          this.lockDomain(id);

        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Khóa domain thất bại:)',
            'error'
          );
        }
      });
  }

  
  unlockOneDomain(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Mở khóa domain',
        text: 'Bạn có chắc chắn muốn mở khóa domain này không!',
        icon: 'warning',
        confirmButtonText: 'Yes, unlock it!',
        cancelButtonText: 'No, cancel!',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            'Mở khóa!',
            'Bạn vừa mở khóa thành công.',
            'success'
          );
          
          this.unlockDomain(id);

        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Mở khóa thất bại',
            'error'
          );
        }
      });
  }

}
