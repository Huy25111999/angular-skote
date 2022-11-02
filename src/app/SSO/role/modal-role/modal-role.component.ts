import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { RoleService } from '../../service/role.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

@Component({
  selector: 'app-modal-role',
  templateUrl: './modal-role.component.html',
  styleUrls: ['./modal-role.component.scss']
})
export class ModalRoleComponent implements OnInit {
  
  items!: TreeviewItem[];
  dropdownEnabled = true;
  checkDataCurrent = null;
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  message: string ;
  err: boolean = false;
  selectStatus: any[];
  selectParamId: any[];
  defaultValue;

  @Input() dtIdRole: any ;
  isRole:boolean = true;
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    console.log('dtIdRole:', this.dtIdRole);
    this.selectStatus = [
      {id:1, name:'Kích hoạt', active: true},
      {id:0, name:'Không kích hoạt'}
    ]; 

    this.defaultValue = 1
    this.getParamRole();
  }

  formData:FormGroup = this.fb.group({
    appId:'',
    role:['',[Validators.required,Validators.maxLength(200)]],
    roleCode:['',[Validators.required,Validators.maxLength(30)]],
    status:[null,Validators.required],
    description:[''],
    systemParamId: [null,Validators.required]
  })

  get f(){
    return this.formData.controls;
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
    this.formData.value.appId = this.dtIdRole ; 
    this.activeModal.close(this.formData.value);  
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
  
    onFilterChange(value: string): void {
    console.log('filter:', value);
  }

  success() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Thêm mới quyền thành công',
      showConfirmButton: false,
      timer: 1500
    });
  }

  error() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Thêm mới quyền thất bại',
      showConfirmButton: false,
      timer: 1500
    });
  }
}
