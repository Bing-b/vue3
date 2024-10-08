import { App, Directive } from 'vue';
import draggable from './modules/draggable';
import copy from './modules/copy';
import sortTable from './modules/sortTable';

const directivesList: { [key: string]: Directive } = {
  draggable,
  copy,
  sortTable,
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key]);
    });
  },
};

export default directives;
