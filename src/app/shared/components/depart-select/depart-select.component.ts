import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TreeviewI18n, TreeviewItem, TreeviewConfig, DropdownTreeviewComponent, TreeviewHelper } from 'ngx-treeview';
import { DropdownTreeviewSelectI18n } from './dropdown-treeview-select-i18n-custom';
import { isNil } from 'lodash';
import { AbstractControl} from "@angular/forms"

@Component({
  selector: 'app-depart-select',
  templateUrl: './depart-select.component.html',
  styleUrls: ['./depart-select.component.scss'],
  providers: [
    {provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n}
  ]
})
export class DepartSelectComponent implements OnChanges {

  //@Input() config: TreeviewConfig;
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
      decoupleChildFromParent: true,
    hasFilter: true,
    maxHeight: 500
  });

  @Output() isFocus = new EventEmitter<boolean>();
  @Input() placeholder: any = 'Chọn giá trị';
  @Input() items: TreeviewItem[];
  @Input() value: any;
  @Input() fullList: any[]= [];
  @Input() control: AbstractControl;
  @Input() isRequired: boolean = true;
  @Output() valueChange = new EventEmitter<any>();
  @Output () isOpenEvent = new EventEmitter<any>();
  @ViewChild(DropdownTreeviewComponent, { static: false }) dropdownTreeviewComponent: DropdownTreeviewComponent;
  filterText: string;
  isShowSelect  = false;
  isOpen = false;
  title: string = '';

  private dropdownTreeviewSelectI18n: DropdownTreeviewSelectI18n;
  constructor(
    public i18n: TreeviewI18n
  ) {
    this.dropdownTreeviewSelectI18n = i18n as DropdownTreeviewSelectI18n;
  }

  ngOnChanges(changes: SimpleChanges): void {
   // throw new Error('Method not implemented.');
    this.updateSelectedItem();
    this.dropdownTreeviewSelectI18n.fullList = this.fullList;
  }

  // OnChanges(): void {
  //   this.updateSelectedItem();
  // }

  select(item: TreeviewItem): void {
    // if (!item.children) {
      this.selectItem(item);
    // }
  }

  isEmpty(v: any){
    return v === '' || v === void(0) || v === null ;
  }

  private updateSelectedItem(): void {
    if (!this.isEmpty(this.items)) {
      const selectedItem = TreeviewHelper.findItemInList(this.items, this.control.value);
      this.selectItem(selectedItem);
    }
  }

  private selectItem(item: TreeviewItem): void {
    if (this.dropdownTreeviewSelectI18n.selectedItem !== item) {
      this.dropdownTreeviewSelectI18n.selectedItem = item;
      if (this.dropdownTreeviewComponent) {
        this.dropdownTreeviewComponent.onSelectedChange([item]);
      }

      if (item) {
        if (this.value !== item.value) {
          this.control.setValue(item.value);
        }
      }
    }
  }

  clearData() {
    this.control.setValue(null);
    this.control.markAsTouched(); // marks
    if(this.control.invalid) {
      this.control.markAsDirty(); // marks
    }
    this.selectItem(null);
  }

  emitEvent(e){
    if( e !== this.isShowSelect){
      this.isShowSelect = e;
      this.isFocus.emit(e);

    }
  }

  eventClose(){
    this.isOpen = !this.isOpen;
    this.isOpenEvent.emit(this.isOpen);
  }

}
