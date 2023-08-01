import { Injectable } from '@angular/core';
 //import { TreeviewItem, TreeviewSelection , TreeviewI18nDefault} from 'ngx-treeview';
 import { TreeviewItem, TreeviewSelection, DefaultTreeviewI18n} from 'ngx-treeview';

@Injectable()
 export class DropdownTreeviewSelectI18n extends DefaultTreeviewI18n {
 // export class DropdownTreeviewSelectI18nCustom {
  private allList: any;
  private placeholder: any;
  public textInner: any = "";
  private internalSelectedItem: TreeviewItem;

  set selectedItem(value: TreeviewItem) {
    this.internalSelectedItem = value;
  }
  
  set fullList(value: any){
    this.allList = value;
  }
  set plhd(value:any){
    this.placeholder = value;
  }

  get selectedItem(): TreeviewItem {
    return this.internalSelectedItem;
  }

  getText(selection: TreeviewSelection): string {
   this.textInner = this.internalSelectedItem ? this.getName(this.internalSelectedItem, selection) : this.placeholder ;
   return  this.internalSelectedItem ? this.getName(this.internalSelectedItem, selection) : this.placeholder;
  }

  getName(item:any , selection: TreeviewSelection) {
    let currentStr = '';
    const index = this.allList.findIndex( e => e.unitId === item.value);
    if(index !== -1){
        let arr: any[] = [];
        arr = this.convert(this.allList[index], arr);
        if(arr.length){
            const rs = arr.reverse();
            for (let i = 0; i<rs.length; i++){
                if(i === 0){
                    currentStr += rs[i].text;
                }else{
                    currentStr += (' >> ' + rs[i].text);
                }
            }
        }
    }
    return currentStr; 
  }

  convert(item: any, curr: any){
    if(!item.parentId){
        curr.push(item);
        return curr;
    }else{
        curr.push(item);
        const index = this.allList.findIndex(e => e.unitId === item.parentId);
        if(index !== -1){
            this.convert(this.allList[index], curr);
        }else{
            return curr;
        }
    };
    return curr;
  }
}
