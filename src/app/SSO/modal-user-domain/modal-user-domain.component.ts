import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { domain } from '../../model/domain';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, filter, tap } from 'rxjs/operators'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-user-domain',
  templateUrl: './modal-user-domain.component.html',
  styleUrls: ['./modal-user-domain.component.scss']
})
export class ModalUserDomainComponent implements OnInit {
  @Input() idUser ;
  userDomainJoin : domain[]= [];
  index:any;
  isChecked ;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private userService: UserService,
    private rt:Router

  ) { }

  public formData:FormGroup = new FormGroup({
    id: new FormControl(''),

  })

  ngOnInit(): void {
   
    console.log(this.idUser);
    this.getListUserDomainJoin(this.idUser);
  }

  //User-domain
  getListUserDomainJoin(idUser)
  {
    this.userService.getListUserDomainJoin(idUser).subscribe(data => {
      console.log(data);
      this.userDomainJoin = data.data;
     
      console.log("User-domain:______",this.userDomainJoin);
    }, error => {
      console.log(error);
      
    })
  }

  
// Submit
  onSubmit()
  {
      console.log(this.userDomainJoin);
      const count = 0;
      const domainId = this.userDomainJoin.filter( (e: any) => {  
        if (e.isChecked)
           return e
      }).map( e => e.id);
      console.log(domainId);
      // console.log(listSelected.map(e => e.id));
      console.log('---',domainId)
      this.userService.updateListUserDomainJoin(this.idUser,domainId).subscribe(data => {
        // this.getListUserDomainJoin(this.idUser);
        this.activeModal.dismiss( domainId);
        this.activeModal.close('Close click');    
        this.success();
      }, error => {
        console.log(error);
        
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

}

