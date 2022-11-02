import {Injectable} from '@angular/core';
import { TreeviewI18nDefault, TreeviewItem, TreeviewSelection} from 'ngx-treeview';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class DropdownTreeviewSelectI18n extends TreeviewI18nDefault {

  constructor(private translate: TranslateService) {
    super();
  }

  private internalSelectedItem: TreeviewItem;

  set selectedItem(value: TreeviewItem) {
    this.internalSelectedItem = value;
  }

  get selectedItem(): TreeviewItem {
    return this.internalSelectedItem;
  }

  getText(selection: TreeviewSelection): string {
    return this.internalSelectedItem ? this.internalSelectedItem.text : this.translate.instant('common.dropdown.placeholder');
  }
}
