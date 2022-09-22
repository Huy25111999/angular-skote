import { Component, OnInit,Input  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../service/role.service';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {

  items!: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: true,
    hasCollapseExpand: true
  });

  message: string ;
  err: boolean = false;
  selectValue: any[];
  inforRole: any;

  @Input() dtRole: any=[] ;
  
  selectParamId:any[];
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    public activeModal: NgbActiveModal
  ) { 
    console.log(this.dtRole);
  }

  formData:FormGroup = this.fb.group({
    role:['',[Validators.required]],
    roleCode:['',[Validators.required]],
    status:['',[Validators.required]],
    description:[''],
    systemParamId: ['',]
  })

  get f(){
    return this.formData.controls;
  }

  ngOnInit(): void {

      this.selectValue = [
      {id:1, name:'Kích hoạt', active: true},
      {id:0, name:'Không kích hoạt'}
    ]; 
     

     console.log('Infor role:',this.dtRole); 
     this.formData.patchValue(this.dtRole);

     this.getParamRole();
    //  this.roleService.getRoleByID(this.dtRole.id).subscribe(data =>{
    //     console.log('------Role: ',data);
    //     this.inforRole = data.data;
    //     console.log("Infor a domain : ", this.inforRole)
    //     this.formData.patchValue(data.data);
    //   }, error =>{
    //     console.log(error);
    // })

  }

  getParamRole()
  { 
    this.roleService.getAllParamID().subscribe(data => {
      console.log ("submit:", data);
      this.selectParamId = data.data ;   
    }, error => {
        console.log(error);
      return ;
    })
  }


  onSubmit()
  {
    console.log(this.formData.value);
    
    this.activeModal.close(this.formData.value);  
    //  this.message = '' ;
    //  this.err = false ; 
    //  this.formData.value.status = parseInt(this.formData.value.status);
    //  this.roleService.editRole(this.formData.value).subscribe(data => {
    //   console.log ("submit:", this.formData.value);
    //   this.activeModal.dismiss(this.formData.value);
    //   this.activeModal.close('Close click');  
    //   this.success(); 
      
    // }, error => {
    //   this.err = true ; 
    //   this.message = error ; 
    //   console.log(this.message);
    //   return ;  
    //   this.error();
    // })
  }
  success() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Sửa quyền thành công',
      showConfirmButton: false,
      timer: 1500
    });
  }

  error() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Sửa quyền thất bại',
      showConfirmButton: false,
      timer: 1500
    });
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
