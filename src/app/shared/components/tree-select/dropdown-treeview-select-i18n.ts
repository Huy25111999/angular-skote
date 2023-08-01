import { Injectable } from '@angular/core';
 //import { TreeviewItem, TreeviewSelection , TreeviewI18nDefault} from 'ngx-treeview';
 import { TreeviewItem, TreeviewSelection, DefaultTreeviewI18n} from 'ngx-treeview';

@Injectable()
 export class DropdownTreeviewSelectI18n extends DefaultTreeviewI18n {
  private internalSelectedItem: TreeviewItem;

  set selectedItem(value: TreeviewItem) {
    this.internalSelectedItem = value;
  }

  get selectedItem(): TreeviewItem {
    return this.internalSelectedItem;
  }

  getText(selection: TreeviewSelection): string {
    return this.internalSelectedItem ? this.internalSelectedItem.text : 'Chọn giá trị';
  }
  getAllCheckboxText(): string {
    return 'Tất cả';
  }

  getFilterPlaceholder(): string {
    return 'Gõ để tìm kiếm';
  }

  getFilterNoItemsFoundText(): string {
    return 'Không tìm thấy dữ liệu phù hợp';
  }

}
