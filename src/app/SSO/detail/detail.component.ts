import { Component, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { infor } from 'src/app/model/infor';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditComponent } from '../modal-edit/modal-edit.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
}) 
export class DetailComponent implements OnInit {

  // inforUser: infor[] = [];
  data:any ;
  index:any;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private modalService: NgbModal
  ) { }
  
  ngOnInit(): void {
     this.index = this.route.snapshot.params['id'];
    this.getDetailUser(this.index);
  }

  // Get ID
  getDetailUser(id){
    this.postService.getID(id).subscribe((res:any)=>{
      this.data = res.data;
      console.log('detail : ',this.data);
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


}
