import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { error } from 'console';
import * as FileSaver from 'file-saver';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/SSO/service/destroy.service';
import { RoleService } from 'src/app/SSO/service/role.service';

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.scss']
})
export class ImportFileComponent implements OnInit {

  @ViewChild('fileInput') fileInputRef!: ElementRef;
  @Input() dialogData: any = {};
  file!: File | null;
  fileResult: any;
  total = 0;
  totalErr = 0;
  isSpinning = false;
  observer = {
    next: (val: any) => {
      this.isSpinning = false;
      this.saveFile(val);
    },
    error: async (e: Error) => {
      const message = await this.convertBlobToJson(e);
      alert("error")
    },
    complete: () => { }
  }
  
  constructor(
    private translate: TranslateService,
    private roleService: RoleService,
    private destroy:DestroyService

  ) { }

  ngOnInit(): void {
  }

  dragDrop(event: any) {
    if (event) {
      const file: File = event[0];
      if (!file.name.endsWith('.xlsx')) {
        alert("error")
        return;
      }
      this.file = file;
    }
  }
  clear() {
    this.file = null;
    this.fileInputRef.nativeElement.value = null;
    this.fileResult = null;
    this.total = 0;
    this.totalErr = 0;
  }

  downloadTemplate() {
    this.isSpinning = true;
   // if (this.dialogData.featute === 'agent') {
      this.roleService.downloadTemplate().subscribe(
        (res) => {
          this.isSpinning = false;
          this.downLoadFile(res, 'IMPORT_DAI_LY.xlsx');
        }, error =>{
          this.downLoadFile('abc', 'IMPORT_DAI_LY.xlsx');
        }
      );
    //} 
  }

  downLoadFile(res: any, fileName: string) {
    const data = new Blob([res], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(data, fileName);
  }

  openUploadCVFile(event: any) {
    if (
      event &&
      event.target &&
      event.target.files &&
      event.target.files.length
    ) {
      const file: File = event.target.files[0];
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        alert("error")
        return;
      }
      if (file.size > (2 * 1024 * 1024)) {
        alert('error')
        return;
      }
      this.file = file;
      console.log("event import file", event);
      
      console.log("this.file", this.file);
      
    }
  }

  onUpload() {
    if (!this.file) {
      alert("error")
      return;
    }
    this.isSpinning = true;
    const formData: FormData = new FormData();
    formData.append('file', this.file, this.file.name);
    this.roleService.uploadCud(formData).subscribe(
      //this.observer
      res =>{
        this.saveFile(res);
      },error =>{
        console.log("message errỏ", error);
      }
    );
  }
  async convertBlobToJson(e: any) {
    return JSON.parse(await e.error.text()).message;
  }

  saveFile(res: any) {
    this.fileResult = new Blob([res.body], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });    
    this.total = res.headers.get('total')
      ? Number(res.headers.get('total'))
      : 0;
    this.totalErr = res.headers.get('totalErr')
      ? Number(res.headers.get('totalErr'))
      : 0;
      alert("success")
  }


  downloadFileResult() {
    FileSaver.saveAs(this.fileResult, 'KET_QUA_IMPORT_DAI_LY.xlsx');
  }

}
