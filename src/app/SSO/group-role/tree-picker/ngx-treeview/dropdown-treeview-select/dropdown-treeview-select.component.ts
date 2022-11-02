import {Component, Input, Output, EventEmitter, ViewChild, OnChanges} from '@angular/core';
import {isNil} from 'lodash';

import {DropdownTreeviewSelectI18n} from './dropdown-treeview-select-i18n';
import {DropdownTreeviewComponent, TreeviewConfig, TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {TreeviewHelper} from './treeview-helper';

/* tslint:disable */

@Component({
  selector: 'ngx-dropdown-treeview-select',
  templateUrl: './dropdown-treeview-select.component.html',
  styleUrls: [
    './dropdown-treeview-select.component.scss',
  ],
  providers: [
    {provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n},
  ],
})
export class DropdownTreeviewSelectComponent implements OnChanges {
  @Input() config: TreeviewConfig;
  @Input() items: TreeviewItem[];
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();
  @ViewChild(DropdownTreeviewComponent, {static: false}) dropdownTreeviewComponent: DropdownTreeviewComponent;
  filterText: string;
  private dropdownTreeviewSelectI18n: DropdownTreeviewSelectI18n;

  constructor(
    public i18n: TreeviewI18n,
  ) {
    this.config = TreeviewConfig.create({
      hasAllCheckBox: false,
      hasCollapseExpand: false,
      hasFilter: true,
    });
    this.dropdownTreeviewSelectI18n = i18n as DropdownTreeviewSelectI18n;
  }

  ngOnChanges(): void {
    this.updateSelectedItem();
  }

  removeItem() {
    this.selectItem(null);
    this.valueChange.emit(null);
    this.value = null;
  }

  select(item: TreeviewItem, isHidden): void {
    if (!isHidden) {
      this.selectItem(item);
    }
  }

  private updateSelectedItem(): void {
    if (!isNil(this.items)) {
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
}
