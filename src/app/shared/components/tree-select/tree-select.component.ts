import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TreeviewI18n, TreeviewItem, TreeviewConfig, DropdownTreeviewComponent, TreeviewHelper } from 'ngx-treeview';
import { DropdownTreeviewSelectI18n } from './dropdown-treeview-select-i18n';
@Component({
  selector: 'app-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: ['./tree-select.component.scss'],
  providers: [
    {provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n}
  ]
})
export class TreeSelectComponent implements OnChanges {

  @Input() config: TreeviewConfig;
  @Input() items: TreeviewItem[];
  @Input() value: any;
  @Input() isDisabled: boolean = false;
  @Output() valueChange = new EventEmitter<any>();
  @Output() isFocus = new EventEmitter<boolean>();
  @ViewChild(DropdownTreeviewComponent, { static: false }) dropdownTreeviewComponent: DropdownTreeviewComponent;
  filterText: string;
  isShowSelect  = false;

  private dropdownTreeviewSelectI18n: DropdownTreeviewSelectI18n;
  constructor(
    public i18n: TreeviewI18n
  ) {
    this.dropdownTreeviewSelectI18n = i18n as DropdownTreeviewSelectI18n;
  }

  ngOnChanges(changes: SimpleChanges): void {
   // throw new Error('Method not implemented.');
    this.updateSelectedItem();
  }

  // OnChanges(): void {
  //   this.updateSelectedItem();
  // }

  select(item: TreeviewItem): void {
      this.selectItem(item);
  }

  isEmpty(v: any){
    return v === '' || v === void(0) || v === null ;
  }

  private updateSelectedItem(): void {
    // if (!isNil(this.items)) {
    //   const selectedItem = TreeviewHelper.findItemInList(this.items, this.value);
    //   this.selectItem(selectedItem);
    // }
    if (!this.isEmpty(this.items)) {
      const selectedItem = TreeviewHelper.findItemInList(this.items, this.value);
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
          this.value = item.value;
          this.valueChange.emit(item.value);
        }
      }
    }
  }

  clearData() {
    this.value = null;
    this.valueChange.emit(null);
  }

  emitEvent(e){
    if( e !== this.isShowSelect){
      this.isShowSelect = e;
      this.isFocus.emit(e);
    }
  }

}
