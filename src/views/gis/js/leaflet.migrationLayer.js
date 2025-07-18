(function (window) {
  const utils = {
    // color:rgb或rgba格式
    // opacity: 透明度
    calculateColor: function (color, opacity) {
      if (color.indexOf('#') === 0) {
        const color16 = color.slice(1);
        const r = parseInt(color16.slice(0, 2), 16);
        const g = parseInt(color16.slice(2, 4), 16);
        const b = parseInt(color16.slice(4), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
      } else if (/^rgb\(/.test(color)) {
        return color.replace(/rgb/, 'rgba').replace(')', ',') +
                    opacity + ')';
      } else {
        return color.split(',').splice(0, 3).join(',') +
                    opacity + ')';
      }
    }
  };
  const arrayUtils = {
    forEach: function (arr, cb, scope) {
      if (typeof Array.prototype.forEach === 'function') {
        arr.forEach(cb, scope);
      } else {
        for (let i = 0, len = arr.length; i < len; i++) {
          cb.apply(scope, [arr[i], i, arr]);
        }
      }
    },
    map: function (arr, cb, scope) {
      if (typeof Array.prototype.map === 'function') {
        return arr.map(cb, scope);
      } else {
        const mapped = [];
        for (let i = 0, len = arr.length; i < len; i++) {
          mapped[i] = cb.apply(scope, [arr[i], i, arr]);
        }
        return mapped;
      }
    }
  };

  const Marker = (function () {
    const M = function (options) {
      this.x = options.x;
      this.y = options.y;
      this.rotation = options.rotation;
      this.style = options.style;
      this.color = options.color;
      this.size = options.size;
      this.borderWidth = options.borderWidth;
      this.borderColor = options.borderColor;
    };

    M.prototype.draw = function (context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.rotation);

      context.lineWidth = this.borderWidth || 0;
      context.strokeStyle = this.borderColor || '#000';
      context.fillStyle = this.color || '#000';
      // 目前先只支持圆
      context.beginPath();
      if (this.style === 'circle') {
        context.arc(0, 0, this.size, 0, Math.PI * 2, false);
      } else if (this.style === 'arrow') {
        // 将箭头后退，让箭头的尖头指向终点
        context.moveTo(-this.size * 2, -this.size);
        context.lineTo(-this.size * 5 / 4, 0);
        context.lineTo(-this.size * 2, this.size);
        context.lineTo(0, 0);
        context.lineTo(-this.size * 2, -this.size);
      }
      context.closePath();
      context.stroke();
      context.fill();
      context.restore();
    };

    return M;
  })();

  const Arc = (function () {
    const A = function (options) {
      const startX = options.startX;
      const startY = options.startY;
      const endX = options.endX;
      const endY = options.endY;
      // 两点之间的圆有多个，通过两点及半径便可以定出两个圆，根据需要选取其中一个圆
      const L = Math.sqrt(Math.pow(startX - endX, 2) + Math.pow(startY - endY, 2));
      const m = (startX + endX) / 2; // 横轴中点
      const n = (startY + endY) / 2; // 纵轴中点
      const factor = 1.5;

      const centerX = (startY - endY) * factor + m;
      const centerY = (endX - startX) * factor + n;

      const radius = Math.sqrt(Math.pow(L / 2, 2) + Math.pow(L * factor, 2));
      const startAngle = Math.atan2(startY - centerY, startX - centerX);
      const endAngle = Math.atan2(endY - centerY, endX - centerX);

      // this.L = L;
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;
      this.centerX = centerX;
      this.centerY = centerY;
      this.startAngle = startAngle;
      this.endAngle = endAngle;
      this.startLabel = options && options.labels && options.labels[0],
      this.endLabel = options && options.labels && options.labels[1],
      this.radius = radius;
      this.lineWidth = options.width || 1;
      this.strokeStyle = options.color || '#000';
      this.label = options.label;
      this.font = options.font;
      this.shadowBlur = options.shadowBlur;
      this.endAngle = endAngle - this.lineWidth / radius; // 让线后退，与箭头结合
    };

    A.prototype.draw = function (context) {
      context.save();
      context.lineWidth = this.lineWidth;
      context.strokeStyle = this.strokeStyle;
      context.shadowColor = this.strokeStyle;
      context.shadowBlur = this.shadowBlur || 2;

      context.beginPath();
      context.arc(this.centerX, this.centerY, this.radius, this.startAngle, this.endAngle, false);
      context.stroke();
      context.restore();

      context.save();
      context.fillStyle = this.strokeStyle;
      if (this.label) {
        context.font = this.font;
        if (this.startLabel) {
          var x = this.startX - 15;
          var y = this.startY + 5;
          context.fillText(this.startLabel, x, y);
        }
        if (this.endLabel) {
          var x = this.endX - 15;
          var y = this.endY - 5;
          context.fillText(this.endLabel, x, y);
        }
      }
      context.restore();
    };

    return A;
  })();

  const Pulse = (function () {
    function P (options) {
      this.x = options.x;
      this.y = options.y;
      this.maxRadius = options.radius;
      this.color = options.color;
      this.shadowBlur = 5;
      this.lineWidth = options.borderWidth;
      this.r = 0;
      this.factor = 2 / options.radius;
    }

    P.prototype.draw = function (context) {
      // var vr = (this.maxRadius - this.r) * this.factor;
      const vr = 0.5;
      this.r += vr;
      // this.shadowBlur = Math.floor(this.r);

      context.save();
      context.translate(this.x, this.y);
      let strokeColor = this.color;
      strokeColor = utils.calculateColor(strokeColor, 1 - this.r / this.maxRadius);
      context.strokeStyle = strokeColor;
      context.shadowBlur = this.shadowBlur;
      context.shadowColor = strokeColor;
      context.lineWidth = this.lineWidth;
      context.beginPath();
      context.arc(0, 0, this.r, 0, Math.PI * 2, false);
      context.stroke();
      context.restore();

      if (Math.abs(this.maxRadius - this.r) < 0.8) {
        this.r = 0;
      }
    };

    return P;
  })();

  const Spark = (function () {
    const S = function (options) {
      const startX = options.startX;
      const startY = options.startY;
      const endX = options.endX;
      const endY = options.endY;

      // 两点之间的圆有多个，通过两点及半径便可以定出两个圆，根据需要选取其中一个圆
      const L = Math.sqrt(Math.pow(startX - endX, 2) + Math.pow(startY - endY, 2));
      const m = (startX + endX) / 2; // 横轴中点
      const n = (startY + endY) / 2; // 纵轴中点
      const factor = 1.5;

      const centerX = (startY - endY) * factor + m;
      const centerY = (endX - startX) * factor + n;

      const radius = Math.sqrt(Math.pow(L / 2, 2) + Math.pow(L * factor, 2));
      let startAngle = Math.atan2(startY - centerY, startX - centerX);
      let endAngle = Math.atan2(endY - centerY, endX - centerX);

      // 保证Spark的弧度不超过Math.PI
      if (startAngle * endAngle < 0) {
        if (startAngle < 0) {
          startAngle += Math.PI * 2;
          endAngle += Math.PI * 2;
        } else {
          endAngle += Math.PI * 2;
        }
      }

      this.tailPointsCount = 50; // 拖尾点数
      this.centerX = centerX;
      this.centerY = centerY;
      this.startAngle = startAngle;
      this.endAngle = endAngle;
      this.radius = radius;
      this.lineWidth = options.width || 1;
      this.strokeStyle = options.color || '#fff';
      this.factor = 2 / this.radius;
      this.deltaAngle = (80 / Math.min(this.radius, 400)) / this.tailPointsCount;
      this.trailAngle = this.startAngle;
      this.arcAngle = this.startAngle;

      this.animateBlur = true;

      const size = options.size ? options.size / 2 : 1;
      this.marker = new Marker({
        x: 50,
        y: 80,
        rotation: 50 * Math.PI / 180,
        style: 'arrow',
        color: 'rgb(255, 255, 255)',
        size: size + 1,
        borderWidth: size,
        borderColor: this.strokeStyle
      });
    };

    S.prototype.drawArc = function (context, strokeColor, lineWidth, startAngle, endAngle) {
      context.save();
      context.lineWidth = lineWidth;
      // context.lineWidth = 5;
      context.strokeStyle = strokeColor;
      context.shadowColor = this.strokeStyle;
      // context.shadowBlur = 5;
      context.lineCap = 'round';
      context.beginPath();
      context.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle, false);
      context.stroke();
      context.restore();
    };

    S.prototype.draw = function (context) {
      const endAngle = this.endAngle;
      // 匀速
      const angle = this.trailAngle + this.factor;
      let strokeColor = this.strokeStyle;
      if (this.animateBlur) {
        this.arcAngle = angle;
      }
      this.trailAngle = angle;
      strokeColor = utils.calculateColor(strokeColor, 0.1);

      this.drawArc(context, strokeColor, this.lineWidth, this.startAngle, this.arcAngle);

      // 拖尾效果
      const count = this.tailPointsCount;
      for (let i = 0; i < count; i++) {
        const arcColor = utils.calculateColor(this.strokeStyle, 0.3 - 0.3 / count * i);
        const tailLineWidth = 5;
        if (this.trailAngle - this.deltaAngle * i > this.startAngle) {
          this.drawArc(context, arcColor,
            tailLineWidth - tailLineWidth / count * i,
            this.trailAngle - this.deltaAngle * i,
            this.trailAngle
          );
        }
      }

      context.save();
      context.translate(this.centerX, this.centerY);
      this.marker.x = Math.cos(this.trailAngle) * this.radius;
      this.marker.y = Math.sin(this.trailAngle) * this.radius;
      this.marker.rotation = this.trailAngle + Math.PI / 2;
      this.marker.draw(context);
      context.restore();

      if ((endAngle - this.trailAngle) * 180 / Math.PI < 0.5) {
        this.trailAngle = this.startAngle;
        this.animateBlur = false;
      }
    };

    return S;
  })();

  const Migration = (function () {
    const M = function (options) {
      this.data = options.data;
      this.store = {
        arcs: [],
        markers: [],
        pulses: [],
        sparks: []
      };
      this.playAnimation = true;
      this.started = false;
      this.context = options.context;
      this.style = options.style;
      this.init();
    };

    M.prototype.init = function () {
      this.updateData(this.data);
    };
    /*
         * Shape 必须拥有draw方法
        */
    M.prototype.add = function (Shape) {

    };
    M.prototype.remove = function () {

    };
    M.prototype.clear = function () {
      this.store = {
        arcs: [],
        markers: [],
        pulses: [],
        sparks: []
      };
      // 更新状态
      this.playAnimation = true;
      this.started = false;
      // 清除绘画实例，如果没有这个方法，多次调用start，相当于存在多个动画队列同时进行
      window.cancelAnimationFrame(this.requestAnimationId);
    };
    /*
         * 更新数据
        */
    M.prototype.updateData = function (data) {
      if (!data || data.length === 0) {
        return;
      }
      this.clear();
      this.data = data;
      if (this.data && this.data.length > 0) {
        arrayUtils.forEach(this.data, function (element) {
          const arc = new Arc({
            startX: element.from[0],
            startY: element.from[1],
            endX: element.to[0],
            endY: element.to[1],
            labels: element.labels,
            label: this.style.arc.label,
            font: this.style.arc.font,
            width: element.arcWidth || this.style.arc.width,
            color: element.color
          });
          const marker = new Marker({
            x: element.to[0],
            y: element.to[1],
            rotation: arc.endAngle + Math.PI / 2,
            style: 'arrow',
            color: element.color,
            size: element.arcWidth || this.style.arc.width + 3,
            borderWidth: 0,
            borderColor: element.color
          });
          const pulse = new Pulse({
            x: element.to[0],
            y: element.to[1],
            radius: this.style.pulse.radius,
            color: element.color,
            borderWidth: this.style.pulse.borderWidth
          });
          const spark = new Spark({
            startX: element.from[0],
            startY: element.from[1],
            endX: element.to[0],
            endY: element.to[1],
            width: 15,
            color: element.color,
            size: element.arcWidth
          });

          this.store.arcs.push(arc);
          this.store.markers.push(marker);
          this.store.pulses.push(pulse);
          this.store.sparks.push(spark);
        }, this);
      }
    };
    /*
        */
    M.prototype.start = function (canvas) {
      const that = this;
      if (!this.started) {
        (function drawFrame () {
          that.requestAnimationId = window.requestAnimationFrame(drawFrame, canvas);

          if (that.playAnimation) {
            canvas.width += 1;
            canvas.width -= 1;
            for (const p in that.store) {
              const shapes = that.store[p];
              for (let i = 0, len = shapes.length; i < len; i++) {
                shapes[i].draw(that.context);
              }
            }
          }
        })();
        this.started = true;
      }
    };
    M.prototype.play = function () {
      this.playAnimation = true;
    };
    M.prototype.pause = function () {
      this.playAnimation = false;
    };
    return M;
  })();

  L.MigrationLayer = L.Class.extend({
    options: {
      map: {},
      data: {},
      pulseRadius: 25,
      pulseBorderWidth: 3,
      arcWidth: 1,
      arcLabel: true,
      arcLabelFont: '15px sans-serif',
      Marker: {},
      Spark: {}

    },
    _setOptions: function (obj, options) {
      if (!obj.hasOwnProperty('options')) {
        obj.options = obj.options ? L.Util.create(obj.options) : {};
      }
      for (const i in options) {
        obj.options[i] = options[i];
      }
      return obj.options;
    },
    initialize: function (options) {
      this._setOptions(this, options);
      this._map = this.options.map || {};
      this._data = this.options.data || {};
      this._style = {
        pulse: {
          radius: this.options.pulseRadius,
          borderWidth: this.options.pulseBorderWidth
        },
        arc: {
          width: this.options.arcWidth,
          label: this.options.arcLabel,
          font: this.options.arcLabelFont
        }
      } || {};
      this._show = true;
      this._init();
    },
    _init: function () {
      const container = L.DomUtil.create('div', 'leaflet-ODLayer-container');
      container.style.position = 'absolute';
      container.style.width = this._map.getSize().x + 'px';
      container.style.height = this._map.getSize().y + 'px';

      this.container = container;

      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      container.appendChild(this.canvas);
      this._map.getPanes().overlayPane.appendChild(container);
      // this._resize();
      if (!this.migration) {
        const data = this._convertData();
        this.migration = new Migration({
          data,
          context: this.context,
          style: this._style
        });
        // this._draw();
        // this._bindMapEvents();
      }
    },
    _resize: function () {
      const bounds = this._map.getBounds();
      const topleft = bounds.getNorthWest();
      const topLeftscreen = this._map.latLngToContainerPoint(topleft);
      // 当地图缩放或者平移到整个地图的范围小于外层容器的范围的时候，要对this.container进行上下平移操作，反之则回归原位
      if (topLeftscreen.y > 0) {
        this.container.style.top = -topLeftscreen.y + 'px';
      } else {
        this.container.style.top = '0px';
      }

      const containerStyle = window.getComputedStyle(this._map.getContainer());
      this.canvas.setAttribute('width', parseInt(containerStyle.width, 10));
      this.canvas.setAttribute('height', parseInt(containerStyle.height, 10));
    },
    _convertData: function () {
      const bounds = this._map.getBounds();
      let maxValue;
      let minValue;
      if (this._data && bounds) {
        arrayUtils.forEach(this._data, function (d) {
          if (d.value) {
            if (!maxValue) {
              maxValue = d.value;
              minValue = d.value;
            }
            if (maxValue < d.value) {
              maxValue = d.value;
            }
            if (minValue > d.value) {
              minValue = d.value;
            }
          }
        });
        const maxWidth = this.options.maxWidth || 10;
        const data = arrayUtils.map(this._data, function (d) {
          if (d.value) {
            if (!maxValue) {
              maxValue = d.value;
              minValue = d.value;
            }
            if (maxValue < d.value) {
              maxValue = d.value;
            }
            if (minValue > d.value) {
              minValue = d.value;
            }
          }

          const fromPixel = this._map.latLngToContainerPoint(new L.LatLng(d.from[1], d.from[0]));
          const toPixel = this._map.latLngToContainerPoint(new L.LatLng(d.to[1], d.to[0]));
          return {
            from: [fromPixel.x, fromPixel.y],
            to: [toPixel.x, toPixel.y],
            labels: d.labels,
            value: d.value,
            color: d.color,
            arcWidth: d.value ? parseInt((d.value - minValue) * (maxWidth - 1) / (maxValue - minValue)) + 1 : this.options.arcWidth
          };
        }, this);

        return data;
      }
    },
    _bindMapEvents: function () {
      const that = this;
      // window.onresize = function () {
      //     that._resize();
      // };
      // this._map.on('movestart ', function () {
      //     that.migration.pause();
      // });
      this._map.on('moveend', function () {
        that.migration.play();
        that._draw();
      });
      this._map.on('zoomstart ', function () { that.container.style.display = 'none'; });
      this._map.on('zoomend', function () {
        if (that._show) {
          that.container.style.display = '';
          that._draw();
        }
      });
    },
    _draw: function () {
      const bounds = this._map.getBounds();
      if (bounds && this.migration.playAnimation) {
        this._resize();
        this._transform();
        const data = this._convertData();
        this.migration.updateData(data);
        this.migration.start(this.canvas);
      }
    },
    _transform: function () {
      const bounds = this._map.getBounds();
      const topLeft = this._map.latLngToLayerPoint(bounds.getNorthWest());
      L.DomUtil.setPosition(this.container, topLeft);
    },
    addTo: function () {
      this._bindMapEvents();
      const bounds = this._map.getBounds();
      if (bounds && this.migration.playAnimation) {
        this._resize();
        this._transform();

        const data = this._convertData();
        this.migration.updateData(data);
        this.migration.start(this.canvas);
      }
    },
    setData: function (data) {
      this._data = data;
      this._draw();
    },
    hide: function () {
      this.container.style.display = 'none';
      this._show = false;
    },
    show: function () {
      this.container.style.display = '';
      this._show = true;
    },
    play: function () {
      this.migration.play();
    },
    pause: function () {
      this.migration.pause();
    },
    destroy: function () {
      this.migration.clear();
      // 移除dom
      this.container.parentNode.removeChild(this.container);
      // 移除事件监听
      this._map.clearAllEventListeners();
      this.mapHandles = [];
    }

  });
  L.migrationLayer = function (options) {
    return new L.MigrationLayer(options);
  };
})(window);
