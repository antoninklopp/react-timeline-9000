'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactVirtualized = require('react-virtualized');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _interactjs = require('interactjs');

var _interactjs2 = _interopRequireDefault(_interactjs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _commonUtils = require('./utils/commonUtils');

var _itemUtils = require('./utils/itemUtils');

var _timeUtils = require('./utils/timeUtils');

var _timebar = require('./components/timebar');

var _timebar2 = _interopRequireDefault(_timebar);

var _selector = require('./components/selector');

var _selector2 = _interopRequireDefault(_selector);

var _renderers = require('./components/renderers');

var _body = require('./components/body');

var _body2 = _interopRequireDefault(_body);

var _marker = require('./components/marker');

var _marker2 = _interopRequireDefault(_marker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Timeline class
 * @reactProps {!number} items - this is prop1
 * @reactProps {string} prop2 - this is prop2
 */
var Timeline = function (_React$Component) {
  _inherits(Timeline, _React$Component);

  _createClass(Timeline, null, [{
    key: 'isBitSet',


    /**
     * Checks if the given bit is set in the given mask
     * @param {number} bit Bit to check
     * @param {number} mask Mask to check against
     * @returns {boolean} True if bit is set; else false
     */

    /**
     * @type {object}
     */
    value: function isBitSet(bit, mask) {
      return (bit & mask) === bit;
    }

    /**
     * Alias for no op function
     */


    /**
     * The types of interactions - see {@link onInteraction}
     */

  }]);

  function Timeline(props) {
    _classCallCheck(this, Timeline);

    var _this = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this, props));

    _this.refreshGrid = function () {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _this._grid.recomputeGridSize(config);
    };

    _this._handleItemRowEvent = function (e, itemCallback, rowCallback) {
      e.preventDefault();
      // Skip click handler if selecting with selection box
      if (_this.selecting) {
        return;
      }
      if (e.target.hasAttribute('data-item-index') || e.target.parentElement.hasAttribute('data-item-index')) {
        var itemKey = e.target.getAttribute('data-item-index') || e.target.parentElement.getAttribute('data-item-index');
        itemCallback && itemCallback(e, Number(itemKey));
      } else {
        var row = e.target.getAttribute('data-row-index');
        var clickedTime = (0, _timeUtils.getTimeAtPixel)(e.clientX - _this.props.groupOffset, _this.props.startDate, _this.props.endDate, _this.getTimelineWidth());

        //const roundedStartMinutes = Math.round(clickedTime.minute() / this.props.snapMinutes) * this.props.snapMinutes; // I dont know what this does
        var snappedClickedTime = (0, _timeUtils.timeSnap)(clickedTime, _this.props.snapMinutes * 60);
        rowCallback && rowCallback(e, row, clickedTime, snappedClickedTime);
      }
    };

    _this.selecting = false;
    _this.state = { selection: [], cursorTime: null };
    _this.setTimeMap(_this.props.items);

    _this.cellRenderer = _this.cellRenderer.bind(_this);
    _this.rowHeight = _this.rowHeight.bind(_this);
    _this.setTimeMap = _this.setTimeMap.bind(_this);
    _this.getItem = _this.getItem.bind(_this);
    _this.changeGroup = _this.changeGroup.bind(_this);
    _this.setSelection = _this.setSelection.bind(_this);
    _this.clearSelection = _this.clearSelection.bind(_this);
    _this.getTimelineWidth = _this.getTimelineWidth.bind(_this);
    _this.itemFromElement = _this.itemFromElement.bind(_this);
    _this.updateDimensions = _this.updateDimensions.bind(_this);
    _this.grid_ref_callback = _this.grid_ref_callback.bind(_this);
    _this.select_ref_callback = _this.select_ref_callback.bind(_this);
    _this.throttledMouseMoveFunc = _lodash2.default.throttle(_this.throttledMouseMoveFunc.bind(_this), 20);
    _this.mouseMoveFunc = _this.mouseMoveFunc.bind(_this);
    _this.getCursor = _this.getCursor.bind(_this);

    var canSelect = Timeline.isBitSet(Timeline.TIMELINE_MODES.SELECT, _this.props.timelineMode);
    var canDrag = Timeline.isBitSet(Timeline.TIMELINE_MODES.DRAG, _this.props.timelineMode);
    var canResize = Timeline.isBitSet(Timeline.TIMELINE_MODES.RESIZE, _this.props.timelineMode);
    _this.setUpDragging(canSelect, canDrag, canResize);
    return _this;
  }

  _createClass(Timeline, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('resize', this.updateDimensions);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setTimeMap(nextProps.items, nextProps.startDate, nextProps.endDate);
      // @TODO
      // investigate if we need this, only added to refresh the grid
      // when double click -> add an item
      this.refreshGrid();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._itemInteractable) this._itemInteractable.unset();
      if (this._selectRectangleInteractable) this._selectRectangleInteractable.unset();

      window.removeEventListener('resize', this.updateDimensions);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _props = this.props,
          timelineMode = _props.timelineMode,
          selectedItems = _props.selectedItems;

      var selectionChange = !_lodash2.default.isEqual(prevProps.selectedItems, selectedItems);
      var timelineModeChange = !_lodash2.default.isEqual(prevProps.timelineMode, timelineMode);

      if (timelineModeChange || selectionChange) {
        var canSelect = Timeline.isBitSet(Timeline.TIMELINE_MODES.SELECT, timelineMode);
        var canDrag = Timeline.isBitSet(Timeline.TIMELINE_MODES.DRAG, timelineMode);
        var canResize = Timeline.isBitSet(Timeline.TIMELINE_MODES.RESIZE, timelineMode);
        this.setUpDragging(canSelect, canDrag, canResize);
      }
    }

    /**
     * Re-renders the grid when the window or container is resized
     */

  }, {
    key: 'updateDimensions',
    value: function updateDimensions() {
      var _this2 = this;

      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(function () {
        _this2.forceUpdate();
        _this2._grid.recomputeGridSize();
      }, 100);
    }

    /**
     * Sets the internal maps used by the component for looking up item & row data
     * @param {Object[]} items The items to be displayed in the grid
     * @param {moment} startDate The visible start date of the timeline
     * @param {moment} endDate The visible end date of the timeline
     */

  }, {
    key: 'setTimeMap',
    value: function setTimeMap(items, startDate, endDate) {
      var _this3 = this;

      if (!startDate || !endDate) {
        startDate = this.props.startDate;
        endDate = this.props.endDate;
      }
      this.itemRowMap = {}; // timeline elements (key) => (rowNo).
      this.rowItemMap = {}; // (rowNo) => timeline elements
      this.rowHeightCache = {}; // (rowNo) => max number of stacked items
      var visibleItems = _lodash2.default.filter(items, function (i) {
        return i.end > startDate && i.start < endDate;
      });
      var itemRows = _lodash2.default.groupBy(visibleItems, 'row');
      _lodash2.default.forEach(itemRows, function (visibleItems, row) {
        var rowInt = parseInt(row);
        if (_this3.rowItemMap[rowInt] === undefined) _this3.rowItemMap[rowInt] = [];
        _lodash2.default.forEach(visibleItems, function (item) {
          _this3.itemRowMap[item.key] = rowInt;
          _this3.rowItemMap[rowInt].push(item);
        });
        _this3.rowHeightCache[rowInt] = (0, _itemUtils.getMaxOverlappingItems)(visibleItems);
      });
    }

    /**
     * Returns an item given its DOM element
     * @param {Object} e the DOM element of the item
     * @return {Object} Item details
     * @prop {number|string} index The item's index
     * @prop {number} rowNo The row number the item is in
     * @prop {number} itemIndex Not really used - gets the index of the item in the row map
     * @prop {Object} item The provided item object
     */

  }, {
    key: 'itemFromElement',
    value: function itemFromElement(e) {
      var index = e.getAttribute('data-item-index');
      var rowNo = this.itemRowMap[index];
      var itemIndex = _lodash2.default.findIndex(this.rowItemMap[rowNo], function (i) {
        return i.key == index;
      });
      var item = this.rowItemMap[rowNo][itemIndex];

      return { index: index, rowNo: rowNo, itemIndex: itemIndex, item: item };
    }

    /**
     * Gets an item given its ID
     * @param {number} id item id
     * @return {Object} Item object
     */

  }, {
    key: 'getItem',
    value: function getItem(id) {
      // This is quite stupid and shouldn't really be needed
      var rowNo = this.itemRowMap[id];
      var itemIndex = _lodash2.default.findIndex(this.rowItemMap[rowNo], function (i) {
        return i.key == id;
      });
      return this.rowItemMap[rowNo][itemIndex];
    }

    /**
     * Move an item from one row to another
     * @param {object} item The item object whose groups is to be changed
     * @param {number} curRow The item's current row index
     * @param {number} newRow The item's new row index
     */

  }, {
    key: 'changeGroup',
    value: function changeGroup(item, curRow, newRow) {
      item.row = newRow;
      this.itemRowMap[item.key] = newRow;
      this.rowItemMap[curRow] = this.rowItemMap[curRow].filter(function (i) {
        return i.key !== item.key;
      });
      this.rowItemMap[newRow].push(item);
    }

    /**
     * Set the currently selected time ranges (for the timebar to display)
     * @param {Object[]} selections Of the form `[[start, end], [start, end], ...]`
     */

  }, {
    key: 'setSelection',
    value: function setSelection(selections) {
      var newSelection = _lodash2.default.map(selections, function (s) {
        return { start: s[0].clone(), end: s[1].clone() };
      });
      this.setState({ selection: newSelection });
    }

    /**
     * Clears the currently selected time range state
     */

  }, {
    key: 'clearSelection',
    value: function clearSelection() {
      this.setState({ selection: [] });
    }

    /**
     * Get the width of the timeline NOT including the left group list
     * @param {?number} totalWidth Total timeline width. If not supplied we use the timeline ref
     * @returns {number} The width in pixels
     */

  }, {
    key: 'getTimelineWidth',
    value: function getTimelineWidth(totalWidth) {
      var groupOffset = this.props.groupOffset;

      if (totalWidth !== undefined) return totalWidth - groupOffset;
      return this._grid.props.width - groupOffset;
    }

    /**
     * re-computes the grid's row sizes
     * @param {Object?} config Config to pass wo react-virtualized's compute func
     */

  }, {
    key: 'setUpDragging',
    value: function setUpDragging(canSelect, canDrag, canResize) {
      var _this4 = this;

      // No need to setUpDragging during SSR
      if (typeof window === 'undefined') {
        return;
      }

      var topDivClassId = 'rct9k-id-' + this.props.componentId;
      var selectedItemSelector = '.rct9k-items-outer-selected';
      if (this._itemInteractable) this._itemInteractable.unset();
      if (this._selectRectangleInteractable) this._selectRectangleInteractable.unset();

      this._itemInteractable = (0, _interactjs2.default)('.' + topDivClassId + ' .item_draggable');
      this._selectRectangleInteractable = (0, _interactjs2.default)('.' + topDivClassId + ' .parent-div');

      this._itemInteractable.pointerEvents(this.props.interactOptions.pointerEvents).on('tap', function (e) {
        _this4._handleItemRowEvent(e, _this4.props.onItemClick, _this4.props.onRowClick);
      });

      if (canDrag) {
        this._itemInteractable.draggable(_extends({
          enabled: true,
          allowFrom: selectedItemSelector,
          restrict: {
            restriction: '.' + topDivClassId,
            elementRect: { left: 0, right: 1, top: 0, bottom: 1 }
          }
        }, this.props.interactOptions.draggable)).on('dragstart', function (e) {
          var selections = [];
          var animatedItems = _this4.props.onInteraction(Timeline.changeTypes.dragStart, null, _this4.props.selectedItems);

          _lodash2.default.forEach(animatedItems, function (id) {
            var domItem = _this4._gridDomNode.querySelector("span[data-item-index='" + id + "'");
            if (domItem) {
              selections.push([_this4.getItem(id).start, _this4.getItem(id).end]);
              domItem.setAttribute('isDragging', 'True');
              domItem.setAttribute('drag-x', 0);
              domItem.setAttribute('drag-y', 0);
              domItem.style['z-index'] = 4;
            }
          });
          _this4.setSelection(selections);
        }).on('dragmove', function (e) {
          var target = e.target;
          var animatedItems = _this4._gridDomNode.querySelectorAll("span[isDragging='True'") || [];

          var dx = (parseFloat(target.getAttribute('drag-x')) || 0) + e.dx;
          var dy = (parseFloat(target.getAttribute('drag-y')) || 0) + e.dy;
          var selections = [];

          // Snap the movement to the current snap interval
          var snapDx = (0, _timeUtils.getSnapPixelFromDelta)(dx, _this4.props.startDate, _this4.props.endDate, _this4.getTimelineWidth(), _this4.props.snapMinutes);

          _lodash2.default.forEach(animatedItems, function (domItem) {
            var _itemFromElement = _this4.itemFromElement(domItem),
                item = _itemFromElement.item;

            var itemDuration = item.end.diff(item.start);
            var newPixelOffset = (0, _commonUtils.pixToInt)(domItem.style.left) + snapDx;
            var newStart = (0, _timeUtils.getTimeAtPixel)(newPixelOffset, _this4.props.startDate, _this4.props.endDate, _this4.getTimelineWidth(), _this4.props.snapMinutes);

            var newEnd = newStart.clone().add(itemDuration);
            selections.push([newStart, newEnd]);

            // Translate the new start time back to pixels, so we can animate the snap
            domItem.style.webkitTransform = domItem.style.transform = 'translate(' + snapDx + 'px, ' + dy + 'px)';
          });

          target.setAttribute('drag-x', dx);
          target.setAttribute('drag-y', dy);

          _this4.setSelection(selections);
        }).on('dragend', function (e) {
          var _itemFromElement2 = _this4.itemFromElement(e.target),
              item = _itemFromElement2.item,
              rowNo = _itemFromElement2.rowNo;

          var animatedItems = _this4._gridDomNode.querySelectorAll("span[isDragging='True'") || [];

          _this4.setSelection([[item.start, item.end]]);
          _this4.clearSelection();

          // Change row
          var newRow = (0, _itemUtils.getNearestRowNumber)(e.clientX, e.clientY);

          var rowChangeDelta = newRow - rowNo;
          // Update time
          var newPixelOffset = (0, _commonUtils.pixToInt)(e.target.style.left) + (parseFloat(e.target.getAttribute('drag-x')) || 0);
          var newStart = (0, _timeUtils.getTimeAtPixel)(newPixelOffset, _this4.props.startDate, _this4.props.endDate, _this4.getTimelineWidth(), _this4.props.snapMinutes);

          var timeDelta = newStart.clone().diff(item.start, 'minutes');
          var changes = { rowChangeDelta: rowChangeDelta, timeDelta: timeDelta };
          var items = [];

          // Default, all items move by the same offset during a drag
          _lodash2.default.forEach(animatedItems, function (domItem) {
            var _itemFromElement3 = _this4.itemFromElement(domItem),
                item = _itemFromElement3.item,
                rowNo = _itemFromElement3.rowNo;

            var itemDuration = item.end.diff(item.start);
            var newStart = item.start.clone().add(timeDelta, 'minutes');
            var newEnd = newStart.clone().add(itemDuration);
            item.start = newStart;
            item.end = newEnd;
            if (rowChangeDelta < 0) {
              item.row = Math.max(0, item.row + rowChangeDelta);
            } else if (rowChangeDelta > 0) {
              item.row = Math.min(_this4.props.groups.length - 1, item.row + rowChangeDelta);
            }

            items.push(item);
          });

          _this4.props.onInteraction(Timeline.changeTypes.dragEnd, changes, items);

          // Reset the styles
          animatedItems.forEach(function (domItem) {
            domItem.style.webkitTransform = domItem.style.transform = 'translate(0px, 0px)';
            domItem.setAttribute('drag-x', 0);
            domItem.setAttribute('drag-y', 0);
            domItem.style['z-index'] = 3;
            domItem.style['top'] = (0, _commonUtils.intToPix)(_this4.props.itemHeight * Math.round((0, _commonUtils.pixToInt)(domItem.style['top']) / _this4.props.itemHeight));
            domItem.removeAttribute('isDragging');
          });

          _this4._grid.recomputeGridSize({ rowIndex: 0 });
        });
      }
      if (canResize) {
        this._itemInteractable.resizable(_extends({
          allowFrom: selectedItemSelector,
          edges: { left: true, right: true, bottom: false, top: false }
        }, this.props.interactOptions.draggable)).on('resizestart', function (e) {
          var selected = _this4.props.onInteraction(Timeline.changeTypes.resizeStart, null, _this4.props.selectedItems);
          _lodash2.default.forEach(selected, function (id) {
            var domItem = _this4._gridDomNode.querySelector("span[data-item-index='" + id + "'");
            if (domItem) {
              domItem.setAttribute('isResizing', 'True');
              domItem.setAttribute('initialWidth', (0, _commonUtils.pixToInt)(domItem.style.width));
              domItem.style['z-index'] = 4;
            }
          });
        }).on('resizemove', function (e) {
          var animatedItems = _this4._gridDomNode.querySelectorAll("span[isResizing='True'") || [];

          var dx = parseFloat(e.target.getAttribute('delta-x')) || 0;
          dx += e.deltaRect.left;

          var dw = e.rect.width - Number(e.target.getAttribute('initialWidth'));

          var minimumWidth = (0, _timeUtils.pixelsPerMinute)(_this4.props.startDate, _this4.props.endDate, _this4.getTimelineWidth()) * _this4.props.snapMinutes;

          var snappedDx = (0, _timeUtils.getSnapPixelFromDelta)(dx, _this4.props.startDate, _this4.props.endDate, _this4.getTimelineWidth(), _this4.props.snapMinutes);

          var snappedDw = (0, _timeUtils.getSnapPixelFromDelta)(dw, _this4.props.startDate, _this4.props.endDate, _this4.getTimelineWidth(), _this4.props.snapMinutes);

          _lodash2.default.forEach(animatedItems, function (item) {
            item.style.width = (0, _commonUtils.intToPix)(Number(item.getAttribute('initialWidth')) + snappedDw + minimumWidth);
            item.style.webkitTransform = item.style.transform = 'translate(' + snappedDx + 'px, 0px)';
          });
          e.target.setAttribute('delta-x', dx);
        }).on('resizeend', function (e) {
          var animatedItems = _this4._gridDomNode.querySelectorAll("span[isResizing='True'") || [];
          // Update time
          var dx = parseFloat(e.target.getAttribute('delta-x')) || 0;
          var isStartTimeChange = dx != 0;

          var items = [];
          var minRowNo = Infinity;

          var durationChange = null;
          // Calculate the default item positions
          _lodash2.default.forEach(animatedItems, function (domItem) {
            var startPixelOffset = (0, _commonUtils.pixToInt)(domItem.style.left) + dx;

            var _itemFromElement4 = _this4.itemFromElement(domItem),
                item = _itemFromElement4.item,
                rowNo = _itemFromElement4.rowNo;

            minRowNo = Math.min(minRowNo, rowNo);

            if (isStartTimeChange) {
              var newStart = (0, _timeUtils.getTimeAtPixel)(startPixelOffset, _this4.props.startDate, _this4.props.endDate, _this4.getTimelineWidth(), _this4.props.snapMinutes);
              if (durationChange === null) durationChange = item.start.diff(newStart, 'minutes');
              item.start = newStart;
            } else {
              var endPixelOffset = startPixelOffset + (0, _commonUtils.pixToInt)(domItem.style.width);
              var newEnd = (0, _timeUtils.getTimeAtPixel)(endPixelOffset, _this4.props.startDate, _this4.props.endDate, _this4.getTimelineWidth(), _this4.props.snapMinutes);
              if (durationChange === null) durationChange = item.end.diff(newEnd, 'minutes');

              item.end = newEnd;
            }

            // Check row height doesn't need changing
            var new_row_height = (0, _itemUtils.getMaxOverlappingItems)(_this4.rowItemMap[rowNo], _this4.props.startDate, _this4.props.endDate);
            if (new_row_height !== _this4.rowHeightCache[rowNo]) {
              _this4.rowHeightCache[rowNo] = new_row_height;
            }

            //Reset styles
            domItem.removeAttribute('isResizing');
            domItem.removeAttribute('initialWidth');
            domItem.style['z-index'] = 3;
            domItem.style.webkitTransform = domItem.style.transform = 'translate(0px, 0px)';

            items.push(item);
          });
          if (durationChange === null) durationChange = 0;
          var changes = { isStartTimeChange: isStartTimeChange, timeDelta: -durationChange };

          _this4.props.onInteraction(Timeline.changeTypes.resizeEnd, changes, items);

          e.target.setAttribute('delta-x', 0);
          _this4._grid.recomputeGridSize({ rowIndex: minRowNo });
        });
      }

      if (canSelect) {
        this._selectRectangleInteractable.draggable({
          enabled: true,
          ignoreFrom: '.item_draggable, .rct9k-group'
        }).styleCursor(false).on('dragstart', function (e) {
          var nearestRowObject = (0, _itemUtils.getNearestRowObject)(e.clientX, e.clientY);

          // this._selectBox.start(e.clientX, e.clientY);
          // this._selectBox.start(e.clientX, topRowObj.style.top);
          _this4._selectBox.start(e.clientX, nearestRowObject.getBoundingClientRect().y);
          // const bottomRow = Number(getNearestRowNumber(left + width, top + height));
        }).on('dragmove', function (e) {
          var magicalConstant = 2;
          // @bendog: I added this magical constant to solve the issue of selection bleed,
          // I don't understand why it works, but if frequentist statisticians can use imaginary numbers, so can i.
          var _selectBox = _this4._selectBox,
              startX = _selectBox.startX,
              startY = _selectBox.startY;

          var startRowObject = (0, _itemUtils.getNearestRowObject)(startX, startY);
          var clientX = e.clientX,
              clientY = e.clientY;

          var currentRowObject = (0, _itemUtils.getNearestRowObject)(clientX, clientY);
          if (currentRowObject !== undefined && startRowObject !== undefined) {
            // only run if you can detect the top row
            var startRowNumber = (0, _itemUtils.getRowObjectRowNumber)(startRowObject);
            var currentRowNumber = (0, _itemUtils.getRowObjectRowNumber)(currentRowObject);
            // const numRows = 1 + Math.abs(startRowNumber - currentRowNumber);
            var rowMarginBorder = (0, _itemUtils.getVerticalMarginBorder)(currentRowObject);
            if (startRowNumber <= currentRowNumber) {
              // select box for selection going down
              // get the first selected rows top
              var startTop = Math.ceil(startRowObject.getBoundingClientRect().top + rowMarginBorder);
              // get the currently selected rows bottom
              var currentBottom = Math.floor((0, _itemUtils.getTrueBottom)(currentRowObject) - magicalConstant - rowMarginBorder);
              _this4._selectBox.start(startX, startTop);
              _this4._selectBox.move(clientX, currentBottom);
            } else {
              // select box for selection going up
              // get the currently selected rows top
              var currentTop = Math.ceil(currentRowObject.getBoundingClientRect().top + rowMarginBorder);
              // get the first selected rows bottom
              var startBottom = Math.floor((0, _itemUtils.getTrueBottom)(startRowObject) - magicalConstant - rowMarginBorder * 2);
              // the bottom will bleed south unless you counter the margins and boreders from the above rows
              _this4._selectBox.start(startX, startBottom);
              _this4._selectBox.move(clientX, currentTop);
            }
          }
        }).on('dragend', function (e) {
          var _selectBox$end = _this4._selectBox.end(),
              top = _selectBox$end.top,
              left = _selectBox$end.left,
              width = _selectBox$end.width,
              height = _selectBox$end.height;
          //Get the start and end row of the selection rectangle


          var topRowObject = (0, _itemUtils.getNearestRowObject)(left, top);
          if (topRowObject !== undefined) {
            (function () {
              // only confirm the end of a drag if the selection box is valid
              var topRowNumber = Number((0, _itemUtils.getNearestRowNumber)(left, top));
              var topRowLoc = topRowObject.getBoundingClientRect();
              var rowMarginBorder = (0, _itemUtils.getVerticalMarginBorder)(topRowObject);
              var bottomRow = Number((0, _itemUtils.getNearestRowNumber)(left + width, Math.floor(topRowLoc.top - rowMarginBorder) + Math.floor(height - rowMarginBorder)));
              //Get the start and end time of the selection rectangle
              left = left - topRowLoc.left;
              var startOffset = width > 0 ? left : left + width;
              var endOffset = width > 0 ? left + width : left;
              var startTime = (0, _timeUtils.getTimeAtPixel)(startOffset, _this4.props.startDate, _this4.props.endDate, _this4.getTimelineWidth(), _this4.props.snapMinutes);
              var endTime = (0, _timeUtils.getTimeAtPixel)(endOffset, _this4.props.startDate, _this4.props.endDate, _this4.getTimelineWidth(), _this4.props.snapMinutes);
              //Get items in these ranges
              var selectedItems = [];
              for (var r = Math.min(topRowNumber, bottomRow); r <= Math.max(topRowNumber, bottomRow); r++) {
                selectedItems.push.apply(selectedItems, _toConsumableArray(_lodash2.default.filter(_this4.rowItemMap[r], function (i) {
                  return i.start.isBefore(endTime) && i.end.isAfter(startTime);
                })));
              }
              _this4.props.onInteraction(Timeline.changeTypes.itemsSelected, selectedItems);
            })();
          }
        });
      }
    }
  }, {
    key: 'cellRenderer',


    /**
     * @param {number} width container width (in px)
     */
    value: function cellRenderer(width) {
      var _this5 = this;

      /**
       * @param  {} columnIndex Always 1
       * @param  {} key Unique key within array of cells
       * @param  {} parent Reference to the parent Grid (instance)
       * @param  {} rowIndex Vertical (row) index of cell
       * @param  {} style Style object to be applied to cell (to position it);
       */
      var _props2 = this.props,
          timelineMode = _props2.timelineMode,
          onItemHover = _props2.onItemHover,
          onItemLeave = _props2.onItemLeave,
          rowLayers = _props2.rowLayers;

      var canSelect = Timeline.isBitSet(Timeline.TIMELINE_MODES.SELECT, timelineMode);
      return function (_ref) {
        var columnIndex = _ref.columnIndex,
            key = _ref.key,
            parent = _ref.parent,
            rowIndex = _ref.rowIndex,
            style = _ref.style;

        var itemCol = 1;
        if (itemCol == columnIndex) {
          var itemsInRow = _this5.rowItemMap[rowIndex];
          var layersInRow = rowLayers.filter(function (r) {
            return r.rowNumber === rowIndex;
          });
          var rowHeight = _this5.props.itemHeight;
          if (_this5.rowHeightCache[rowIndex]) {
            rowHeight = rowHeight * _this5.rowHeightCache[rowIndex];
          }
          return _react2.default.createElement(
            'div',
            {
              key: key,
              style: style,
              'data-row-index': rowIndex,
              className: 'rct9k-row',
              onClick: function onClick(e) {
                return _this5._handleItemRowEvent(e, Timeline.no_op, _this5.props.onRowClick);
              },
              onMouseDown: function onMouseDown(e) {
                return _this5.selecting = false;
              },
              onMouseMove: function onMouseMove(e) {
                return _this5.selecting = true;
              },
              onMouseOver: function onMouseOver(e) {
                _this5.selecting = false;
                return _this5._handleItemRowEvent(e, onItemHover, null);
              },
              onMouseLeave: function onMouseLeave(e) {
                _this5.selecting = false;
                return _this5._handleItemRowEvent(e, onItemLeave, null);
              },
              onContextMenu: function onContextMenu(e) {
                return _this5._handleItemRowEvent(e, _this5.props.onItemContextClick, _this5.props.onRowContextClick);
              },
              onDoubleClick: function onDoubleClick(e) {
                return _this5._handleItemRowEvent(e, _this5.props.onItemDoubleClick, _this5.props.onRowDoubleClick);
              } },
            (0, _itemUtils.rowItemsRenderer)(itemsInRow, _this5.props.startDate, _this5.props.endDate, width, _this5.props.itemHeight, _this5.props.itemRenderer, canSelect ? _this5.props.selectedItems : []),
            (0, _itemUtils.rowLayerRenderer)(layersInRow, _this5.props.startDate, _this5.props.endDate, width, rowHeight)
          );
        } else {
          var GroupComp = _this5.props.groupRenderer;
          var group = _lodash2.default.find(_this5.props.groups, function (g) {
            return g.id == rowIndex;
          });
          return _react2.default.createElement(
            'div',
            { 'data-row-index': rowIndex, key: key, style: style, className: 'rct9k-group' },
            _react2.default.createElement(GroupComp, { group: group })
          );
        }
      };
    }
  }, {
    key: 'getCursor',
    value: function getCursor() {
      var _props3 = this.props,
          showCursorTime = _props3.showCursorTime,
          cursorTimeFormat = _props3.cursorTimeFormat;
      var cursorTime = this.state.cursorTime;

      return showCursorTime && cursorTime ? cursorTime.clone().format(cursorTimeFormat) : null;
    }

    /**
     * Helper for react virtuaized to get the row height given a row index
     */

  }, {
    key: 'rowHeight',
    value: function rowHeight(_ref2) {
      var index = _ref2.index;

      var rh = this.rowHeightCache[index] ? this.rowHeightCache[index] : 1;
      return rh * this.props.itemHeight;
    }

    /**
     * Set the grid ref.
     * @param {Object} reactComponent Grid react element
     */

  }, {
    key: 'grid_ref_callback',
    value: function grid_ref_callback(reactComponent) {
      this._grid = reactComponent;
      this._gridDomNode = _reactDom2.default.findDOMNode(this._grid);
    }

    /**
     * Set the select box ref.
     * @param {Object} reactComponent Selectbox react element
     */

  }, {
    key: 'select_ref_callback',
    value: function select_ref_callback(reactComponent) {
      this._selectBox = reactComponent;
    }

    /**
     * Event handler for onMouseMove.
     * Only calls back if a new snap time is reached
     */

  }, {
    key: 'throttledMouseMoveFunc',
    value: function throttledMouseMoveFunc(e) {
      var componentId = this.props.componentId;

      var leftOffset = document.querySelector('.rct9k-id-' + componentId + ' .parent-div').getBoundingClientRect().left;
      var cursorSnappedTime = (0, _timeUtils.getTimeAtPixel)(e.clientX - this.props.groupOffset - leftOffset, this.props.startDate, this.props.endDate, this.getTimelineWidth(), this.props.snapMinutes);
      if (!this.mouse_snapped_time || this.mouse_snapped_time.unix() !== cursorSnappedTime.unix()) {
        if (cursorSnappedTime.isSameOrAfter(this.props.startDate)) {
          this.mouse_snapped_time = cursorSnappedTime;
          this.setState({ cursorTime: this.mouse_snapped_time });
          this.props.onInteraction(Timeline.changeTypes.snappedMouseMove, { snappedTime: this.mouse_snapped_time.clone() }, null);
        }
      }
    }
  }, {
    key: 'mouseMoveFunc',
    value: function mouseMoveFunc(e) {
      e.persist();
      this.throttledMouseMoveFunc(e);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var _props4 = this.props,
          onInteraction = _props4.onInteraction,
          groupOffset = _props4.groupOffset,
          showCursorTime = _props4.showCursorTime,
          timebarFormat = _props4.timebarFormat,
          componentId = _props4.componentId,
          groupTitleRenderer = _props4.groupTitleRenderer,
          shallowUpdateCheck = _props4.shallowUpdateCheck,
          forceRedrawFunc = _props4.forceRedrawFunc,
          startDate = _props4.startDate,
          endDate = _props4.endDate,
          bottomResolution = _props4.bottomResolution,
          topResolution = _props4.topResolution;


      var divCssClass = 'rct9k-timeline-div rct9k-id-' + componentId;
      var varTimebarProps = {};
      if (timebarFormat) varTimebarProps['timeFormats'] = timebarFormat;
      if (bottomResolution) varTimebarProps['bottom_resolution'] = bottomResolution;
      if (topResolution) varTimebarProps['top_resolution'] = topResolution;

      function columnWidth(width) {
        return function (_ref3) {
          var index = _ref3.index;

          if (index === 0) return groupOffset;
          return width - groupOffset;
        };
      }

      function calculateHeight(height) {
        if (typeof window === 'undefined') {
          return 0;
        }
        // when this function is called for the first time, the timebar is not yet rendered
        var timebar = document.querySelector('.rct9k-id-' + componentId + ' .rct9k-timebar');
        if (!timebar) {
          return 0;
        }
        // substract timebar height from total height
        var timebarHeight = timebar.getBoundingClientRect().height;
        return Math.max(height - timebarHeight, 0);
      }

      // Markers (only current time marker atm)
      var markers = [];
      if (showCursorTime && this.mouse_snapped_time) {
        var cursorPix = (0, _timeUtils.getPixelAtTime)(this.mouse_snapped_time, startDate, endDate, this.getTimelineWidth());
        markers.push({
          left: cursorPix + this.props.groupOffset,
          key: 1
        });
      }
      return _react2.default.createElement(
        'div',
        { className: divCssClass },
        _react2.default.createElement(
          _reactVirtualized.AutoSizer,
          { className: 'rct9k-autosizer', onResize: this.refreshGrid },
          function (_ref4) {
            var height = _ref4.height,
                width = _ref4.width;
            return _react2.default.createElement(
              'div',
              { className: 'parent-div', onMouseMove: _this6.mouseMoveFunc },
              _react2.default.createElement(_selector2.default, { ref: _this6.select_ref_callback }),
              _react2.default.createElement(_timebar2.default, _extends({
                cursorTime: _this6.getCursor(),
                start: _this6.props.startDate,
                end: _this6.props.endDate,
                width: width,
                leftOffset: groupOffset,
                selectedRanges: _this6.state.selection,
                groupTitleRenderer: groupTitleRenderer
              }, varTimebarProps)),
              markers.map(function (m) {
                return _react2.default.createElement(_marker2.default, { key: m.key, height: height, top: 0, left: m.left });
              }),
              _react2.default.createElement(_body2.default, {
                width: width,
                columnWidth: columnWidth(width),
                height: calculateHeight(height),
                rowHeight: _this6.rowHeight,
                rowCount: _this6.props.groups.length,
                cellRenderer: _this6.cellRenderer(_this6.getTimelineWidth(width)),
                grid_ref_callback: _this6.grid_ref_callback,
                shallowUpdateCheck: shallowUpdateCheck,
                forceRedrawFunc: forceRedrawFunc
              })
            );
          }
        )
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

Timeline.TIMELINE_MODES = Object.freeze({
  SELECT: 1,
  DRAG: 2,
  RESIZE: 4
});
Timeline.propTypes = {
  items: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
  groups: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
  groupOffset: _propTypes2.default.number.isRequired,
  rowLayers: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    start: _propTypes2.default.object.isRequired,
    end: _propTypes2.default.object.isRequired,
    rowNumber: _propTypes2.default.number.isRequired,
    style: _propTypes2.default.object.isRequired
  })),
  selectedItems: _propTypes2.default.arrayOf(_propTypes2.default.number),
  startDate: _propTypes2.default.object.isRequired,
  endDate: _propTypes2.default.object.isRequired,
  snapMinutes: _propTypes2.default.number,
  showCursorTime: _propTypes2.default.bool,
  cursorTimeFormat: _propTypes2.default.string,
  componentId: _propTypes2.default.string, // A unique key to identify the component. Only needed when 2 grids are mounted
  itemHeight: _propTypes2.default.number,
  timelineMode: _propTypes2.default.number,
  timebarFormat: _propTypes2.default.object,
  onItemClick: _propTypes2.default.func,
  onItemDoubleClick: _propTypes2.default.func,
  onItemContext: _propTypes2.default.func,
  onInteraction: _propTypes2.default.func.isRequired,
  onRowClick: _propTypes2.default.func,
  onRowContext: _propTypes2.default.func,
  onRowDoubleClick: _propTypes2.default.func,
  onItemHover: _propTypes2.default.func,
  onItemLeave: _propTypes2.default.func,
  itemRenderer: _propTypes2.default.func,
  groupRenderer: _propTypes2.default.func,
  groupTitleRenderer: _propTypes2.default.func,
  shallowUpdateCheck: _propTypes2.default.bool,
  forceRedrawFunc: _propTypes2.default.func,
  bottomResolution: _propTypes2.default.string,
  topResolution: _propTypes2.default.string,
  interactOptions: _propTypes2.default.shape({
    draggable: _propTypes2.default.object,
    pointerEvents: _propTypes2.default.object,
    resizable: _propTypes2.default.object.isRequired
  })
};
Timeline.defaultProps = {
  rowLayers: [],
  groupOffset: 150,
  itemHeight: 40,
  snapMinutes: 15,
  cursorTimeFormat: 'D MMM YYYY HH:mm',
  componentId: 'r9k1',
  showCursorTime: true,
  groupRenderer: _renderers.DefaultGroupRenderer,
  itemRenderer: _renderers.DefaultItemRenderer,
  groupTitleRenderer: function groupTitleRenderer() {
    return _react2.default.createElement('div', null);
  },
  timelineMode: Timeline.TIMELINE_MODES.SELECT | Timeline.TIMELINE_MODES.DRAG | Timeline.TIMELINE_MODES.RESIZE,
  shallowUpdateCheck: false,
  forceRedrawFunc: null,
  onItemHover: function onItemHover() {},
  onItemLeave: function onItemLeave() {},

  interactOptions: {}
};
Timeline.changeTypes = {
  resizeStart: 'resizeStart',
  resizeEnd: 'resizeEnd',
  dragEnd: 'dragEnd',
  dragStart: 'dragStart',
  itemsSelected: 'itemsSelected',
  snappedMouseMove: 'snappedMouseMove'
};

Timeline.no_op = function () {};

exports.default = Timeline;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90aW1lbGluZS5qcyJdLCJuYW1lcyI6WyJUaW1lbGluZSIsImJpdCIsIm1hc2siLCJwcm9wcyIsInJlZnJlc2hHcmlkIiwiY29uZmlnIiwiX2dyaWQiLCJyZWNvbXB1dGVHcmlkU2l6ZSIsIl9oYW5kbGVJdGVtUm93RXZlbnQiLCJlIiwiaXRlbUNhbGxiYWNrIiwicm93Q2FsbGJhY2siLCJwcmV2ZW50RGVmYXVsdCIsInNlbGVjdGluZyIsInRhcmdldCIsImhhc0F0dHJpYnV0ZSIsInBhcmVudEVsZW1lbnQiLCJpdGVtS2V5IiwiZ2V0QXR0cmlidXRlIiwiTnVtYmVyIiwicm93IiwiY2xpY2tlZFRpbWUiLCJjbGllbnRYIiwiZ3JvdXBPZmZzZXQiLCJzdGFydERhdGUiLCJlbmREYXRlIiwiZ2V0VGltZWxpbmVXaWR0aCIsInNuYXBwZWRDbGlja2VkVGltZSIsInNuYXBNaW51dGVzIiwic3RhdGUiLCJzZWxlY3Rpb24iLCJjdXJzb3JUaW1lIiwic2V0VGltZU1hcCIsIml0ZW1zIiwiY2VsbFJlbmRlcmVyIiwiYmluZCIsInJvd0hlaWdodCIsImdldEl0ZW0iLCJjaGFuZ2VHcm91cCIsInNldFNlbGVjdGlvbiIsImNsZWFyU2VsZWN0aW9uIiwiaXRlbUZyb21FbGVtZW50IiwidXBkYXRlRGltZW5zaW9ucyIsImdyaWRfcmVmX2NhbGxiYWNrIiwic2VsZWN0X3JlZl9jYWxsYmFjayIsInRocm90dGxlZE1vdXNlTW92ZUZ1bmMiLCJfIiwidGhyb3R0bGUiLCJtb3VzZU1vdmVGdW5jIiwiZ2V0Q3Vyc29yIiwiY2FuU2VsZWN0IiwiaXNCaXRTZXQiLCJUSU1FTElORV9NT0RFUyIsIlNFTEVDVCIsInRpbWVsaW5lTW9kZSIsImNhbkRyYWciLCJEUkFHIiwiY2FuUmVzaXplIiwiUkVTSVpFIiwic2V0VXBEcmFnZ2luZyIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJuZXh0UHJvcHMiLCJfaXRlbUludGVyYWN0YWJsZSIsInVuc2V0IiwiX3NlbGVjdFJlY3RhbmdsZUludGVyYWN0YWJsZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJzZWxlY3RlZEl0ZW1zIiwic2VsZWN0aW9uQ2hhbmdlIiwiaXNFcXVhbCIsInRpbWVsaW5lTW9kZUNoYW5nZSIsImNsZWFyVGltZW91dCIsInJlc2l6ZVRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZm9yY2VVcGRhdGUiLCJpdGVtUm93TWFwIiwicm93SXRlbU1hcCIsInJvd0hlaWdodENhY2hlIiwidmlzaWJsZUl0ZW1zIiwiZmlsdGVyIiwiaSIsImVuZCIsInN0YXJ0IiwiaXRlbVJvd3MiLCJncm91cEJ5IiwiZm9yRWFjaCIsInJvd0ludCIsInBhcnNlSW50IiwidW5kZWZpbmVkIiwiaXRlbSIsImtleSIsInB1c2giLCJpbmRleCIsInJvd05vIiwiaXRlbUluZGV4IiwiZmluZEluZGV4IiwiaWQiLCJjdXJSb3ciLCJuZXdSb3ciLCJzZWxlY3Rpb25zIiwibmV3U2VsZWN0aW9uIiwibWFwIiwicyIsImNsb25lIiwic2V0U3RhdGUiLCJ0b3RhbFdpZHRoIiwid2lkdGgiLCJ0b3BEaXZDbGFzc0lkIiwiY29tcG9uZW50SWQiLCJzZWxlY3RlZEl0ZW1TZWxlY3RvciIsInBvaW50ZXJFdmVudHMiLCJpbnRlcmFjdE9wdGlvbnMiLCJvbiIsIm9uSXRlbUNsaWNrIiwib25Sb3dDbGljayIsImRyYWdnYWJsZSIsImVuYWJsZWQiLCJhbGxvd0Zyb20iLCJyZXN0cmljdCIsInJlc3RyaWN0aW9uIiwiZWxlbWVudFJlY3QiLCJsZWZ0IiwicmlnaHQiLCJ0b3AiLCJib3R0b20iLCJhbmltYXRlZEl0ZW1zIiwib25JbnRlcmFjdGlvbiIsImNoYW5nZVR5cGVzIiwiZHJhZ1N0YXJ0IiwiZG9tSXRlbSIsIl9ncmlkRG9tTm9kZSIsInF1ZXJ5U2VsZWN0b3IiLCJzZXRBdHRyaWJ1dGUiLCJzdHlsZSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJkeCIsInBhcnNlRmxvYXQiLCJkeSIsInNuYXBEeCIsIml0ZW1EdXJhdGlvbiIsImRpZmYiLCJuZXdQaXhlbE9mZnNldCIsIm5ld1N0YXJ0IiwibmV3RW5kIiwiYWRkIiwid2Via2l0VHJhbnNmb3JtIiwidHJhbnNmb3JtIiwiY2xpZW50WSIsInJvd0NoYW5nZURlbHRhIiwidGltZURlbHRhIiwiY2hhbmdlcyIsIk1hdGgiLCJtYXgiLCJtaW4iLCJncm91cHMiLCJsZW5ndGgiLCJkcmFnRW5kIiwiaXRlbUhlaWdodCIsInJvdW5kIiwicmVtb3ZlQXR0cmlidXRlIiwicm93SW5kZXgiLCJyZXNpemFibGUiLCJlZGdlcyIsInNlbGVjdGVkIiwicmVzaXplU3RhcnQiLCJkZWx0YVJlY3QiLCJkdyIsInJlY3QiLCJtaW5pbXVtV2lkdGgiLCJzbmFwcGVkRHgiLCJzbmFwcGVkRHciLCJpc1N0YXJ0VGltZUNoYW5nZSIsIm1pblJvd05vIiwiSW5maW5pdHkiLCJkdXJhdGlvbkNoYW5nZSIsInN0YXJ0UGl4ZWxPZmZzZXQiLCJlbmRQaXhlbE9mZnNldCIsIm5ld19yb3dfaGVpZ2h0IiwicmVzaXplRW5kIiwiaWdub3JlRnJvbSIsInN0eWxlQ3Vyc29yIiwibmVhcmVzdFJvd09iamVjdCIsIl9zZWxlY3RCb3giLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ5IiwibWFnaWNhbENvbnN0YW50Iiwic3RhcnRYIiwic3RhcnRZIiwic3RhcnRSb3dPYmplY3QiLCJjdXJyZW50Um93T2JqZWN0Iiwic3RhcnRSb3dOdW1iZXIiLCJjdXJyZW50Um93TnVtYmVyIiwicm93TWFyZ2luQm9yZGVyIiwic3RhcnRUb3AiLCJjZWlsIiwiY3VycmVudEJvdHRvbSIsImZsb29yIiwibW92ZSIsImN1cnJlbnRUb3AiLCJzdGFydEJvdHRvbSIsImhlaWdodCIsInRvcFJvd09iamVjdCIsInRvcFJvd051bWJlciIsInRvcFJvd0xvYyIsImJvdHRvbVJvdyIsInN0YXJ0T2Zmc2V0IiwiZW5kT2Zmc2V0Iiwic3RhcnRUaW1lIiwiZW5kVGltZSIsInIiLCJpc0JlZm9yZSIsImlzQWZ0ZXIiLCJpdGVtc1NlbGVjdGVkIiwib25JdGVtSG92ZXIiLCJvbkl0ZW1MZWF2ZSIsInJvd0xheWVycyIsImNvbHVtbkluZGV4IiwicGFyZW50IiwiaXRlbUNvbCIsIml0ZW1zSW5Sb3ciLCJsYXllcnNJblJvdyIsInJvd051bWJlciIsIm5vX29wIiwib25JdGVtQ29udGV4dENsaWNrIiwib25Sb3dDb250ZXh0Q2xpY2siLCJvbkl0ZW1Eb3VibGVDbGljayIsIm9uUm93RG91YmxlQ2xpY2siLCJpdGVtUmVuZGVyZXIiLCJHcm91cENvbXAiLCJncm91cFJlbmRlcmVyIiwiZ3JvdXAiLCJmaW5kIiwiZyIsInNob3dDdXJzb3JUaW1lIiwiY3Vyc29yVGltZUZvcm1hdCIsImZvcm1hdCIsInJoIiwicmVhY3RDb21wb25lbnQiLCJSZWFjdERPTSIsImZpbmRET01Ob2RlIiwibGVmdE9mZnNldCIsImRvY3VtZW50IiwiY3Vyc29yU25hcHBlZFRpbWUiLCJtb3VzZV9zbmFwcGVkX3RpbWUiLCJ1bml4IiwiaXNTYW1lT3JBZnRlciIsInNuYXBwZWRNb3VzZU1vdmUiLCJzbmFwcGVkVGltZSIsInBlcnNpc3QiLCJ0aW1lYmFyRm9ybWF0IiwiZ3JvdXBUaXRsZVJlbmRlcmVyIiwic2hhbGxvd1VwZGF0ZUNoZWNrIiwiZm9yY2VSZWRyYXdGdW5jIiwiYm90dG9tUmVzb2x1dGlvbiIsInRvcFJlc29sdXRpb24iLCJkaXZDc3NDbGFzcyIsInZhclRpbWViYXJQcm9wcyIsImNvbHVtbldpZHRoIiwiY2FsY3VsYXRlSGVpZ2h0IiwidGltZWJhciIsInRpbWViYXJIZWlnaHQiLCJtYXJrZXJzIiwiY3Vyc29yUGl4IiwibSIsIlJlYWN0IiwiQ29tcG9uZW50IiwiT2JqZWN0IiwiZnJlZXplIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJudW1iZXIiLCJzaGFwZSIsImJvb2wiLCJzdHJpbmciLCJmdW5jIiwib25JdGVtQ29udGV4dCIsIm9uUm93Q29udGV4dCIsImRlZmF1bHRQcm9w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QUFHbkJ0QixXQUFTLFNBSFU7QUFJbkI1QixhQUFXLFdBSlE7QUFLbkJvRixpQkFBZSxlQUxJO0FBTW5Ca0Msb0JBQWtCO0FBTkMsQzs7QUE3RUZ4UCxRLENBbUdaZ08sSyxHQUFRLFlBQU0sQ0FBRSxDOztrQkFuR0poTyxRIiwiZmlsZSI6InRpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCB7R3JpZCwgQXV0b1NpemVyLCBkZWZhdWx0Q2VsbFJhbmdlUmVuZGVyZXJ9IGZyb20gJ3JlYWN0LXZpcnR1YWxpemVkJztcclxuXHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0IGludGVyYWN0IGZyb20gJ2ludGVyYWN0anMnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IHtwaXhUb0ludCwgaW50VG9QaXgsIHN1bVN0eWxlfSBmcm9tICcuL3V0aWxzL2NvbW1vblV0aWxzJztcclxuaW1wb3J0IHtcclxuICByb3dJdGVtc1JlbmRlcmVyLFxyXG4gIHJvd0xheWVyUmVuZGVyZXIsXHJcbiAgZ2V0TmVhcmVzdFJvd051bWJlcixcclxuICBnZXROZWFyZXN0Um93T2JqZWN0LFxyXG4gIGdldE1heE92ZXJsYXBwaW5nSXRlbXMsXHJcbiAgZ2V0VHJ1ZUJvdHRvbSxcclxuICBnZXRWZXJ0aWNhbE1hcmdpbkJvcmRlcixcclxuICBnZXRSb3dPYmplY3RSb3dOdW1iZXIsXHJcbn0gZnJvbSAnLi91dGlscy9pdGVtVXRpbHMnO1xyXG5pbXBvcnQge3RpbWVTbmFwLCBnZXRUaW1lQXRQaXhlbCwgZ2V0UGl4ZWxBdFRpbWUsIGdldFNuYXBQaXhlbEZyb21EZWx0YSwgcGl4ZWxzUGVyTWludXRlfSBmcm9tICcuL3V0aWxzL3RpbWVVdGlscyc7XHJcbmltcG9ydCBUaW1lYmFyIGZyb20gJy4vY29tcG9uZW50cy90aW1lYmFyJztcclxuaW1wb3J0IFNlbGVjdEJveCBmcm9tICcuL2NvbXBvbmVudHMvc2VsZWN0b3InO1xyXG5pbXBvcnQge0RlZmF1bHRHcm91cFJlbmRlcmVyLCBEZWZhdWx0SXRlbVJlbmRlcmVyfSBmcm9tICcuL2NvbXBvbmVudHMvcmVuZGVyZXJzJztcclxuaW1wb3J0IFRpbWVsaW5lQm9keSBmcm9tICcuL2NvbXBvbmVudHMvYm9keSc7XHJcbmltcG9ydCBNYXJrZXIgZnJvbSAnLi9jb21wb25lbnRzL21hcmtlcic7XHJcblxyXG4vKipcclxuICogVGltZWxpbmUgY2xhc3NcclxuICogQHJlYWN0UHJvcHMgeyFudW1iZXJ9IGl0ZW1zIC0gdGhpcyBpcyBwcm9wMVxyXG4gKiBAcmVhY3RQcm9wcyB7c3RyaW5nfSBwcm9wMiAtIHRoaXMgaXMgcHJvcDJcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAvKipcclxuICAgKiBAdHlwZSB7b2JqZWN0fVxyXG4gICAqL1xyXG4gIHN0YXRpYyBUSU1FTElORV9NT0RFUyA9IE9iamVjdC5mcmVlemUoe1xyXG4gICAgU0VMRUNUOiAxLFxyXG4gICAgRFJBRzogMixcclxuICAgIFJFU0laRTogNCxcclxuICB9KTtcclxuXHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxyXG4gICAgZ3JvdXBzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxyXG4gICAgZ3JvdXBPZmZzZXQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIHJvd0xheWVyczogUHJvcFR5cGVzLmFycmF5T2YoXHJcbiAgICAgIFByb3BUeXBlcy5zaGFwZSh7XHJcbiAgICAgICAgc3RhcnQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgICAgICBlbmQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcclxuICAgICAgICByb3dOdW1iZXI6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgICAgICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgICB9KVxyXG4gICAgKSxcclxuICAgIHNlbGVjdGVkSXRlbXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5udW1iZXIpLFxyXG4gICAgc3RhcnREYXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICBlbmREYXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXHJcbiAgICBzbmFwTWludXRlczogUHJvcFR5cGVzLm51bWJlcixcclxuICAgIHNob3dDdXJzb3JUaW1lOiBQcm9wVHlwZXMuYm9vbCxcclxuICAgIGN1cnNvclRpbWVGb3JtYXQ6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICBjb21wb25lbnRJZDogUHJvcFR5cGVzLnN0cmluZywgLy8gQSB1bmlxdWUga2V5IHRvIGlkZW50aWZ5IHRoZSBjb21wb25lbnQuIE9ubHkgbmVlZGVkIHdoZW4gMiBncmlkcyBhcmUgbW91bnRlZFxyXG4gICAgaXRlbUhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcclxuICAgIHRpbWVsaW5lTW9kZTogUHJvcFR5cGVzLm51bWJlcixcclxuICAgIHRpbWViYXJGb3JtYXQ6IFByb3BUeXBlcy5vYmplY3QsXHJcbiAgICBvbkl0ZW1DbGljazogUHJvcFR5cGVzLmZ1bmMsXHJcbiAgICBvbkl0ZW1Eb3VibGVDbGljazogUHJvcFR5cGVzLmZ1bmMsXHJcbiAgICBvbkl0ZW1Db250ZXh0OiBQcm9wVHlwZXMuZnVuYyxcclxuICAgIG9uSW50ZXJhY3Rpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICBvblJvd0NsaWNrOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgIG9uUm93Q29udGV4dDogUHJvcFR5cGVzLmZ1bmMsXHJcbiAgICBvblJvd0RvdWJsZUNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgIG9uSXRlbUhvdmVyOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgIG9uSXRlbUxlYXZlOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgIGl0ZW1SZW5kZXJlcjogUHJvcFR5cGVzLmZ1bmMsXHJcbiAgICBncm91cFJlbmRlcmVyOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgIGdyb3VwVGl0bGVSZW5kZXJlcjogUHJvcFR5cGVzLmZ1bmMsXHJcbiAgICBzaGFsbG93VXBkYXRlQ2hlY2s6IFByb3BUeXBlcy5ib29sLFxyXG4gICAgZm9yY2VSZWRyYXdGdW5jOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgIGJvdHRvbVJlc29sdXRpb246IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICB0b3BSZXNvbHV0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgaW50ZXJhY3RPcHRpb25zOiBQcm9wVHlwZXMuc2hhcGUoe1xyXG4gICAgICBkcmFnZ2FibGU6IFByb3BUeXBlcy5vYmplY3QsXHJcbiAgICAgIHBvaW50ZXJFdmVudHM6IFByb3BUeXBlcy5vYmplY3QsXHJcbiAgICAgIHJlc2l6YWJsZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxyXG4gICAgfSksXHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgIHJvd0xheWVyczogW10sXHJcbiAgICBncm91cE9mZnNldDogMTUwLFxyXG4gICAgaXRlbUhlaWdodDogNDAsXHJcbiAgICBzbmFwTWludXRlczogMTUsXHJcbiAgICBjdXJzb3JUaW1lRm9ybWF0OiAnRCBNTU0gWVlZWSBISDptbScsXHJcbiAgICBjb21wb25lbnRJZDogJ3I5azEnLFxyXG4gICAgc2hvd0N1cnNvclRpbWU6IHRydWUsXHJcbiAgICBncm91cFJlbmRlcmVyOiBEZWZhdWx0R3JvdXBSZW5kZXJlcixcclxuICAgIGl0ZW1SZW5kZXJlcjogRGVmYXVsdEl0ZW1SZW5kZXJlcixcclxuICAgIGdyb3VwVGl0bGVSZW5kZXJlcjogKCkgPT4gPGRpdiAvPixcclxuICAgIHRpbWVsaW5lTW9kZTogVGltZWxpbmUuVElNRUxJTkVfTU9ERVMuU0VMRUNUIHwgVGltZWxpbmUuVElNRUxJTkVfTU9ERVMuRFJBRyB8IFRpbWVsaW5lLlRJTUVMSU5FX01PREVTLlJFU0laRSxcclxuICAgIHNoYWxsb3dVcGRhdGVDaGVjazogZmFsc2UsXHJcbiAgICBmb3JjZVJlZHJhd0Z1bmM6IG51bGwsXHJcbiAgICBvbkl0ZW1Ib3ZlcigpIHt9LFxyXG4gICAgb25JdGVtTGVhdmUoKSB7fSxcclxuICAgIGludGVyYWN0T3B0aW9uczoge30sXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHR5cGVzIG9mIGludGVyYWN0aW9ucyAtIHNlZSB7QGxpbmsgb25JbnRlcmFjdGlvbn1cclxuICAgKi9cclxuICBzdGF0aWMgY2hhbmdlVHlwZXMgPSB7XHJcbiAgICByZXNpemVTdGFydDogJ3Jlc2l6ZVN0YXJ0JyxcclxuICAgIHJlc2l6ZUVuZDogJ3Jlc2l6ZUVuZCcsXHJcbiAgICBkcmFnRW5kOiAnZHJhZ0VuZCcsXHJcbiAgICBkcmFnU3RhcnQ6ICdkcmFnU3RhcnQnLFxyXG4gICAgaXRlbXNTZWxlY3RlZDogJ2l0ZW1zU2VsZWN0ZWQnLFxyXG4gICAgc25hcHBlZE1vdXNlTW92ZTogJ3NuYXBwZWRNb3VzZU1vdmUnLFxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYml0IGlzIHNldCBpbiB0aGUgZ2l2ZW4gbWFza1xyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiaXQgQml0IHRvIGNoZWNrXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IG1hc2sgTWFzayB0byBjaGVjayBhZ2FpbnN0XHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgYml0IGlzIHNldDsgZWxzZSBmYWxzZVxyXG4gICAqL1xyXG4gIHN0YXRpYyBpc0JpdFNldChiaXQsIG1hc2spIHtcclxuICAgIHJldHVybiAoYml0ICYgbWFzaykgPT09IGJpdDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFsaWFzIGZvciBubyBvcCBmdW5jdGlvblxyXG4gICAqL1xyXG4gIHN0YXRpYyBub19vcCA9ICgpID0+IHt9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5zZWxlY3RpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuc3RhdGUgPSB7c2VsZWN0aW9uOiBbXSwgY3Vyc29yVGltZTogbnVsbH07XHJcbiAgICB0aGlzLnNldFRpbWVNYXAodGhpcy5wcm9wcy5pdGVtcyk7XHJcblxyXG4gICAgdGhpcy5jZWxsUmVuZGVyZXIgPSB0aGlzLmNlbGxSZW5kZXJlci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yb3dIZWlnaHQgPSB0aGlzLnJvd0hlaWdodC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZXRUaW1lTWFwID0gdGhpcy5zZXRUaW1lTWFwLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldEl0ZW0gPSB0aGlzLmdldEl0ZW0uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hhbmdlR3JvdXAgPSB0aGlzLmNoYW5nZUdyb3VwLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNldFNlbGVjdGlvbiA9IHRoaXMuc2V0U2VsZWN0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNsZWFyU2VsZWN0aW9uID0gdGhpcy5jbGVhclNlbGVjdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRUaW1lbGluZVdpZHRoID0gdGhpcy5nZXRUaW1lbGluZVdpZHRoLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLml0ZW1Gcm9tRWxlbWVudCA9IHRoaXMuaXRlbUZyb21FbGVtZW50LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMgPSB0aGlzLnVwZGF0ZURpbWVuc2lvbnMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ3JpZF9yZWZfY2FsbGJhY2sgPSB0aGlzLmdyaWRfcmVmX2NhbGxiYWNrLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNlbGVjdF9yZWZfY2FsbGJhY2sgPSB0aGlzLnNlbGVjdF9yZWZfY2FsbGJhY2suYmluZCh0aGlzKTtcclxuICAgIHRoaXMudGhyb3R0bGVkTW91c2VNb3ZlRnVuYyA9IF8udGhyb3R0bGUodGhpcy50aHJvdHRsZWRNb3VzZU1vdmVGdW5jLmJpbmQodGhpcyksIDIwKTtcclxuICAgIHRoaXMubW91c2VNb3ZlRnVuYyA9IHRoaXMubW91c2VNb3ZlRnVuYy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDdXJzb3IgPSB0aGlzLmdldEN1cnNvci5iaW5kKHRoaXMpO1xyXG5cclxuICAgIGNvbnN0IGNhblNlbGVjdCA9IFRpbWVsaW5lLmlzQml0U2V0KFRpbWVsaW5lLlRJTUVMSU5FX01PREVTLlNFTEVDVCwgdGhpcy5wcm9wcy50aW1lbGluZU1vZGUpO1xyXG4gICAgY29uc3QgY2FuRHJhZyA9IFRpbWVsaW5lLmlzQml0U2V0KFRpbWVsaW5lLlRJTUVMSU5FX01PREVTLkRSQUcsIHRoaXMucHJvcHMudGltZWxpbmVNb2RlKTtcclxuICAgIGNvbnN0IGNhblJlc2l6ZSA9IFRpbWVsaW5lLmlzQml0U2V0KFRpbWVsaW5lLlRJTUVMSU5FX01PREVTLlJFU0laRSwgdGhpcy5wcm9wcy50aW1lbGluZU1vZGUpO1xyXG4gICAgdGhpcy5zZXRVcERyYWdnaW5nKGNhblNlbGVjdCwgY2FuRHJhZywgY2FuUmVzaXplKTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMudXBkYXRlRGltZW5zaW9ucyk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgdGhpcy5zZXRUaW1lTWFwKG5leHRQcm9wcy5pdGVtcywgbmV4dFByb3BzLnN0YXJ0RGF0ZSwgbmV4dFByb3BzLmVuZERhdGUpO1xyXG4gICAgLy8gQFRPRE9cclxuICAgIC8vIGludmVzdGlnYXRlIGlmIHdlIG5lZWQgdGhpcywgb25seSBhZGRlZCB0byByZWZyZXNoIHRoZSBncmlkXHJcbiAgICAvLyB3aGVuIGRvdWJsZSBjbGljayAtPiBhZGQgYW4gaXRlbVxyXG4gICAgdGhpcy5yZWZyZXNoR3JpZCgpO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICBpZiAodGhpcy5faXRlbUludGVyYWN0YWJsZSkgdGhpcy5faXRlbUludGVyYWN0YWJsZS51bnNldCgpO1xyXG4gICAgaWYgKHRoaXMuX3NlbGVjdFJlY3RhbmdsZUludGVyYWN0YWJsZSkgdGhpcy5fc2VsZWN0UmVjdGFuZ2xlSW50ZXJhY3RhYmxlLnVuc2V0KCk7XHJcblxyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMudXBkYXRlRGltZW5zaW9ucyk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcclxuICAgIGNvbnN0IHt0aW1lbGluZU1vZGUsIHNlbGVjdGVkSXRlbXN9ID0gdGhpcy5wcm9wcztcclxuICAgIGNvbnN0IHNlbGVjdGlvbkNoYW5nZSA9ICFfLmlzRXF1YWwocHJldlByb3BzLnNlbGVjdGVkSXRlbXMsIHNlbGVjdGVkSXRlbXMpO1xyXG4gICAgY29uc3QgdGltZWxpbmVNb2RlQ2hhbmdlID0gIV8uaXNFcXVhbChwcmV2UHJvcHMudGltZWxpbmVNb2RlLCB0aW1lbGluZU1vZGUpO1xyXG5cclxuICAgIGlmICh0aW1lbGluZU1vZGVDaGFuZ2UgfHwgc2VsZWN0aW9uQ2hhbmdlKSB7XHJcbiAgICAgIGNvbnN0IGNhblNlbGVjdCA9IFRpbWVsaW5lLmlzQml0U2V0KFRpbWVsaW5lLlRJTUVMSU5FX01PREVTLlNFTEVDVCwgdGltZWxpbmVNb2RlKTtcclxuICAgICAgY29uc3QgY2FuRHJhZyA9IFRpbWVsaW5lLmlzQml0U2V0KFRpbWVsaW5lLlRJTUVMSU5FX01PREVTLkRSQUcsIHRpbWVsaW5lTW9kZSk7XHJcbiAgICAgIGNvbnN0IGNhblJlc2l6ZSA9IFRpbWVsaW5lLmlzQml0U2V0KFRpbWVsaW5lLlRJTUVMSU5FX01PREVTLlJFU0laRSwgdGltZWxpbmVNb2RlKTtcclxuICAgICAgdGhpcy5zZXRVcERyYWdnaW5nKGNhblNlbGVjdCwgY2FuRHJhZywgY2FuUmVzaXplKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlLXJlbmRlcnMgdGhlIGdyaWQgd2hlbiB0aGUgd2luZG93IG9yIGNvbnRhaW5lciBpcyByZXNpemVkXHJcbiAgICovXHJcbiAgdXBkYXRlRGltZW5zaW9ucygpIHtcclxuICAgIGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRpbWVvdXQpO1xyXG4gICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcclxuICAgICAgdGhpcy5fZ3JpZC5yZWNvbXB1dGVHcmlkU2l6ZSgpO1xyXG4gICAgfSwgMTAwKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGludGVybmFsIG1hcHMgdXNlZCBieSB0aGUgY29tcG9uZW50IGZvciBsb29raW5nIHVwIGl0ZW0gJiByb3cgZGF0YVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IGl0ZW1zIFRoZSBpdGVtcyB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIGdyaWRcclxuICAgKiBAcGFyYW0ge21vbWVudH0gc3RhcnREYXRlIFRoZSB2aXNpYmxlIHN0YXJ0IGRhdGUgb2YgdGhlIHRpbWVsaW5lXHJcbiAgICogQHBhcmFtIHttb21lbnR9IGVuZERhdGUgVGhlIHZpc2libGUgZW5kIGRhdGUgb2YgdGhlIHRpbWVsaW5lXHJcbiAgICovXHJcbiAgc2V0VGltZU1hcChpdGVtcywgc3RhcnREYXRlLCBlbmREYXRlKSB7XHJcbiAgICBpZiAoIXN0YXJ0RGF0ZSB8fCAhZW5kRGF0ZSkge1xyXG4gICAgICBzdGFydERhdGUgPSB0aGlzLnByb3BzLnN0YXJ0RGF0ZTtcclxuICAgICAgZW5kRGF0ZSA9IHRoaXMucHJvcHMuZW5kRGF0ZTtcclxuICAgIH1cclxuICAgIHRoaXMuaXRlbVJvd01hcCA9IHt9OyAvLyB0aW1lbGluZSBlbGVtZW50cyAoa2V5KSA9PiAocm93Tm8pLlxyXG4gICAgdGhpcy5yb3dJdGVtTWFwID0ge307IC8vIChyb3dObykgPT4gdGltZWxpbmUgZWxlbWVudHNcclxuICAgIHRoaXMucm93SGVpZ2h0Q2FjaGUgPSB7fTsgLy8gKHJvd05vKSA9PiBtYXggbnVtYmVyIG9mIHN0YWNrZWQgaXRlbXNcclxuICAgIGxldCB2aXNpYmxlSXRlbXMgPSBfLmZpbHRlcihpdGVtcywgaSA9PiB7XHJcbiAgICAgIHJldHVybiBpLmVuZCA+IHN0YXJ0RGF0ZSAmJiBpLnN0YXJ0IDwgZW5kRGF0ZTtcclxuICAgIH0pO1xyXG4gICAgbGV0IGl0ZW1Sb3dzID0gXy5ncm91cEJ5KHZpc2libGVJdGVtcywgJ3JvdycpO1xyXG4gICAgXy5mb3JFYWNoKGl0ZW1Sb3dzLCAodmlzaWJsZUl0ZW1zLCByb3cpID0+IHtcclxuICAgICAgY29uc3Qgcm93SW50ID0gcGFyc2VJbnQocm93KTtcclxuICAgICAgaWYgKHRoaXMucm93SXRlbU1hcFtyb3dJbnRdID09PSB1bmRlZmluZWQpIHRoaXMucm93SXRlbU1hcFtyb3dJbnRdID0gW107XHJcbiAgICAgIF8uZm9yRWFjaCh2aXNpYmxlSXRlbXMsIGl0ZW0gPT4ge1xyXG4gICAgICAgIHRoaXMuaXRlbVJvd01hcFtpdGVtLmtleV0gPSByb3dJbnQ7XHJcbiAgICAgICAgdGhpcy5yb3dJdGVtTWFwW3Jvd0ludF0ucHVzaChpdGVtKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMucm93SGVpZ2h0Q2FjaGVbcm93SW50XSA9IGdldE1heE92ZXJsYXBwaW5nSXRlbXModmlzaWJsZUl0ZW1zKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBpdGVtIGdpdmVuIGl0cyBET00gZWxlbWVudFxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlIHRoZSBET00gZWxlbWVudCBvZiB0aGUgaXRlbVxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gSXRlbSBkZXRhaWxzXHJcbiAgICogQHByb3Age251bWJlcnxzdHJpbmd9IGluZGV4IFRoZSBpdGVtJ3MgaW5kZXhcclxuICAgKiBAcHJvcCB7bnVtYmVyfSByb3dObyBUaGUgcm93IG51bWJlciB0aGUgaXRlbSBpcyBpblxyXG4gICAqIEBwcm9wIHtudW1iZXJ9IGl0ZW1JbmRleCBOb3QgcmVhbGx5IHVzZWQgLSBnZXRzIHRoZSBpbmRleCBvZiB0aGUgaXRlbSBpbiB0aGUgcm93IG1hcFxyXG4gICAqIEBwcm9wIHtPYmplY3R9IGl0ZW0gVGhlIHByb3ZpZGVkIGl0ZW0gb2JqZWN0XHJcbiAgICovXHJcbiAgaXRlbUZyb21FbGVtZW50KGUpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaXRlbS1pbmRleCcpO1xyXG4gICAgY29uc3Qgcm93Tm8gPSB0aGlzLml0ZW1Sb3dNYXBbaW5kZXhdO1xyXG4gICAgY29uc3QgaXRlbUluZGV4ID0gXy5maW5kSW5kZXgodGhpcy5yb3dJdGVtTWFwW3Jvd05vXSwgaSA9PiBpLmtleSA9PSBpbmRleCk7XHJcbiAgICBjb25zdCBpdGVtID0gdGhpcy5yb3dJdGVtTWFwW3Jvd05vXVtpdGVtSW5kZXhdO1xyXG5cclxuICAgIHJldHVybiB7aW5kZXgsIHJvd05vLCBpdGVtSW5kZXgsIGl0ZW19O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyBhbiBpdGVtIGdpdmVuIGl0cyBJRFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpZCBpdGVtIGlkXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBJdGVtIG9iamVjdFxyXG4gICAqL1xyXG4gIGdldEl0ZW0oaWQpIHtcclxuICAgIC8vIFRoaXMgaXMgcXVpdGUgc3R1cGlkIGFuZCBzaG91bGRuJ3QgcmVhbGx5IGJlIG5lZWRlZFxyXG4gICAgY29uc3Qgcm93Tm8gPSB0aGlzLml0ZW1Sb3dNYXBbaWRdO1xyXG4gICAgY29uc3QgaXRlbUluZGV4ID0gXy5maW5kSW5kZXgodGhpcy5yb3dJdGVtTWFwW3Jvd05vXSwgaSA9PiBpLmtleSA9PSBpZCk7XHJcbiAgICByZXR1cm4gdGhpcy5yb3dJdGVtTWFwW3Jvd05vXVtpdGVtSW5kZXhdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW92ZSBhbiBpdGVtIGZyb20gb25lIHJvdyB0byBhbm90aGVyXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGl0ZW0gVGhlIGl0ZW0gb2JqZWN0IHdob3NlIGdyb3VwcyBpcyB0byBiZSBjaGFuZ2VkXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1clJvdyBUaGUgaXRlbSdzIGN1cnJlbnQgcm93IGluZGV4XHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IG5ld1JvdyBUaGUgaXRlbSdzIG5ldyByb3cgaW5kZXhcclxuICAgKi9cclxuICBjaGFuZ2VHcm91cChpdGVtLCBjdXJSb3csIG5ld1Jvdykge1xyXG4gICAgaXRlbS5yb3cgPSBuZXdSb3c7XHJcbiAgICB0aGlzLml0ZW1Sb3dNYXBbaXRlbS5rZXldID0gbmV3Um93O1xyXG4gICAgdGhpcy5yb3dJdGVtTWFwW2N1clJvd10gPSB0aGlzLnJvd0l0ZW1NYXBbY3VyUm93XS5maWx0ZXIoaSA9PiBpLmtleSAhPT0gaXRlbS5rZXkpO1xyXG4gICAgdGhpcy5yb3dJdGVtTWFwW25ld1Jvd10ucHVzaChpdGVtKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHRpbWUgcmFuZ2VzIChmb3IgdGhlIHRpbWViYXIgdG8gZGlzcGxheSlcclxuICAgKiBAcGFyYW0ge09iamVjdFtdfSBzZWxlY3Rpb25zIE9mIHRoZSBmb3JtIGBbW3N0YXJ0LCBlbmRdLCBbc3RhcnQsIGVuZF0sIC4uLl1gXHJcbiAgICovXHJcbiAgc2V0U2VsZWN0aW9uKHNlbGVjdGlvbnMpIHtcclxuICAgIGxldCBuZXdTZWxlY3Rpb24gPSBfLm1hcChzZWxlY3Rpb25zLCBzID0+IHtcclxuICAgICAgcmV0dXJuIHtzdGFydDogc1swXS5jbG9uZSgpLCBlbmQ6IHNbMV0uY2xvbmUoKX07XHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGlvbjogbmV3U2VsZWN0aW9ufSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDbGVhcnMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCB0aW1lIHJhbmdlIHN0YXRlXHJcbiAgICovXHJcbiAgY2xlYXJTZWxlY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtzZWxlY3Rpb246IFtdfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIHdpZHRoIG9mIHRoZSB0aW1lbGluZSBOT1QgaW5jbHVkaW5nIHRoZSBsZWZ0IGdyb3VwIGxpc3RcclxuICAgKiBAcGFyYW0gez9udW1iZXJ9IHRvdGFsV2lkdGggVG90YWwgdGltZWxpbmUgd2lkdGguIElmIG5vdCBzdXBwbGllZCB3ZSB1c2UgdGhlIHRpbWVsaW5lIHJlZlxyXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSB3aWR0aCBpbiBwaXhlbHNcclxuICAgKi9cclxuICBnZXRUaW1lbGluZVdpZHRoKHRvdGFsV2lkdGgpIHtcclxuICAgIGNvbnN0IHtncm91cE9mZnNldH0gPSB0aGlzLnByb3BzO1xyXG4gICAgaWYgKHRvdGFsV2lkdGggIT09IHVuZGVmaW5lZCkgcmV0dXJuIHRvdGFsV2lkdGggLSBncm91cE9mZnNldDtcclxuICAgIHJldHVybiB0aGlzLl9ncmlkLnByb3BzLndpZHRoIC0gZ3JvdXBPZmZzZXQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZS1jb21wdXRlcyB0aGUgZ3JpZCdzIHJvdyBzaXplc1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0P30gY29uZmlnIENvbmZpZyB0byBwYXNzIHdvIHJlYWN0LXZpcnR1YWxpemVkJ3MgY29tcHV0ZSBmdW5jXHJcbiAgICovXHJcbiAgcmVmcmVzaEdyaWQgPSAoY29uZmlnID0ge30pID0+IHtcclxuICAgIHRoaXMuX2dyaWQucmVjb21wdXRlR3JpZFNpemUoY29uZmlnKTtcclxuICB9O1xyXG5cclxuICBzZXRVcERyYWdnaW5nKGNhblNlbGVjdCwgY2FuRHJhZywgY2FuUmVzaXplKSB7XHJcbiAgICAvLyBObyBuZWVkIHRvIHNldFVwRHJhZ2dpbmcgZHVyaW5nIFNTUlxyXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0b3BEaXZDbGFzc0lkID0gYHJjdDlrLWlkLSR7dGhpcy5wcm9wcy5jb21wb25lbnRJZH1gO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtU2VsZWN0b3IgPSAnLnJjdDlrLWl0ZW1zLW91dGVyLXNlbGVjdGVkJztcclxuICAgIGlmICh0aGlzLl9pdGVtSW50ZXJhY3RhYmxlKSB0aGlzLl9pdGVtSW50ZXJhY3RhYmxlLnVuc2V0KCk7XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0UmVjdGFuZ2xlSW50ZXJhY3RhYmxlKSB0aGlzLl9zZWxlY3RSZWN0YW5nbGVJbnRlcmFjdGFibGUudW5zZXQoKTtcclxuXHJcbiAgICB0aGlzLl9pdGVtSW50ZXJhY3RhYmxlID0gaW50ZXJhY3QoYC4ke3RvcERpdkNsYXNzSWR9IC5pdGVtX2RyYWdnYWJsZWApO1xyXG4gICAgdGhpcy5fc2VsZWN0UmVjdGFuZ2xlSW50ZXJhY3RhYmxlID0gaW50ZXJhY3QoYC4ke3RvcERpdkNsYXNzSWR9IC5wYXJlbnQtZGl2YCk7XHJcblxyXG4gICAgdGhpcy5faXRlbUludGVyYWN0YWJsZVxyXG4gICAgICAucG9pbnRlckV2ZW50cyh0aGlzLnByb3BzLmludGVyYWN0T3B0aW9ucy5wb2ludGVyRXZlbnRzKVxyXG4gICAgICAub24oJ3RhcCcsIGUgPT4ge1xyXG4gICAgICAgIHRoaXMuX2hhbmRsZUl0ZW1Sb3dFdmVudChlLCB0aGlzLnByb3BzLm9uSXRlbUNsaWNrLCB0aGlzLnByb3BzLm9uUm93Q2xpY2spO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICBpZiAoY2FuRHJhZykge1xyXG4gICAgICB0aGlzLl9pdGVtSW50ZXJhY3RhYmxlXHJcbiAgICAgICAgLmRyYWdnYWJsZSh7XHJcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgYWxsb3dGcm9tOiBzZWxlY3RlZEl0ZW1TZWxlY3RvcixcclxuICAgICAgICAgIHJlc3RyaWN0OiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0aW9uOiBgLiR7dG9wRGl2Q2xhc3NJZH1gLFxyXG4gICAgICAgICAgICBlbGVtZW50UmVjdDoge2xlZnQ6IDAsIHJpZ2h0OiAxLCB0b3A6IDAsIGJvdHRvbTogMX0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgLi4udGhpcy5wcm9wcy5pbnRlcmFjdE9wdGlvbnMuZHJhZ2dhYmxlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKCdkcmFnc3RhcnQnLCBlID0+IHtcclxuICAgICAgICAgIGxldCBzZWxlY3Rpb25zID0gW107XHJcbiAgICAgICAgICBjb25zdCBhbmltYXRlZEl0ZW1zID0gdGhpcy5wcm9wcy5vbkludGVyYWN0aW9uKFxyXG4gICAgICAgICAgICBUaW1lbGluZS5jaGFuZ2VUeXBlcy5kcmFnU3RhcnQsXHJcbiAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuc2VsZWN0ZWRJdGVtc1xyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBfLmZvckVhY2goYW5pbWF0ZWRJdGVtcywgaWQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZG9tSXRlbSA9IHRoaXMuX2dyaWREb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoXCJzcGFuW2RhdGEtaXRlbS1pbmRleD0nXCIgKyBpZCArIFwiJ1wiKTtcclxuICAgICAgICAgICAgaWYgKGRvbUl0ZW0pIHtcclxuICAgICAgICAgICAgICBzZWxlY3Rpb25zLnB1c2goW3RoaXMuZ2V0SXRlbShpZCkuc3RhcnQsIHRoaXMuZ2V0SXRlbShpZCkuZW5kXSk7XHJcbiAgICAgICAgICAgICAgZG9tSXRlbS5zZXRBdHRyaWJ1dGUoJ2lzRHJhZ2dpbmcnLCAnVHJ1ZScpO1xyXG4gICAgICAgICAgICAgIGRvbUl0ZW0uc2V0QXR0cmlidXRlKCdkcmFnLXgnLCAwKTtcclxuICAgICAgICAgICAgICBkb21JdGVtLnNldEF0dHJpYnV0ZSgnZHJhZy15JywgMCk7XHJcbiAgICAgICAgICAgICAgZG9tSXRlbS5zdHlsZVsnei1pbmRleCddID0gNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihzZWxlY3Rpb25zKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vbignZHJhZ21vdmUnLCBlID0+IHtcclxuICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgICAgICAgbGV0IGFuaW1hdGVkSXRlbXMgPSB0aGlzLl9ncmlkRG9tTm9kZS5xdWVyeVNlbGVjdG9yQWxsKFwic3Bhbltpc0RyYWdnaW5nPSdUcnVlJ1wiKSB8fCBbXTtcclxuXHJcbiAgICAgICAgICBsZXQgZHggPSAocGFyc2VGbG9hdCh0YXJnZXQuZ2V0QXR0cmlidXRlKCdkcmFnLXgnKSkgfHwgMCkgKyBlLmR4O1xyXG4gICAgICAgICAgbGV0IGR5ID0gKHBhcnNlRmxvYXQodGFyZ2V0LmdldEF0dHJpYnV0ZSgnZHJhZy15JykpIHx8IDApICsgZS5keTtcclxuICAgICAgICAgIGxldCBzZWxlY3Rpb25zID0gW107XHJcblxyXG4gICAgICAgICAgLy8gU25hcCB0aGUgbW92ZW1lbnQgdG8gdGhlIGN1cnJlbnQgc25hcCBpbnRlcnZhbFxyXG4gICAgICAgICAgY29uc3Qgc25hcER4ID0gZ2V0U25hcFBpeGVsRnJvbURlbHRhKFxyXG4gICAgICAgICAgICBkeCxcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5zdGFydERhdGUsXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZW5kRGF0ZSxcclxuICAgICAgICAgICAgdGhpcy5nZXRUaW1lbGluZVdpZHRoKCksXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuc25hcE1pbnV0ZXNcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgXy5mb3JFYWNoKGFuaW1hdGVkSXRlbXMsIGRvbUl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7aXRlbX0gPSB0aGlzLml0ZW1Gcm9tRWxlbWVudChkb21JdGVtKTtcclxuICAgICAgICAgICAgbGV0IGl0ZW1EdXJhdGlvbiA9IGl0ZW0uZW5kLmRpZmYoaXRlbS5zdGFydCk7XHJcbiAgICAgICAgICAgIGxldCBuZXdQaXhlbE9mZnNldCA9IHBpeFRvSW50KGRvbUl0ZW0uc3R5bGUubGVmdCkgKyBzbmFwRHg7XHJcbiAgICAgICAgICAgIGxldCBuZXdTdGFydCA9IGdldFRpbWVBdFBpeGVsKFxyXG4gICAgICAgICAgICAgIG5ld1BpeGVsT2Zmc2V0LFxyXG4gICAgICAgICAgICAgIHRoaXMucHJvcHMuc3RhcnREYXRlLFxyXG4gICAgICAgICAgICAgIHRoaXMucHJvcHMuZW5kRGF0ZSxcclxuICAgICAgICAgICAgICB0aGlzLmdldFRpbWVsaW5lV2lkdGgoKSxcclxuICAgICAgICAgICAgICB0aGlzLnByb3BzLnNuYXBNaW51dGVzXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3RW5kID0gbmV3U3RhcnQuY2xvbmUoKS5hZGQoaXRlbUR1cmF0aW9uKTtcclxuICAgICAgICAgICAgc2VsZWN0aW9ucy5wdXNoKFtuZXdTdGFydCwgbmV3RW5kXSk7XHJcblxyXG4gICAgICAgICAgICAvLyBUcmFuc2xhdGUgdGhlIG5ldyBzdGFydCB0aW1lIGJhY2sgdG8gcGl4ZWxzLCBzbyB3ZSBjYW4gYW5pbWF0ZSB0aGUgc25hcFxyXG4gICAgICAgICAgICBkb21JdGVtLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IGRvbUl0ZW0uc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgnICsgc25hcER4ICsgJ3B4LCAnICsgZHkgKyAncHgpJztcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RyYWcteCcsIGR4KTtcclxuICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RyYWcteScsIGR5KTtcclxuXHJcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihzZWxlY3Rpb25zKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vbignZHJhZ2VuZCcsIGUgPT4ge1xyXG4gICAgICAgICAgY29uc3Qge2l0ZW0sIHJvd05vfSA9IHRoaXMuaXRlbUZyb21FbGVtZW50KGUudGFyZ2V0KTtcclxuICAgICAgICAgIGxldCBhbmltYXRlZEl0ZW1zID0gdGhpcy5fZ3JpZERvbU5vZGUucXVlcnlTZWxlY3RvckFsbChcInNwYW5baXNEcmFnZ2luZz0nVHJ1ZSdcIikgfHwgW107XHJcblxyXG4gICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24oW1tpdGVtLnN0YXJ0LCBpdGVtLmVuZF1dKTtcclxuICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuXHJcbiAgICAgICAgICAvLyBDaGFuZ2Ugcm93XHJcbiAgICAgICAgICBsZXQgbmV3Um93ID0gZ2V0TmVhcmVzdFJvd051bWJlcihlLmNsaWVudFgsIGUuY2xpZW50WSk7XHJcblxyXG4gICAgICAgICAgbGV0IHJvd0NoYW5nZURlbHRhID0gbmV3Um93IC0gcm93Tm87XHJcbiAgICAgICAgICAvLyBVcGRhdGUgdGltZVxyXG4gICAgICAgICAgbGV0IG5ld1BpeGVsT2Zmc2V0ID0gcGl4VG9JbnQoZS50YXJnZXQuc3R5bGUubGVmdCkgKyAocGFyc2VGbG9hdChlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RyYWcteCcpKSB8fCAwKTtcclxuICAgICAgICAgIGxldCBuZXdTdGFydCA9IGdldFRpbWVBdFBpeGVsKFxyXG4gICAgICAgICAgICBuZXdQaXhlbE9mZnNldCxcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5zdGFydERhdGUsXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZW5kRGF0ZSxcclxuICAgICAgICAgICAgdGhpcy5nZXRUaW1lbGluZVdpZHRoKCksXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuc25hcE1pbnV0ZXNcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgY29uc3QgdGltZURlbHRhID0gbmV3U3RhcnQuY2xvbmUoKS5kaWZmKGl0ZW0uc3RhcnQsICdtaW51dGVzJyk7XHJcbiAgICAgICAgICBjb25zdCBjaGFuZ2VzID0ge3Jvd0NoYW5nZURlbHRhLCB0aW1lRGVsdGF9O1xyXG4gICAgICAgICAgbGV0IGl0ZW1zID0gW107XHJcblxyXG4gICAgICAgICAgLy8gRGVmYXVsdCwgYWxsIGl0ZW1zIG1vdmUgYnkgdGhlIHNhbWUgb2Zmc2V0IGR1cmluZyBhIGRyYWdcclxuICAgICAgICAgIF8uZm9yRWFjaChhbmltYXRlZEl0ZW1zLCBkb21JdGVtID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge2l0ZW0sIHJvd05vfSA9IHRoaXMuaXRlbUZyb21FbGVtZW50KGRvbUl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGl0ZW1EdXJhdGlvbiA9IGl0ZW0uZW5kLmRpZmYoaXRlbS5zdGFydCk7XHJcbiAgICAgICAgICAgIGxldCBuZXdTdGFydCA9IGl0ZW0uc3RhcnQuY2xvbmUoKS5hZGQodGltZURlbHRhLCAnbWludXRlcycpO1xyXG4gICAgICAgICAgICBsZXQgbmV3RW5kID0gbmV3U3RhcnQuY2xvbmUoKS5hZGQoaXRlbUR1cmF0aW9uKTtcclxuICAgICAgICAgICAgaXRlbS5zdGFydCA9IG5ld1N0YXJ0O1xyXG4gICAgICAgICAgICBpdGVtLmVuZCA9IG5ld0VuZDtcclxuICAgICAgICAgICAgaWYgKHJvd0NoYW5nZURlbHRhIDwgMCkge1xyXG4gICAgICAgICAgICAgIGl0ZW0ucm93ID0gTWF0aC5tYXgoMCwgaXRlbS5yb3cgKyByb3dDaGFuZ2VEZWx0YSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocm93Q2hhbmdlRGVsdGEgPiAwKSB7XHJcbiAgICAgICAgICAgICAgaXRlbS5yb3cgPSBNYXRoLm1pbih0aGlzLnByb3BzLmdyb3Vwcy5sZW5ndGggLSAxLCBpdGVtLnJvdyArIHJvd0NoYW5nZURlbHRhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRoaXMucHJvcHMub25JbnRlcmFjdGlvbihUaW1lbGluZS5jaGFuZ2VUeXBlcy5kcmFnRW5kLCBjaGFuZ2VzLCBpdGVtcyk7XHJcblxyXG4gICAgICAgICAgLy8gUmVzZXQgdGhlIHN0eWxlc1xyXG4gICAgICAgICAgYW5pbWF0ZWRJdGVtcy5mb3JFYWNoKGRvbUl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBkb21JdGVtLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IGRvbUl0ZW0uc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgwcHgsIDBweCknO1xyXG4gICAgICAgICAgICBkb21JdGVtLnNldEF0dHJpYnV0ZSgnZHJhZy14JywgMCk7XHJcbiAgICAgICAgICAgIGRvbUl0ZW0uc2V0QXR0cmlidXRlKCdkcmFnLXknLCAwKTtcclxuICAgICAgICAgICAgZG9tSXRlbS5zdHlsZVsnei1pbmRleCddID0gMztcclxuICAgICAgICAgICAgZG9tSXRlbS5zdHlsZVsndG9wJ10gPSBpbnRUb1BpeChcclxuICAgICAgICAgICAgICB0aGlzLnByb3BzLml0ZW1IZWlnaHQgKiBNYXRoLnJvdW5kKHBpeFRvSW50KGRvbUl0ZW0uc3R5bGVbJ3RvcCddKSAvIHRoaXMucHJvcHMuaXRlbUhlaWdodClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgZG9tSXRlbS5yZW1vdmVBdHRyaWJ1dGUoJ2lzRHJhZ2dpbmcnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRoaXMuX2dyaWQucmVjb21wdXRlR3JpZFNpemUoe3Jvd0luZGV4OiAwfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoY2FuUmVzaXplKSB7XHJcbiAgICAgIHRoaXMuX2l0ZW1JbnRlcmFjdGFibGVcclxuICAgICAgICAucmVzaXphYmxlKHtcclxuICAgICAgICAgIGFsbG93RnJvbTogc2VsZWN0ZWRJdGVtU2VsZWN0b3IsXHJcbiAgICAgICAgICBlZGdlczoge2xlZnQ6IHRydWUsIHJpZ2h0OiB0cnVlLCBib3R0b206IGZhbHNlLCB0b3A6IGZhbHNlfSxcclxuICAgICAgICAgIC4uLnRoaXMucHJvcHMuaW50ZXJhY3RPcHRpb25zLmRyYWdnYWJsZSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vbigncmVzaXplc3RhcnQnLCBlID0+IHtcclxuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5wcm9wcy5vbkludGVyYWN0aW9uKFRpbWVsaW5lLmNoYW5nZVR5cGVzLnJlc2l6ZVN0YXJ0LCBudWxsLCB0aGlzLnByb3BzLnNlbGVjdGVkSXRlbXMpO1xyXG4gICAgICAgICAgXy5mb3JFYWNoKHNlbGVjdGVkLCBpZCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBkb21JdGVtID0gdGhpcy5fZ3JpZERvbU5vZGUucXVlcnlTZWxlY3RvcihcInNwYW5bZGF0YS1pdGVtLWluZGV4PSdcIiArIGlkICsgXCInXCIpO1xyXG4gICAgICAgICAgICBpZiAoZG9tSXRlbSkge1xyXG4gICAgICAgICAgICAgIGRvbUl0ZW0uc2V0QXR0cmlidXRlKCdpc1Jlc2l6aW5nJywgJ1RydWUnKTtcclxuICAgICAgICAgICAgICBkb21JdGVtLnNldEF0dHJpYnV0ZSgnaW5pdGlhbFdpZHRoJywgcGl4VG9JbnQoZG9tSXRlbS5zdHlsZS53aWR0aCkpO1xyXG4gICAgICAgICAgICAgIGRvbUl0ZW0uc3R5bGVbJ3otaW5kZXgnXSA9IDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKCdyZXNpemVtb3ZlJywgZSA9PiB7XHJcbiAgICAgICAgICBsZXQgYW5pbWF0ZWRJdGVtcyA9IHRoaXMuX2dyaWREb21Ob2RlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuW2lzUmVzaXppbmc9J1RydWUnXCIpIHx8IFtdO1xyXG5cclxuICAgICAgICAgIGxldCBkeCA9IHBhcnNlRmxvYXQoZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkZWx0YS14JykpIHx8IDA7XHJcbiAgICAgICAgICBkeCArPSBlLmRlbHRhUmVjdC5sZWZ0O1xyXG5cclxuICAgICAgICAgIGxldCBkdyA9IGUucmVjdC53aWR0aCAtIE51bWJlcihlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2luaXRpYWxXaWR0aCcpKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBtaW5pbXVtV2lkdGggPVxyXG4gICAgICAgICAgICBwaXhlbHNQZXJNaW51dGUodGhpcy5wcm9wcy5zdGFydERhdGUsIHRoaXMucHJvcHMuZW5kRGF0ZSwgdGhpcy5nZXRUaW1lbGluZVdpZHRoKCkpICogdGhpcy5wcm9wcy5zbmFwTWludXRlcztcclxuXHJcbiAgICAgICAgICBjb25zdCBzbmFwcGVkRHggPSBnZXRTbmFwUGl4ZWxGcm9tRGVsdGEoXHJcbiAgICAgICAgICAgIGR4LFxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLnN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5lbmREYXRlLFxyXG4gICAgICAgICAgICB0aGlzLmdldFRpbWVsaW5lV2lkdGgoKSxcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5zbmFwTWludXRlc1xyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBzbmFwcGVkRHcgPSBnZXRTbmFwUGl4ZWxGcm9tRGVsdGEoXHJcbiAgICAgICAgICAgIGR3LFxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLnN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5lbmREYXRlLFxyXG4gICAgICAgICAgICB0aGlzLmdldFRpbWVsaW5lV2lkdGgoKSxcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5zbmFwTWludXRlc1xyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBfLmZvckVhY2goYW5pbWF0ZWRJdGVtcywgaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uc3R5bGUud2lkdGggPSBpbnRUb1BpeChOdW1iZXIoaXRlbS5nZXRBdHRyaWJ1dGUoJ2luaXRpYWxXaWR0aCcpKSArIHNuYXBwZWREdyArIG1pbmltdW1XaWR0aCk7XHJcbiAgICAgICAgICAgIGl0ZW0uc3R5bGUud2Via2l0VHJhbnNmb3JtID0gaXRlbS5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKCcgKyBzbmFwcGVkRHggKyAncHgsIDBweCknO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBlLnRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RlbHRhLXgnLCBkeCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub24oJ3Jlc2l6ZWVuZCcsIGUgPT4ge1xyXG4gICAgICAgICAgbGV0IGFuaW1hdGVkSXRlbXMgPSB0aGlzLl9ncmlkRG9tTm9kZS5xdWVyeVNlbGVjdG9yQWxsKFwic3Bhbltpc1Jlc2l6aW5nPSdUcnVlJ1wiKSB8fCBbXTtcclxuICAgICAgICAgIC8vIFVwZGF0ZSB0aW1lXHJcbiAgICAgICAgICBjb25zdCBkeCA9IHBhcnNlRmxvYXQoZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkZWx0YS14JykpIHx8IDA7XHJcbiAgICAgICAgICBjb25zdCBpc1N0YXJ0VGltZUNoYW5nZSA9IGR4ICE9IDA7XHJcblxyXG4gICAgICAgICAgbGV0IGl0ZW1zID0gW107XHJcbiAgICAgICAgICBsZXQgbWluUm93Tm8gPSBJbmZpbml0eTtcclxuXHJcbiAgICAgICAgICBsZXQgZHVyYXRpb25DaGFuZ2UgPSBudWxsO1xyXG4gICAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZWZhdWx0IGl0ZW0gcG9zaXRpb25zXHJcbiAgICAgICAgICBfLmZvckVhY2goYW5pbWF0ZWRJdGVtcywgZG9tSXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzdGFydFBpeGVsT2Zmc2V0ID0gcGl4VG9JbnQoZG9tSXRlbS5zdHlsZS5sZWZ0KSArIGR4O1xyXG4gICAgICAgICAgICBjb25zdCB7aXRlbSwgcm93Tm99ID0gdGhpcy5pdGVtRnJvbUVsZW1lbnQoZG9tSXRlbSk7XHJcblxyXG4gICAgICAgICAgICBtaW5Sb3dObyA9IE1hdGgubWluKG1pblJvd05vLCByb3dObyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNTdGFydFRpbWVDaGFuZ2UpIHtcclxuICAgICAgICAgICAgICBsZXQgbmV3U3RhcnQgPSBnZXRUaW1lQXRQaXhlbChcclxuICAgICAgICAgICAgICAgIHN0YXJ0UGl4ZWxPZmZzZXQsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZW5kRGF0ZSxcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0VGltZWxpbmVXaWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5zbmFwTWludXRlc1xyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgaWYgKGR1cmF0aW9uQ2hhbmdlID09PSBudWxsKSBkdXJhdGlvbkNoYW5nZSA9IGl0ZW0uc3RhcnQuZGlmZihuZXdTdGFydCwgJ21pbnV0ZXMnKTtcclxuICAgICAgICAgICAgICBpdGVtLnN0YXJ0ID0gbmV3U3RhcnQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGV0IGVuZFBpeGVsT2Zmc2V0ID0gc3RhcnRQaXhlbE9mZnNldCArIHBpeFRvSW50KGRvbUl0ZW0uc3R5bGUud2lkdGgpO1xyXG4gICAgICAgICAgICAgIGxldCBuZXdFbmQgPSBnZXRUaW1lQXRQaXhlbChcclxuICAgICAgICAgICAgICAgIGVuZFBpeGVsT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5zdGFydERhdGUsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmVuZERhdGUsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldFRpbWVsaW5lV2lkdGgoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuc25hcE1pbnV0ZXNcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIGlmIChkdXJhdGlvbkNoYW5nZSA9PT0gbnVsbCkgZHVyYXRpb25DaGFuZ2UgPSBpdGVtLmVuZC5kaWZmKG5ld0VuZCwgJ21pbnV0ZXMnKTtcclxuXHJcbiAgICAgICAgICAgICAgaXRlbS5lbmQgPSBuZXdFbmQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHJvdyBoZWlnaHQgZG9lc24ndCBuZWVkIGNoYW5naW5nXHJcbiAgICAgICAgICAgIGxldCBuZXdfcm93X2hlaWdodCA9IGdldE1heE92ZXJsYXBwaW5nSXRlbXMoXHJcbiAgICAgICAgICAgICAgdGhpcy5yb3dJdGVtTWFwW3Jvd05vXSxcclxuICAgICAgICAgICAgICB0aGlzLnByb3BzLnN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICB0aGlzLnByb3BzLmVuZERhdGVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKG5ld19yb3dfaGVpZ2h0ICE9PSB0aGlzLnJvd0hlaWdodENhY2hlW3Jvd05vXSkge1xyXG4gICAgICAgICAgICAgIHRoaXMucm93SGVpZ2h0Q2FjaGVbcm93Tm9dID0gbmV3X3Jvd19oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vUmVzZXQgc3R5bGVzXHJcbiAgICAgICAgICAgIGRvbUl0ZW0ucmVtb3ZlQXR0cmlidXRlKCdpc1Jlc2l6aW5nJyk7XHJcbiAgICAgICAgICAgIGRvbUl0ZW0ucmVtb3ZlQXR0cmlidXRlKCdpbml0aWFsV2lkdGgnKTtcclxuICAgICAgICAgICAgZG9tSXRlbS5zdHlsZVsnei1pbmRleCddID0gMztcclxuICAgICAgICAgICAgZG9tSXRlbS5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBkb21JdGVtLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoMHB4LCAwcHgpJztcclxuXHJcbiAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGlmIChkdXJhdGlvbkNoYW5nZSA9PT0gbnVsbCkgZHVyYXRpb25DaGFuZ2UgPSAwO1xyXG4gICAgICAgICAgY29uc3QgY2hhbmdlcyA9IHtpc1N0YXJ0VGltZUNoYW5nZSwgdGltZURlbHRhOiAtZHVyYXRpb25DaGFuZ2V9O1xyXG5cclxuICAgICAgICAgIHRoaXMucHJvcHMub25JbnRlcmFjdGlvbihUaW1lbGluZS5jaGFuZ2VUeXBlcy5yZXNpemVFbmQsIGNoYW5nZXMsIGl0ZW1zKTtcclxuXHJcbiAgICAgICAgICBlLnRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RlbHRhLXgnLCAwKTtcclxuICAgICAgICAgIHRoaXMuX2dyaWQucmVjb21wdXRlR3JpZFNpemUoe3Jvd0luZGV4OiBtaW5Sb3dOb30pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjYW5TZWxlY3QpIHtcclxuICAgICAgdGhpcy5fc2VsZWN0UmVjdGFuZ2xlSW50ZXJhY3RhYmxlXHJcbiAgICAgICAgLmRyYWdnYWJsZSh7XHJcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgaWdub3JlRnJvbTogJy5pdGVtX2RyYWdnYWJsZSwgLnJjdDlrLWdyb3VwJyxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zdHlsZUN1cnNvcihmYWxzZSlcclxuICAgICAgICAub24oJ2RyYWdzdGFydCcsIGUgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbmVhcmVzdFJvd09iamVjdCA9IGdldE5lYXJlc3RSb3dPYmplY3QoZS5jbGllbnRYLCBlLmNsaWVudFkpO1xyXG5cclxuICAgICAgICAgIC8vIHRoaXMuX3NlbGVjdEJveC5zdGFydChlLmNsaWVudFgsIGUuY2xpZW50WSk7XHJcbiAgICAgICAgICAvLyB0aGlzLl9zZWxlY3RCb3guc3RhcnQoZS5jbGllbnRYLCB0b3BSb3dPYmouc3R5bGUudG9wKTtcclxuICAgICAgICAgIHRoaXMuX3NlbGVjdEJveC5zdGFydChlLmNsaWVudFgsIG5lYXJlc3RSb3dPYmplY3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueSk7XHJcbiAgICAgICAgICAvLyBjb25zdCBib3R0b21Sb3cgPSBOdW1iZXIoZ2V0TmVhcmVzdFJvd051bWJlcihsZWZ0ICsgd2lkdGgsIHRvcCArIGhlaWdodCkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKCdkcmFnbW92ZScsIGUgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbWFnaWNhbENvbnN0YW50ID0gMjtcclxuICAgICAgICAgIC8vIEBiZW5kb2c6IEkgYWRkZWQgdGhpcyBtYWdpY2FsIGNvbnN0YW50IHRvIHNvbHZlIHRoZSBpc3N1ZSBvZiBzZWxlY3Rpb24gYmxlZWQsXHJcbiAgICAgICAgICAvLyBJIGRvbid0IHVuZGVyc3RhbmQgd2h5IGl0IHdvcmtzLCBidXQgaWYgZnJlcXVlbnRpc3Qgc3RhdGlzdGljaWFucyBjYW4gdXNlIGltYWdpbmFyeSBudW1iZXJzLCBzbyBjYW4gaS5cclxuICAgICAgICAgIGNvbnN0IHtzdGFydFgsIHN0YXJ0WX0gPSB0aGlzLl9zZWxlY3RCb3g7XHJcbiAgICAgICAgICBjb25zdCBzdGFydFJvd09iamVjdCA9IGdldE5lYXJlc3RSb3dPYmplY3Qoc3RhcnRYLCBzdGFydFkpO1xyXG4gICAgICAgICAgY29uc3Qge2NsaWVudFgsIGNsaWVudFl9ID0gZTtcclxuICAgICAgICAgIGNvbnN0IGN1cnJlbnRSb3dPYmplY3QgPSBnZXROZWFyZXN0Um93T2JqZWN0KGNsaWVudFgsIGNsaWVudFkpO1xyXG4gICAgICAgICAgaWYgKGN1cnJlbnRSb3dPYmplY3QgIT09IHVuZGVmaW5lZCAmJiBzdGFydFJvd09iamVjdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIG9ubHkgcnVuIGlmIHlvdSBjYW4gZGV0ZWN0IHRoZSB0b3Agcm93XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0Um93TnVtYmVyID0gZ2V0Um93T2JqZWN0Um93TnVtYmVyKHN0YXJ0Um93T2JqZWN0KTtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFJvd051bWJlciA9IGdldFJvd09iamVjdFJvd051bWJlcihjdXJyZW50Um93T2JqZWN0KTtcclxuICAgICAgICAgICAgLy8gY29uc3QgbnVtUm93cyA9IDEgKyBNYXRoLmFicyhzdGFydFJvd051bWJlciAtIGN1cnJlbnRSb3dOdW1iZXIpO1xyXG4gICAgICAgICAgICBjb25zdCByb3dNYXJnaW5Cb3JkZXIgPSBnZXRWZXJ0aWNhbE1hcmdpbkJvcmRlcihjdXJyZW50Um93T2JqZWN0KTtcclxuICAgICAgICAgICAgaWYgKHN0YXJ0Um93TnVtYmVyIDw9IGN1cnJlbnRSb3dOdW1iZXIpIHtcclxuICAgICAgICAgICAgICAvLyBzZWxlY3QgYm94IGZvciBzZWxlY3Rpb24gZ29pbmcgZG93blxyXG4gICAgICAgICAgICAgIC8vIGdldCB0aGUgZmlyc3Qgc2VsZWN0ZWQgcm93cyB0b3BcclxuICAgICAgICAgICAgICBjb25zdCBzdGFydFRvcCA9IE1hdGguY2VpbChzdGFydFJvd09iamVjdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyByb3dNYXJnaW5Cb3JkZXIpO1xyXG4gICAgICAgICAgICAgIC8vIGdldCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHJvd3MgYm90dG9tXHJcbiAgICAgICAgICAgICAgY29uc3QgY3VycmVudEJvdHRvbSA9IE1hdGguZmxvb3IoZ2V0VHJ1ZUJvdHRvbShjdXJyZW50Um93T2JqZWN0KSAtIG1hZ2ljYWxDb25zdGFudCAtIHJvd01hcmdpbkJvcmRlcik7XHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0Qm94LnN0YXJ0KHN0YXJ0WCwgc3RhcnRUb3ApO1xyXG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdEJveC5tb3ZlKGNsaWVudFgsIGN1cnJlbnRCb3R0b20pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vIHNlbGVjdCBib3ggZm9yIHNlbGVjdGlvbiBnb2luZyB1cFxyXG4gICAgICAgICAgICAgIC8vIGdldCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHJvd3MgdG9wXHJcbiAgICAgICAgICAgICAgY29uc3QgY3VycmVudFRvcCA9IE1hdGguY2VpbChjdXJyZW50Um93T2JqZWN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHJvd01hcmdpbkJvcmRlcik7XHJcbiAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBmaXJzdCBzZWxlY3RlZCByb3dzIGJvdHRvbVxyXG4gICAgICAgICAgICAgIGNvbnN0IHN0YXJ0Qm90dG9tID0gTWF0aC5mbG9vcihnZXRUcnVlQm90dG9tKHN0YXJ0Um93T2JqZWN0KSAtIG1hZ2ljYWxDb25zdGFudCAtIHJvd01hcmdpbkJvcmRlciAqIDIpO1xyXG4gICAgICAgICAgICAgIC8vIHRoZSBib3R0b20gd2lsbCBibGVlZCBzb3V0aCB1bmxlc3MgeW91IGNvdW50ZXIgdGhlIG1hcmdpbnMgYW5kIGJvcmVkZXJzIGZyb20gdGhlIGFib3ZlIHJvd3NcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RCb3guc3RhcnQoc3RhcnRYLCBzdGFydEJvdHRvbSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0Qm94Lm1vdmUoY2xpZW50WCwgY3VycmVudFRvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vbignZHJhZ2VuZCcsIGUgPT4ge1xyXG4gICAgICAgICAgbGV0IHt0b3AsIGxlZnQsIHdpZHRoLCBoZWlnaHR9ID0gdGhpcy5fc2VsZWN0Qm94LmVuZCgpO1xyXG4gICAgICAgICAgLy9HZXQgdGhlIHN0YXJ0IGFuZCBlbmQgcm93IG9mIHRoZSBzZWxlY3Rpb24gcmVjdGFuZ2xlXHJcbiAgICAgICAgICBjb25zdCB0b3BSb3dPYmplY3QgPSBnZXROZWFyZXN0Um93T2JqZWN0KGxlZnQsIHRvcCk7XHJcbiAgICAgICAgICBpZiAodG9wUm93T2JqZWN0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gb25seSBjb25maXJtIHRoZSBlbmQgb2YgYSBkcmFnIGlmIHRoZSBzZWxlY3Rpb24gYm94IGlzIHZhbGlkXHJcbiAgICAgICAgICAgIGNvbnN0IHRvcFJvd051bWJlciA9IE51bWJlcihnZXROZWFyZXN0Um93TnVtYmVyKGxlZnQsIHRvcCkpO1xyXG4gICAgICAgICAgICBjb25zdCB0b3BSb3dMb2MgPSB0b3BSb3dPYmplY3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvd01hcmdpbkJvcmRlciA9IGdldFZlcnRpY2FsTWFyZ2luQm9yZGVyKHRvcFJvd09iamVjdCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdHRvbVJvdyA9IE51bWJlcihcclxuICAgICAgICAgICAgICBnZXROZWFyZXN0Um93TnVtYmVyKFxyXG4gICAgICAgICAgICAgICAgbGVmdCArIHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcih0b3BSb3dMb2MudG9wIC0gcm93TWFyZ2luQm9yZGVyKSArIE1hdGguZmxvb3IoaGVpZ2h0IC0gcm93TWFyZ2luQm9yZGVyKVxyXG4gICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgLy9HZXQgdGhlIHN0YXJ0IGFuZCBlbmQgdGltZSBvZiB0aGUgc2VsZWN0aW9uIHJlY3RhbmdsZVxyXG4gICAgICAgICAgICBsZWZ0ID0gbGVmdCAtIHRvcFJvd0xvYy5sZWZ0O1xyXG4gICAgICAgICAgICBsZXQgc3RhcnRPZmZzZXQgPSB3aWR0aCA+IDAgPyBsZWZ0IDogbGVmdCArIHdpZHRoO1xyXG4gICAgICAgICAgICBsZXQgZW5kT2Zmc2V0ID0gd2lkdGggPiAwID8gbGVmdCArIHdpZHRoIDogbGVmdDtcclxuICAgICAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gZ2V0VGltZUF0UGl4ZWwoXHJcbiAgICAgICAgICAgICAgc3RhcnRPZmZzZXQsXHJcbiAgICAgICAgICAgICAgdGhpcy5wcm9wcy5zdGFydERhdGUsXHJcbiAgICAgICAgICAgICAgdGhpcy5wcm9wcy5lbmREYXRlLFxyXG4gICAgICAgICAgICAgIHRoaXMuZ2V0VGltZWxpbmVXaWR0aCgpLFxyXG4gICAgICAgICAgICAgIHRoaXMucHJvcHMuc25hcE1pbnV0ZXNcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29uc3QgZW5kVGltZSA9IGdldFRpbWVBdFBpeGVsKFxyXG4gICAgICAgICAgICAgIGVuZE9mZnNldCxcclxuICAgICAgICAgICAgICB0aGlzLnByb3BzLnN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICB0aGlzLnByb3BzLmVuZERhdGUsXHJcbiAgICAgICAgICAgICAgdGhpcy5nZXRUaW1lbGluZVdpZHRoKCksXHJcbiAgICAgICAgICAgICAgdGhpcy5wcm9wcy5zbmFwTWludXRlc1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAvL0dldCBpdGVtcyBpbiB0aGVzZSByYW5nZXNcclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IE1hdGgubWluKHRvcFJvd051bWJlciwgYm90dG9tUm93KTsgciA8PSBNYXRoLm1heCh0b3BSb3dOdW1iZXIsIGJvdHRvbVJvdyk7IHIrKykge1xyXG4gICAgICAgICAgICAgIHNlbGVjdGVkSXRlbXMucHVzaChcclxuICAgICAgICAgICAgICAgIC4uLl8uZmlsdGVyKHRoaXMucm93SXRlbU1hcFtyXSwgaSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBpLnN0YXJ0LmlzQmVmb3JlKGVuZFRpbWUpICYmIGkuZW5kLmlzQWZ0ZXIoc3RhcnRUaW1lKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uSW50ZXJhY3Rpb24oVGltZWxpbmUuY2hhbmdlVHlwZXMuaXRlbXNTZWxlY3RlZCwgc2VsZWN0ZWRJdGVtcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfaGFuZGxlSXRlbVJvd0V2ZW50ID0gKGUsIGl0ZW1DYWxsYmFjaywgcm93Q2FsbGJhY2spID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIC8vIFNraXAgY2xpY2sgaGFuZGxlciBpZiBzZWxlY3Rpbmcgd2l0aCBzZWxlY3Rpb24gYm94XHJcbiAgICBpZiAodGhpcy5zZWxlY3RpbmcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKGUudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1pdGVtLWluZGV4JykgfHwgZS50YXJnZXQucGFyZW50RWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2RhdGEtaXRlbS1pbmRleCcpKSB7XHJcbiAgICAgIGxldCBpdGVtS2V5ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWl0ZW0taW5kZXgnKSB8fCBlLnRhcmdldC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1pdGVtLWluZGV4Jyk7XHJcbiAgICAgIGl0ZW1DYWxsYmFjayAmJiBpdGVtQ2FsbGJhY2soZSwgTnVtYmVyKGl0ZW1LZXkpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCByb3cgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcm93LWluZGV4Jyk7XHJcbiAgICAgIGxldCBjbGlja2VkVGltZSA9IGdldFRpbWVBdFBpeGVsKFxyXG4gICAgICAgIGUuY2xpZW50WCAtIHRoaXMucHJvcHMuZ3JvdXBPZmZzZXQsXHJcbiAgICAgICAgdGhpcy5wcm9wcy5zdGFydERhdGUsXHJcbiAgICAgICAgdGhpcy5wcm9wcy5lbmREYXRlLFxyXG4gICAgICAgIHRoaXMuZ2V0VGltZWxpbmVXaWR0aCgpXHJcbiAgICAgICk7XHJcblxyXG4gICAgICAvL2NvbnN0IHJvdW5kZWRTdGFydE1pbnV0ZXMgPSBNYXRoLnJvdW5kKGNsaWNrZWRUaW1lLm1pbnV0ZSgpIC8gdGhpcy5wcm9wcy5zbmFwTWludXRlcykgKiB0aGlzLnByb3BzLnNuYXBNaW51dGVzOyAvLyBJIGRvbnQga25vdyB3aGF0IHRoaXMgZG9lc1xyXG4gICAgICBsZXQgc25hcHBlZENsaWNrZWRUaW1lID0gdGltZVNuYXAoY2xpY2tlZFRpbWUsIHRoaXMucHJvcHMuc25hcE1pbnV0ZXMgKiA2MCk7XHJcbiAgICAgIHJvd0NhbGxiYWNrICYmIHJvd0NhbGxiYWNrKGUsIHJvdywgY2xpY2tlZFRpbWUsIHNuYXBwZWRDbGlja2VkVGltZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIGNvbnRhaW5lciB3aWR0aCAoaW4gcHgpXHJcbiAgICovXHJcbiAgY2VsbFJlbmRlcmVyKHdpZHRoKSB7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSAge30gY29sdW1uSW5kZXggQWx3YXlzIDFcclxuICAgICAqIEBwYXJhbSAge30ga2V5IFVuaXF1ZSBrZXkgd2l0aGluIGFycmF5IG9mIGNlbGxzXHJcbiAgICAgKiBAcGFyYW0gIHt9IHBhcmVudCBSZWZlcmVuY2UgdG8gdGhlIHBhcmVudCBHcmlkIChpbnN0YW5jZSlcclxuICAgICAqIEBwYXJhbSAge30gcm93SW5kZXggVmVydGljYWwgKHJvdykgaW5kZXggb2YgY2VsbFxyXG4gICAgICogQHBhcmFtICB7fSBzdHlsZSBTdHlsZSBvYmplY3QgdG8gYmUgYXBwbGllZCB0byBjZWxsICh0byBwb3NpdGlvbiBpdCk7XHJcbiAgICAgKi9cclxuICAgIGNvbnN0IHt0aW1lbGluZU1vZGUsIG9uSXRlbUhvdmVyLCBvbkl0ZW1MZWF2ZSwgcm93TGF5ZXJzfSA9IHRoaXMucHJvcHM7XHJcbiAgICBjb25zdCBjYW5TZWxlY3QgPSBUaW1lbGluZS5pc0JpdFNldChUaW1lbGluZS5USU1FTElORV9NT0RFUy5TRUxFQ1QsIHRpbWVsaW5lTW9kZSk7XHJcbiAgICByZXR1cm4gKHtjb2x1bW5JbmRleCwga2V5LCBwYXJlbnQsIHJvd0luZGV4LCBzdHlsZX0pID0+IHtcclxuICAgICAgbGV0IGl0ZW1Db2wgPSAxO1xyXG4gICAgICBpZiAoaXRlbUNvbCA9PSBjb2x1bW5JbmRleCkge1xyXG4gICAgICAgIGxldCBpdGVtc0luUm93ID0gdGhpcy5yb3dJdGVtTWFwW3Jvd0luZGV4XTtcclxuICAgICAgICBjb25zdCBsYXllcnNJblJvdyA9IHJvd0xheWVycy5maWx0ZXIociA9PiByLnJvd051bWJlciA9PT0gcm93SW5kZXgpO1xyXG4gICAgICAgIGxldCByb3dIZWlnaHQgPSB0aGlzLnByb3BzLml0ZW1IZWlnaHQ7XHJcbiAgICAgICAgaWYgKHRoaXMucm93SGVpZ2h0Q2FjaGVbcm93SW5kZXhdKSB7XHJcbiAgICAgICAgICByb3dIZWlnaHQgPSByb3dIZWlnaHQgKiB0aGlzLnJvd0hlaWdodENhY2hlW3Jvd0luZGV4XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAga2V5PXtrZXl9XHJcbiAgICAgICAgICAgIHN0eWxlPXtzdHlsZX1cclxuICAgICAgICAgICAgZGF0YS1yb3ctaW5kZXg9e3Jvd0luZGV4fVxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJyY3Q5ay1yb3dcIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtlID0+IHRoaXMuX2hhbmRsZUl0ZW1Sb3dFdmVudChlLCBUaW1lbGluZS5ub19vcCwgdGhpcy5wcm9wcy5vblJvd0NsaWNrKX1cclxuICAgICAgICAgICAgb25Nb3VzZURvd249e2UgPT4gKHRoaXMuc2VsZWN0aW5nID0gZmFsc2UpfVxyXG4gICAgICAgICAgICBvbk1vdXNlTW92ZT17ZSA9PiAodGhpcy5zZWxlY3RpbmcgPSB0cnVlKX1cclxuICAgICAgICAgICAgb25Nb3VzZU92ZXI9e2UgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZUl0ZW1Sb3dFdmVudChlLCBvbkl0ZW1Ib3ZlciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlSXRlbVJvd0V2ZW50KGUsIG9uSXRlbUxlYXZlLCBudWxsKTtcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgb25Db250ZXh0TWVudT17ZSA9PlxyXG4gICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUl0ZW1Sb3dFdmVudChlLCB0aGlzLnByb3BzLm9uSXRlbUNvbnRleHRDbGljaywgdGhpcy5wcm9wcy5vblJvd0NvbnRleHRDbGljaylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvbkRvdWJsZUNsaWNrPXtlID0+IHRoaXMuX2hhbmRsZUl0ZW1Sb3dFdmVudChlLCB0aGlzLnByb3BzLm9uSXRlbURvdWJsZUNsaWNrLCB0aGlzLnByb3BzLm9uUm93RG91YmxlQ2xpY2spfT5cclxuICAgICAgICAgICAge3Jvd0l0ZW1zUmVuZGVyZXIoXHJcbiAgICAgICAgICAgICAgaXRlbXNJblJvdyxcclxuICAgICAgICAgICAgICB0aGlzLnByb3BzLnN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICB0aGlzLnByb3BzLmVuZERhdGUsXHJcbiAgICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgICAgdGhpcy5wcm9wcy5pdGVtSGVpZ2h0LFxyXG4gICAgICAgICAgICAgIHRoaXMucHJvcHMuaXRlbVJlbmRlcmVyLFxyXG4gICAgICAgICAgICAgIGNhblNlbGVjdCA/IHRoaXMucHJvcHMuc2VsZWN0ZWRJdGVtcyA6IFtdXHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIHtyb3dMYXllclJlbmRlcmVyKGxheWVyc0luUm93LCB0aGlzLnByb3BzLnN0YXJ0RGF0ZSwgdGhpcy5wcm9wcy5lbmREYXRlLCB3aWR0aCwgcm93SGVpZ2h0KX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgR3JvdXBDb21wID0gdGhpcy5wcm9wcy5ncm91cFJlbmRlcmVyO1xyXG4gICAgICAgIGxldCBncm91cCA9IF8uZmluZCh0aGlzLnByb3BzLmdyb3VwcywgZyA9PiBnLmlkID09IHJvd0luZGV4KTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPGRpdiBkYXRhLXJvdy1pbmRleD17cm93SW5kZXh9IGtleT17a2V5fSBzdHlsZT17c3R5bGV9IGNsYXNzTmFtZT1cInJjdDlrLWdyb3VwXCI+XHJcbiAgICAgICAgICAgIDxHcm91cENvbXAgZ3JvdXA9e2dyb3VwfSAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldEN1cnNvcigpIHtcclxuICAgIGNvbnN0IHtzaG93Q3Vyc29yVGltZSwgY3Vyc29yVGltZUZvcm1hdH0gPSB0aGlzLnByb3BzO1xyXG4gICAgY29uc3Qge2N1cnNvclRpbWV9ID0gdGhpcy5zdGF0ZTtcclxuICAgIHJldHVybiBzaG93Q3Vyc29yVGltZSAmJiBjdXJzb3JUaW1lID8gY3Vyc29yVGltZS5jbG9uZSgpLmZvcm1hdChjdXJzb3JUaW1lRm9ybWF0KSA6IG51bGw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIZWxwZXIgZm9yIHJlYWN0IHZpcnR1YWl6ZWQgdG8gZ2V0IHRoZSByb3cgaGVpZ2h0IGdpdmVuIGEgcm93IGluZGV4XHJcbiAgICovXHJcbiAgcm93SGVpZ2h0KHtpbmRleH0pIHtcclxuICAgIGxldCByaCA9IHRoaXMucm93SGVpZ2h0Q2FjaGVbaW5kZXhdID8gdGhpcy5yb3dIZWlnaHRDYWNoZVtpbmRleF0gOiAxO1xyXG4gICAgcmV0dXJuIHJoICogdGhpcy5wcm9wcy5pdGVtSGVpZ2h0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoZSBncmlkIHJlZi5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVhY3RDb21wb25lbnQgR3JpZCByZWFjdCBlbGVtZW50XHJcbiAgICovXHJcbiAgZ3JpZF9yZWZfY2FsbGJhY2socmVhY3RDb21wb25lbnQpIHtcclxuICAgIHRoaXMuX2dyaWQgPSByZWFjdENvbXBvbmVudDtcclxuICAgIHRoaXMuX2dyaWREb21Ob2RlID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5fZ3JpZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIHNlbGVjdCBib3ggcmVmLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZWFjdENvbXBvbmVudCBTZWxlY3Rib3ggcmVhY3QgZWxlbWVudFxyXG4gICAqL1xyXG4gIHNlbGVjdF9yZWZfY2FsbGJhY2socmVhY3RDb21wb25lbnQpIHtcclxuICAgIHRoaXMuX3NlbGVjdEJveCA9IHJlYWN0Q29tcG9uZW50O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXZlbnQgaGFuZGxlciBmb3Igb25Nb3VzZU1vdmUuXHJcbiAgICogT25seSBjYWxscyBiYWNrIGlmIGEgbmV3IHNuYXAgdGltZSBpcyByZWFjaGVkXHJcbiAgICovXHJcbiAgdGhyb3R0bGVkTW91c2VNb3ZlRnVuYyhlKSB7XHJcbiAgICBjb25zdCB7Y29tcG9uZW50SWR9ID0gdGhpcy5wcm9wcztcclxuICAgIGNvbnN0IGxlZnRPZmZzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucmN0OWstaWQtJHtjb21wb25lbnRJZH0gLnBhcmVudC1kaXZgKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xyXG4gICAgY29uc3QgY3Vyc29yU25hcHBlZFRpbWUgPSBnZXRUaW1lQXRQaXhlbChcclxuICAgICAgZS5jbGllbnRYIC0gdGhpcy5wcm9wcy5ncm91cE9mZnNldCAtIGxlZnRPZmZzZXQsXHJcbiAgICAgIHRoaXMucHJvcHMuc3RhcnREYXRlLFxyXG4gICAgICB0aGlzLnByb3BzLmVuZERhdGUsXHJcbiAgICAgIHRoaXMuZ2V0VGltZWxpbmVXaWR0aCgpLFxyXG4gICAgICB0aGlzLnByb3BzLnNuYXBNaW51dGVzXHJcbiAgICApO1xyXG4gICAgaWYgKCF0aGlzLm1vdXNlX3NuYXBwZWRfdGltZSB8fCB0aGlzLm1vdXNlX3NuYXBwZWRfdGltZS51bml4KCkgIT09IGN1cnNvclNuYXBwZWRUaW1lLnVuaXgoKSkge1xyXG4gICAgICBpZiAoY3Vyc29yU25hcHBlZFRpbWUuaXNTYW1lT3JBZnRlcih0aGlzLnByb3BzLnN0YXJ0RGF0ZSkpIHtcclxuICAgICAgICB0aGlzLm1vdXNlX3NuYXBwZWRfdGltZSA9IGN1cnNvclNuYXBwZWRUaW1lO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2N1cnNvclRpbWU6IHRoaXMubW91c2Vfc25hcHBlZF90aW1lfSk7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkludGVyYWN0aW9uKFxyXG4gICAgICAgICAgVGltZWxpbmUuY2hhbmdlVHlwZXMuc25hcHBlZE1vdXNlTW92ZSxcclxuICAgICAgICAgIHtzbmFwcGVkVGltZTogdGhpcy5tb3VzZV9zbmFwcGVkX3RpbWUuY2xvbmUoKX0sXHJcbiAgICAgICAgICBudWxsXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbW91c2VNb3ZlRnVuYyhlKSB7XHJcbiAgICBlLnBlcnNpc3QoKTtcclxuICAgIHRoaXMudGhyb3R0bGVkTW91c2VNb3ZlRnVuYyhlKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgb25JbnRlcmFjdGlvbixcclxuICAgICAgZ3JvdXBPZmZzZXQsXHJcbiAgICAgIHNob3dDdXJzb3JUaW1lLFxyXG4gICAgICB0aW1lYmFyRm9ybWF0LFxyXG4gICAgICBjb21wb25lbnRJZCxcclxuICAgICAgZ3JvdXBUaXRsZVJlbmRlcmVyLFxyXG4gICAgICBzaGFsbG93VXBkYXRlQ2hlY2ssXHJcbiAgICAgIGZvcmNlUmVkcmF3RnVuYyxcclxuICAgICAgc3RhcnREYXRlLFxyXG4gICAgICBlbmREYXRlLFxyXG4gICAgICBib3R0b21SZXNvbHV0aW9uLFxyXG4gICAgICB0b3BSZXNvbHV0aW9uLFxyXG4gICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgY29uc3QgZGl2Q3NzQ2xhc3MgPSBgcmN0OWstdGltZWxpbmUtZGl2IHJjdDlrLWlkLSR7Y29tcG9uZW50SWR9YDtcclxuICAgIGxldCB2YXJUaW1lYmFyUHJvcHMgPSB7fTtcclxuICAgIGlmICh0aW1lYmFyRm9ybWF0KSB2YXJUaW1lYmFyUHJvcHNbJ3RpbWVGb3JtYXRzJ10gPSB0aW1lYmFyRm9ybWF0O1xyXG4gICAgaWYgKGJvdHRvbVJlc29sdXRpb24pIHZhclRpbWViYXJQcm9wc1snYm90dG9tX3Jlc29sdXRpb24nXSA9IGJvdHRvbVJlc29sdXRpb247XHJcbiAgICBpZiAodG9wUmVzb2x1dGlvbikgdmFyVGltZWJhclByb3BzWyd0b3BfcmVzb2x1dGlvbiddID0gdG9wUmVzb2x1dGlvbjtcclxuXHJcbiAgICBmdW5jdGlvbiBjb2x1bW5XaWR0aCh3aWR0aCkge1xyXG4gICAgICByZXR1cm4gKHtpbmRleH0pID0+IHtcclxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHJldHVybiBncm91cE9mZnNldDtcclxuICAgICAgICByZXR1cm4gd2lkdGggLSBncm91cE9mZnNldDtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVIZWlnaHQoaGVpZ2h0KSB7XHJcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHdoZW4gdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgZm9yIHRoZSBmaXJzdCB0aW1lLCB0aGUgdGltZWJhciBpcyBub3QgeWV0IHJlbmRlcmVkXHJcbiAgICAgIGxldCB0aW1lYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnJjdDlrLWlkLSR7Y29tcG9uZW50SWR9IC5yY3Q5ay10aW1lYmFyYCk7XHJcbiAgICAgIGlmICghdGltZWJhcikge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHN1YnN0cmFjdCB0aW1lYmFyIGhlaWdodCBmcm9tIHRvdGFsIGhlaWdodFxyXG4gICAgICBjb25zdCB0aW1lYmFySGVpZ2h0ID0gdGltZWJhci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcbiAgICAgIHJldHVybiBNYXRoLm1heChoZWlnaHQgLSB0aW1lYmFySGVpZ2h0LCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNYXJrZXJzIChvbmx5IGN1cnJlbnQgdGltZSBtYXJrZXIgYXRtKVxyXG4gICAgY29uc3QgbWFya2VycyA9IFtdO1xyXG4gICAgaWYgKHNob3dDdXJzb3JUaW1lICYmIHRoaXMubW91c2Vfc25hcHBlZF90aW1lKSB7XHJcbiAgICAgIGNvbnN0IGN1cnNvclBpeCA9IGdldFBpeGVsQXRUaW1lKHRoaXMubW91c2Vfc25hcHBlZF90aW1lLCBzdGFydERhdGUsIGVuZERhdGUsIHRoaXMuZ2V0VGltZWxpbmVXaWR0aCgpKTtcclxuICAgICAgbWFya2Vycy5wdXNoKHtcclxuICAgICAgICBsZWZ0OiBjdXJzb3JQaXggKyB0aGlzLnByb3BzLmdyb3VwT2Zmc2V0LFxyXG4gICAgICAgIGtleTogMSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17ZGl2Q3NzQ2xhc3N9PlxyXG4gICAgICAgIDxBdXRvU2l6ZXIgY2xhc3NOYW1lPVwicmN0OWstYXV0b3NpemVyXCIgb25SZXNpemU9e3RoaXMucmVmcmVzaEdyaWR9PlxyXG4gICAgICAgICAgeyh7aGVpZ2h0LCB3aWR0aH0pID0+IChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXJlbnQtZGl2XCIgb25Nb3VzZU1vdmU9e3RoaXMubW91c2VNb3ZlRnVuY30+XHJcbiAgICAgICAgICAgICAgPFNlbGVjdEJveCByZWY9e3RoaXMuc2VsZWN0X3JlZl9jYWxsYmFja30gLz5cclxuICAgICAgICAgICAgICA8VGltZWJhclxyXG4gICAgICAgICAgICAgICAgY3Vyc29yVGltZT17dGhpcy5nZXRDdXJzb3IoKX1cclxuICAgICAgICAgICAgICAgIHN0YXJ0PXt0aGlzLnByb3BzLnN0YXJ0RGF0ZX1cclxuICAgICAgICAgICAgICAgIGVuZD17dGhpcy5wcm9wcy5lbmREYXRlfVxyXG4gICAgICAgICAgICAgICAgd2lkdGg9e3dpZHRofVxyXG4gICAgICAgICAgICAgICAgbGVmdE9mZnNldD17Z3JvdXBPZmZzZXR9XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFJhbmdlcz17dGhpcy5zdGF0ZS5zZWxlY3Rpb259XHJcbiAgICAgICAgICAgICAgICBncm91cFRpdGxlUmVuZGVyZXI9e2dyb3VwVGl0bGVSZW5kZXJlcn1cclxuICAgICAgICAgICAgICAgIHsuLi52YXJUaW1lYmFyUHJvcHN9XHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICB7bWFya2Vycy5tYXAobSA9PiAoXHJcbiAgICAgICAgICAgICAgICA8TWFya2VyIGtleT17bS5rZXl9IGhlaWdodD17aGVpZ2h0fSB0b3A9ezB9IGxlZnQ9e20ubGVmdH0gLz5cclxuICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICA8VGltZWxpbmVCb2R5XHJcbiAgICAgICAgICAgICAgICB3aWR0aD17d2lkdGh9XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5XaWR0aD17Y29sdW1uV2lkdGgod2lkdGgpfVxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0PXtjYWxjdWxhdGVIZWlnaHQoaGVpZ2h0KX1cclxuICAgICAgICAgICAgICAgIHJvd0hlaWdodD17dGhpcy5yb3dIZWlnaHR9XHJcbiAgICAgICAgICAgICAgICByb3dDb3VudD17dGhpcy5wcm9wcy5ncm91cHMubGVuZ3RofVxyXG4gICAgICAgICAgICAgICAgY2VsbFJlbmRlcmVyPXt0aGlzLmNlbGxSZW5kZXJlcih0aGlzLmdldFRpbWVsaW5lV2lkdGgod2lkdGgpKX1cclxuICAgICAgICAgICAgICAgIGdyaWRfcmVmX2NhbGxiYWNrPXt0aGlzLmdyaWRfcmVmX2NhbGxiYWNrfVxyXG4gICAgICAgICAgICAgICAgc2hhbGxvd1VwZGF0ZUNoZWNrPXtzaGFsbG93VXBkYXRlQ2hlY2t9XHJcbiAgICAgICAgICAgICAgICBmb3JjZVJlZHJhd0Z1bmM9e2ZvcmNlUmVkcmF3RnVuY31cclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPC9BdXRvU2l6ZXI+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19