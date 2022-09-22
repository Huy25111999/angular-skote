import { Component, OnInit, Input } from '@angular/core';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { infor } from 'src/app/model/infor';

@Component({
  selector: 'app-connect-user-role',
  templateUrl: './connect-user-role.component.html',
  styleUrls: ['./connect-user-role.component.scss']
})
export class ConnectUserRoleComponent implements OnInit {

  listUsers : infor[] = [];
  isChecked ;
  @Input() dtIdUserRole: any ;
  @Input() dtIdGroupRole: any ;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private modalService : NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.getListUsers();
  }

  
  formData:FormGroup = this.fb.group({
    userId:[''],
    appId:[''],
    groupRoleId: ['']
  })

  get f(){
    return this.formData.controls;
  }

  getListUsers()
  {
    this.userService.getAllUsers().subscribe(data => {
      console.log(data);
      this.listUsers = data.data
      console.log('list: ',this.listUsers);
    }, error => {
      console.log(error);

    })
  }

  onSubmit(id)
  {
      console.log('listUser: ',this.listUsers,"\n id group",this.dtIdGroupRole,this.dtIdUserRole);
      const count = 0;
      // const userId = this.listUsers.filter( (e: any) => {  
      //   if (e.isChecked)
      //      return e
      // }).map( e => e.id);
      // console.log('---',userId);

      this.formData.value.userId = id;
      this.formData.value.appId =  this.dtIdUserRole ;
      this.formData.value.groupRoleId = this.dtIdGroupRole;
      this.userService.connectUserRole(this.formData.value).subscribe(data => {
      this.activeModal.close('Close click');    
      }, error => {
        console.log(error);
        
      })

  }

  closeModal(){
    Swal.fire({
      text: 'Bạn có chắc chắn muốn hủy không?',
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


}
