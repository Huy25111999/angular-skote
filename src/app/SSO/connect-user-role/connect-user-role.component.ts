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
  listUserConnect: infor[] = [];
  dataUser:any = [] ;
  messageError: string;

  allChecked = false;

  userGroupRole:any= [];
  isConnect: any = false ;
  @Input() dtIdApp: any ;
  @Input() dtIdGroupRole: any ;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private modalService : NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.getListUsers();
    this.dataUser = {
      "code": 200,
      "status": "success",
      "message": null,
      "data":[ 
        {
          "userId": 31743,
          "fullName": "Lê Văn Huy",
          "username": "levanhuy",
          "password": "$2a$10$WecUXP87iu6BwO2q0fYmV.ksYvTZYK7me.amElasjnkcgiuZNbEcS",
          "email": "huylv@techasians.com",
          "phone": "0368949274",
          "address": "Hưng Yên",
          "active": 1,
          "gender": 1,
          "position": "TTS",
          "createdBy": "admin"
        },
        {
          "userId": 31744,
          "fullName": "Huy Support",
          "username": "levanhuy",
          "password": "$2a$10$WecUXP87iu6BwO2q0fYmV.ksYvTZYK7me.amElasjnkcgiuZNbEcS",
          "email": "huylvsss@techasians.com",
          "phone": "0368949274",
          "address": "Hưng Yên",
          "active": 1,
          "gender": 1,
          "position": "TTS",
          "createdBy": "admin"
        }
      ]
    }

    this.getListUserConnect();

  }

  
  
  formData:FormGroup = this.fb.group({
    userId:[null,[Validators.required]],
  })

  get f(){
    return this.formData.controls;
  }

  getListUsers()
  {
    const idGroup = this.dtIdGroupRole ; 
    this.userService.getAllUsers(idGroup).subscribe(data => {
      console.log('user',data);
      this.listUsers = data.data
      console.log('list: ',this.listUsers);
    }, error => {
      console.log(error);

    })
  }
  
  getListUserConnect(){
    const idGroup = this.dtIdGroupRole ; 
    this.userService.getUserGroupRole(idGroup).subscribe(data => {
      this.listUserConnect = data.data
      console.log('listUserConnect: ',this.listUserConnect);
    }, error => {
      console.log(error);

    })
   // this.listUserConnect = this.dataUser.data;
  }

  // Thêm mới user
  onAddUser(){
    console.log('form',this.formData.value.userId);
    for (let i of this.formData.value.userId){
      this.getOneUser(i);
    }
    this.listUsers ;
  }

  // View infor user
  getOneUser(id)
  {
    this.userService.getID(id).subscribe(data => {

      const user = this.listUserConnect.find((e) => e.userId === id);
      if (user){
        console.log('Usre id đã tồn tại');
       // this.messageError = 'Tên người dùng đã tồn tại, vui lòng chọn lại tên!';
        return ;
      }
   //   this.messageError = "";

   const connectUser = this.listUserConnect.map((e:any)=>{
    return e.username;
    })
    console.log('connectUser', connectUser);
    
    console.log('user exits:', this.check_arr("asians",connectUser));
    this.listUsers = this.listUsers.filter((e:any) =>{
      if (this.check_arr(e.username,connectUser) == false){
        return e
      }
    })

    console.log('---',this.dataUser );
    this.listUserConnect.push(data.data);
    }, error => {
      console.log(error);
    })
    console.log('user: ',id);
  }
    
    
  check_arr(element:any,arr:any){
    let count = 0;
    for (let i = 0; i < arr.length; i ++){
        if (arr[i] === element)  {
            count ++;
            break
        }
    }
    return (count >0) ? true : false
}
// Submit connect user

  formConnectUser:FormGroup = this.fb.group({
    userId:[null,[Validators.required]],
    appId:[''],
    groupRoleId: ['']
  })

  onSubmit()
  {
    console.log('data------:', this.listUserConnect);
    // const user = this.listUserConnect.filter((e:any) =>{
    //   return e
    
    // }).map((k:any)=>{
    //   return {
    //     appId: this.dtIdApp,
    //     groupRoleId:this.dtIdGroupRole,
    //     userId : k.userId
    //   } 
    // })
    

    const user =  this.listUserConnect.map((e:any) =>{ 
      if(e.id){
        return {
         appId: this.dtIdApp,
         groupRoleId: this.dtIdGroupRole,
         userId :e.id
       } 
      }else{
        return {
          appId: this.dtIdApp,
          groupRoleId: this.dtIdGroupRole,
          userId :e.userId
        } 
      }
     
   })
  
    console.log('list id user connect:',user);
      
    this.formConnectUser.value.appId =  this.dtIdApp ;
    this.formConnectUser.value.groupRoleId = this.dtIdGroupRole;
    this.formConnectUser.value.userId = user ; 
    
  

    console.log('value connect user', this.formConnectUser.value);
    this.userService.connectUserRole(this.dtIdGroupRole,user).subscribe(data => {
    this.activeModal.close('Close click');  
    this.connectSuccess();
    }, error => {
      console.log(error);
      
    })

  }

  // Xóa người dùng
  delUser(){
    this.listUserConnect = this.listUserConnect.filter((e:any) =>{
      // if (!e.isChecked){  
      //   const del = this.listUserConnect.splice(e,1);    
      //   return del; 
      // }
      return !e.isChecked;
    })

    console.log('delete user',this.listUserConnect);

  }


  deleteUser(){
    Swal.fire({
      title:'Xóa người dùng',
      text: `Bạn có chắc chắn muốn xóa người dùng này không!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Đồng ý!'

    }).then(result => {
      if (result.value) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Xóa người dùng thành công.',
          showConfirmButton: false,
          timer: 1500
        });
        this.delUser();

      }
    });
  }

  // set all checkbox
  updateAllChecked()
  {
    if(this.allChecked){
      this.listUserConnect.filter((e:any) =>{
        return e.isChecked = true;
      })

      const userId = this.listUserConnect.map((e:any) => {
        return e.userId
      })
      console.log(userId)
    }
    else{
      this.listUserConnect.filter((e:any) =>{
        return e.isChecked = false;
      })
      
    }
  }

//-----------------------------
  submit()
  {
    this.formData.value.appId =  this.dtIdApp ;
    this.formData.value.groupRoleId = this.dtIdGroupRole;
    console.log('form data user', this.formData.value);
    this.userGroupRole = this.formData.value;
    this.isConnect = true;
    this.success();

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

  
  connectSuccess() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Lưu thành công',
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

  closeModal(){
    this.activeModal.close('Close click'); 
  }


}
