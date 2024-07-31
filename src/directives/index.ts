import { App, Directive } from 'vue';
import draggable from './modules/draggable';
import copy from './modules/copy';

const directivesList: { [key: string]: Directive } = {
  draggable,
  copy,
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key]);
    });
  },
};

export default directives;
