import { Component, OnInit,Input  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../service/role.service';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
@Component({
  selector: 'app-edit-by-role',
  templateUrl: './edit-by-role.component.html',
  styleUrls: ['./edit-by-role.component.scss']
})
export class EditByRoleComponent implements OnInit {

  items!: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: true,
    hasCollapseExpand: true
  });

  message: string ;
  err: boolean = false;
  selectValue: any[];
  inforRole: any;

  @Input() dtEditRole: any=[] ;
  
  selectParamId:any[];
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    public activeModal: NgbActiveModal
  ) { 
    console.log('edit role',this.dtEditRole);
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
  //   this.getParamRole();

     console.log('Infor role edit:',this.dtEditRole);
     this.formData.patchValue(this.dtEditRole);
     this.getParamRole();

  }

  getParamRole()
  { 
    this.roleService.getAllParamID().subscribe(data => {
      console.log ("submit:", data);
      this.selectParamId = data.data;  
    }, error => {
        console.log(error);
      return ;
    })
  }


  onSubmit()
  {
    console.log(this.formData.value);
    
   // this.activeModal.close(this.formData.value);
   console.log('index',this.dtEditRole.roleId);  
     this.message = '' ;
     this.err = false ; 
     this.formData.value.status = parseInt(this.formData.value.status);
     this.roleService.editRole({roleId:this.dtEditRole.roleId,...this.formData.value}).subscribe(data => {
      console.log ("submit111:", this.formData.value);
      this.activeModal.dismiss(this.formData.value);
      this.activeModal.close('Close click');  
      this.success(); 
      
    }, error => {
      this.err = true ; 
      this.message = error ; 
      console.log(this.message);
      return ;  
      this.error();
    })
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
