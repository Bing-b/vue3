import * as L from 'leaflet';

L.drawLocal.draw = {
  toolbar: {
    actions: {
      title: '取消',
      text: '取消',
    },
    finish: {
      title: '完成',
      text: '完成',
    },
    undo: {
      title: '删除最后一个点',
      text: '删除最后一个点',
    },
    buttons: {
      polyline: '绘制一条折线',
      polygon: '绘制一个多边形',
      rectangle: '绘制一个矩形',
      circle: '绘制一个圆',
      marker: '绘制一个标记',
      circlemarker: '绘制一个圆形标记',
    },
  },
  handlers: {
    circle: {
      tooltip: {
        start: '按住鼠标左键拖动以绘制圆',
      },
      radius: '半径',
    },
    circlemarker: {
      tooltip: {
        start: '单击地图绘制圆形标记',
      },
    },
    marker: {
      tooltip: {
        start: '单击地图绘制标记',
      },
    },
    polygon: {
      tooltip: {
        start: '单击开始绘制',
        cont: '单击继续绘制',
        end: '单击第一个点结束绘制',
      },
    },
    polyline: {
      error: '<strong>警告：</strong> 图形边缘不能交叉！',
      tooltip: {
        start: '单击开始绘制',
        cont: '单击继续绘制',
        end: '单击最后一个点结束绘制',
      },
    },
    rectangle: {
      tooltip: {
        start: '按住鼠标左键拖动以绘制矩形',
      },
    },
    simpleshape: {
      tooltip: {
        end: '松开鼠标完成绘制',
      },
    },
  },
};
L.drawLocal.edit = {
  toolbar: {
    actions: {
      save: {
        title: '',
        text: '保存',
      },
      cancel: {
        title: '取消',
        text: '取消',
      },
      clearAll: {
        title: '清除所有图层',
        text: '清除所有图层',
      },
    },
    buttons: {
      edit: '编辑图层',
      editDisabled: '没有可编辑的图层',
      remove: '删除图层',
      removeDisabled: '没有可删除的图层',
    },
  },
  handlers: {
    edit: {
      tooltip: {
        text: '拖动矩形标记来编辑图层',
        // subtext: '单击取消放弃更改',
      },
    },
    remove: {
      tooltip: {
        text: '单击要删除的元素',
      },
    },
  },
};
