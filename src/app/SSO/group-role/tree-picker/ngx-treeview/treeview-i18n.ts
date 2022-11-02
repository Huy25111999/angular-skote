import { Injectable } from '@angular/core';
import { TreeviewItem, TreeviewSelection } from './treeview-item';

@Injectable()
export abstract class TreeviewI18n {
    abstract getText(selection: TreeviewSelection): string;
    abstract getAllCheckboxText(): string;
    abstract getFilterPlaceholder(): string;
    abstract getFilterNoItemsFoundText(): string;
    abstract getTooltipCollapseExpandText(isCollapse: boolean): string;
}

@Injectable()
export class TreeviewI18nDefault extends TreeviewI18n {
    getText(selection: TreeviewSelection): string {
    if (selection.uncheckedItems.length === 0) {
      return this.getAllCheckboxText();
    }

    switch (selection.checkedItems.length) {
      case 0:
        return 'Chọn để tìm kiếm';
      case 1:
        return selection.checkedItems[0].text;
      default:
        return `${selection.checkedItems.length} giá trị được chọn`;
    }
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

    getTooltipCollapseExpandText(isCollapse: boolean): string {
        return isCollapse ? 'Expand' : 'Collapse';
    }
}
