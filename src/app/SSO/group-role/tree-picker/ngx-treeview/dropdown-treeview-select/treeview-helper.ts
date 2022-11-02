import { concat, isNil, pull } from 'lodash';
export const TreeviewHelper = {
  findItem: findItem,
  findItemInList: findItemInList,
  findParent: findParent,
  removeItem: removeItem,
  concatSelection: concatSelection
};
function findItem(root, value) {
  if (isNil(root)) {
    return undefined;
  }
  if (root.value === value) {
    return root;
  }
  if (root.value.id === value) {
    return root;
  }
  if (root.children) {
    for (let _i = 0, _a = root.children; _i < _a.length; _i++) {
      const child = _a[_i];
      const foundItem = findItem(child, value);
      if (foundItem) {
        return foundItem;
      }
    }
  }
  return undefined;
}
function findItemInList(list, value) {
  if (isNil(list)) {
    return undefined;
  }
  for (let _i = 0, list_1 = list; _i < list_1.length; _i++) {
    const item = list_1[_i];
    const foundItem = findItem(item, value);
    if (foundItem) {
      return foundItem;
    }
  }
  return undefined;
}
function findParent(root, item) {
  if (isNil(root) || isNil(root.children)) {
    return undefined;
  }
  for (let _i = 0, _a = root.children; _i < _a.length; _i++) {
    const child = _a[_i];
    if (child === item) {
      return root;
    } else {
      const parent_1 = findParent(child, item);
      if (parent_1) {
        return parent_1;
      }
    }
  }
  return undefined;
}
function removeItem(root, item) {
  const parent = findParent(root, item);
  if (parent) {
    pull(parent.children, item);
    if (parent.children.length === 0) {
      parent.children = undefined;
    } else {
      parent.correctChecked();
    }
    return true;
  }
  return false;
}
function concatSelection(items, checked, unchecked) {
  let checkedItems = checked.slice();
  let uncheckedItems = unchecked.slice();
  for (let _i = 0, items_1 = items; _i < items_1.length; _i++) {
    const item = items_1[_i];
    const selection = item.getSelection();
    checkedItems = concat(checkedItems, selection.checkedItems);
    uncheckedItems = concat(uncheckedItems, selection.uncheckedItems);
  }
  return {
    checked: checkedItems,
    unchecked: uncheckedItems
  };
}

