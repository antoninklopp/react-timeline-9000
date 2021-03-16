'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Component to show a selection box (like on windows desktop)
 */
var SelectBox = function (_React$Component) {
  _inherits(SelectBox, _React$Component);

  function SelectBox(props) {
    _classCallCheck(this, SelectBox);

    var _this = _possibleConstructorReturn(this, (SelectBox.__proto__ || Object.getPrototypeOf(SelectBox)).call(this, props));

    _this.curX = 0;
    _this.curY = 0;
    _this.startX = 0;
    _this.startY = 0;
    return _this;
  }

  /**
   * Create the selection box
   * @param {number} x Starting x coordinate for selection box
   * @param {number} y Starting y coordinate for selection box
   */


  _createClass(SelectBox, [{
    key: 'start',
    value: function start(x, y) {
      this.startX = x;
      this.startY = y;
      this.curX = 0;
      this.curY = 0;
    }

    /**
     * Update the selection box as the mouse moves
     * @param {number} x The current X coordinate of the mouse
     * @param {number} y The current Y coordinate of the mouse
     */

  }, {
    key: 'move',
    value: function move(x, y) {
      this.curX = x;
      this.curY = y;
      this.forceUpdate();
    }

    /**
     * Generally on mouse up.
     * Finish the selection box and return the rectangle created
     * @returns {Object} The selection rectangle
     * @property {number} top The top y coordinate
     * @property {number} left The left x coordinate
     * @property {number} width The width of the box
     * @property {number} height The height of the box
     */

  }, {
    key: 'end',
    value: function end() {
      var startX = this.startX,
          startY = this.startY,
          curX = this.curX,
          curY = this.curY;

      var left = Math.min(startX, curX);
      var top = Math.min(startY, curY);
      var width = Math.abs(startX - curX);
      var height = Math.abs(startY - curY);
      var toReturn = { left: left, top: top, width: width, height: height };

      this.startX = 0;
      this.startY = 0;
      this.curX = 0;
      this.curY = 0;
      this.forceUpdate();
      return toReturn;
    }

    /**
     * @ignore
     */

  }, {
    key: 'render',
    value: function render() {
      var startX = this.startX,
          startY = this.startY,
          curX = this.curX,
          curY = this.curY;

      var left = Math.min(startX, curX);
      var top = Math.min(startY, curY);
      var width = Math.abs(startX - curX);
      var height = Math.abs(startY - curY);
      var style = { left: left, top: top, width: width, height: height };
      return _react2.default.createElement('div', { className: 'rct9k-selector-outer', style: style });
    }
  }]);

  return SelectBox;
}(_react2.default.Component);

exports.default = SelectBox;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3NlbGVjdG9yLmpzIl0sIm5hbWVzIjpbIlNlbGVjdEJveCIsInByb3BzIiwiY3VyWCIsImN1clkiLCJzdGFydFgiLCJzdGFydFkiLCJ4IiwieSIsImZvcmNlVXBkYXRlIiwibGVmdCIsIk1hdGgiLCJtaW4iLCJ0b3AiLCJ3aWR0aCIsImFicyIsImhlaWdodCIsInRvUmV0dXJuIiwic3R5bGUiLCJSZWFjdCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHcUJBLFM7OztBQUNuQixxQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLHNIQUNYQSxLQURXOztBQUVqQixVQUFLQyxJQUFMLEdBQVksQ0FBWjtBQUNBLFVBQUtDLElBQUwsR0FBWSxDQUFaO0FBQ0EsVUFBS0MsTUFBTCxHQUFjLENBQWQ7QUFDQSxVQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUxpQjtBQU1sQjs7QUFFRDs7Ozs7Ozs7OzBCQUtNQyxDLEVBQUdDLEMsRUFBRztBQUNWLFdBQUtILE1BQUwsR0FBY0UsQ0FBZDtBQUNBLFdBQUtELE1BQUwsR0FBY0UsQ0FBZDtBQUNBLFdBQUtMLElBQUwsR0FBWSxDQUFaO0FBQ0EsV0FBS0MsSUFBTCxHQUFZLENBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7eUJBS0tHLEMsRUFBR0MsQyxFQUFHO0FBQ1QsV0FBS0wsSUFBTCxHQUFZSSxDQUFaO0FBQ0EsV0FBS0gsSUFBTCxHQUFZSSxDQUFaO0FBQ0EsV0FBS0MsV0FBTDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7MEJBU007QUFBQSxVQUNHSixNQURILEdBQ2lDLElBRGpDLENBQ0dBLE1BREg7QUFBQSxVQUNXQyxNQURYLEdBQ2lDLElBRGpDLENBQ1dBLE1BRFg7QUFBQSxVQUNtQkgsSUFEbkIsR0FDaUMsSUFEakMsQ0FDbUJBLElBRG5CO0FBQUEsVUFDeUJDLElBRHpCLEdBQ2lDLElBRGpDLENBQ3lCQSxJQUR6Qjs7QUFFSixVQUFNTSxPQUFPQyxLQUFLQyxHQUFMLENBQVNQLE1BQVQsRUFBaUJGLElBQWpCLENBQWI7QUFDQSxVQUFNVSxNQUFNRixLQUFLQyxHQUFMLENBQVNOLE1BQVQsRUFBaUJGLElBQWpCLENBQVo7QUFDQSxVQUFNVSxRQUFRSCxLQUFLSSxHQUFMLENBQVNWLFNBQVNGLElBQWxCLENBQWQ7QUFDQSxVQUFNYSxTQUFTTCxLQUFLSSxHQUFMLENBQVNULFNBQVNGLElBQWxCLENBQWY7QUFDQSxVQUFJYSxXQUFXLEVBQUNQLFVBQUQsRUFBT0csUUFBUCxFQUFZQyxZQUFaLEVBQW1CRSxjQUFuQixFQUFmOztBQUVBLFdBQUtYLE1BQUwsR0FBYyxDQUFkO0FBQ0EsV0FBS0MsTUFBTCxHQUFjLENBQWQ7QUFDQSxXQUFLSCxJQUFMLEdBQVksQ0FBWjtBQUNBLFdBQUtDLElBQUwsR0FBWSxDQUFaO0FBQ0EsV0FBS0ssV0FBTDtBQUNBLGFBQU9RLFFBQVA7QUFDRDs7QUFFRDs7Ozs7OzZCQUdTO0FBQUEsVUFDQVosTUFEQSxHQUM4QixJQUQ5QixDQUNBQSxNQURBO0FBQUEsVUFDUUMsTUFEUixHQUM4QixJQUQ5QixDQUNRQSxNQURSO0FBQUEsVUFDZ0JILElBRGhCLEdBQzhCLElBRDlCLENBQ2dCQSxJQURoQjtBQUFBLFVBQ3NCQyxJQUR0QixHQUM4QixJQUQ5QixDQUNzQkEsSUFEdEI7O0FBRVAsVUFBTU0sT0FBT0MsS0FBS0MsR0FBTCxDQUFTUCxNQUFULEVBQWlCRixJQUFqQixDQUFiO0FBQ0EsVUFBTVUsTUFBTUYsS0FBS0MsR0FBTCxDQUFTTixNQUFULEVBQWlCRixJQUFqQixDQUFaO0FBQ0EsVUFBTVUsUUFBUUgsS0FBS0ksR0FBTCxDQUFTVixTQUFTRixJQUFsQixDQUFkO0FBQ0EsVUFBTWEsU0FBU0wsS0FBS0ksR0FBTCxDQUFTVCxTQUFTRixJQUFsQixDQUFmO0FBQ0EsVUFBSWMsUUFBUSxFQUFDUixVQUFELEVBQU9HLFFBQVAsRUFBWUMsWUFBWixFQUFtQkUsY0FBbkIsRUFBWjtBQUNBLGFBQU8sdUNBQUssV0FBVSxzQkFBZixFQUFzQyxPQUFPRSxLQUE3QyxHQUFQO0FBQ0Q7Ozs7RUFwRW9DQyxnQkFBTUMsUzs7a0JBQXhCbkIsUyIsImZpbGUiOiJzZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbi8qKlxyXG4gKiBDb21wb25lbnQgdG8gc2hvdyBhIHNlbGVjdGlvbiBib3ggKGxpa2Ugb24gd2luZG93cyBkZXNrdG9wKVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0Qm94IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5jdXJYID0gMDtcclxuICAgIHRoaXMuY3VyWSA9IDA7XHJcbiAgICB0aGlzLnN0YXJ0WCA9IDA7XHJcbiAgICB0aGlzLnN0YXJ0WSA9IDA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgdGhlIHNlbGVjdGlvbiBib3hcclxuICAgKiBAcGFyYW0ge251bWJlcn0geCBTdGFydGluZyB4IGNvb3JkaW5hdGUgZm9yIHNlbGVjdGlvbiBib3hcclxuICAgKiBAcGFyYW0ge251bWJlcn0geSBTdGFydGluZyB5IGNvb3JkaW5hdGUgZm9yIHNlbGVjdGlvbiBib3hcclxuICAgKi9cclxuICBzdGFydCh4LCB5KSB7XHJcbiAgICB0aGlzLnN0YXJ0WCA9IHg7XHJcbiAgICB0aGlzLnN0YXJ0WSA9IHk7XHJcbiAgICB0aGlzLmN1clggPSAwO1xyXG4gICAgdGhpcy5jdXJZID0gMDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSB0aGUgc2VsZWN0aW9uIGJveCBhcyB0aGUgbW91c2UgbW92ZXNcclxuICAgKiBAcGFyYW0ge251bWJlcn0geCBUaGUgY3VycmVudCBYIGNvb3JkaW5hdGUgb2YgdGhlIG1vdXNlXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgVGhlIGN1cnJlbnQgWSBjb29yZGluYXRlIG9mIHRoZSBtb3VzZVxyXG4gICAqL1xyXG4gIG1vdmUoeCwgeSkge1xyXG4gICAgdGhpcy5jdXJYID0geDtcclxuICAgIHRoaXMuY3VyWSA9IHk7XHJcbiAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZW5lcmFsbHkgb24gbW91c2UgdXAuXHJcbiAgICogRmluaXNoIHRoZSBzZWxlY3Rpb24gYm94IGFuZCByZXR1cm4gdGhlIHJlY3RhbmdsZSBjcmVhdGVkXHJcbiAgICogQHJldHVybnMge09iamVjdH0gVGhlIHNlbGVjdGlvbiByZWN0YW5nbGVcclxuICAgKiBAcHJvcGVydHkge251bWJlcn0gdG9wIFRoZSB0b3AgeSBjb29yZGluYXRlXHJcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9IGxlZnQgVGhlIGxlZnQgeCBjb29yZGluYXRlXHJcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9IHdpZHRoIFRoZSB3aWR0aCBvZiB0aGUgYm94XHJcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9IGhlaWdodCBUaGUgaGVpZ2h0IG9mIHRoZSBib3hcclxuICAgKi9cclxuICBlbmQoKSB7XHJcbiAgICBjb25zdCB7c3RhcnRYLCBzdGFydFksIGN1clgsIGN1cll9ID0gdGhpcztcclxuICAgIGNvbnN0IGxlZnQgPSBNYXRoLm1pbihzdGFydFgsIGN1clgpO1xyXG4gICAgY29uc3QgdG9wID0gTWF0aC5taW4oc3RhcnRZLCBjdXJZKTtcclxuICAgIGNvbnN0IHdpZHRoID0gTWF0aC5hYnMoc3RhcnRYIC0gY3VyWCk7XHJcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLmFicyhzdGFydFkgLSBjdXJZKTtcclxuICAgIGxldCB0b1JldHVybiA9IHtsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHR9O1xyXG5cclxuICAgIHRoaXMuc3RhcnRYID0gMDtcclxuICAgIHRoaXMuc3RhcnRZID0gMDtcclxuICAgIHRoaXMuY3VyWCA9IDA7XHJcbiAgICB0aGlzLmN1clkgPSAwO1xyXG4gICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xyXG4gICAgcmV0dXJuIHRvUmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQGlnbm9yZVxyXG4gICAqL1xyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHtzdGFydFgsIHN0YXJ0WSwgY3VyWCwgY3VyWX0gPSB0aGlzO1xyXG4gICAgY29uc3QgbGVmdCA9IE1hdGgubWluKHN0YXJ0WCwgY3VyWCk7XHJcbiAgICBjb25zdCB0b3AgPSBNYXRoLm1pbihzdGFydFksIGN1clkpO1xyXG4gICAgY29uc3Qgd2lkdGggPSBNYXRoLmFicyhzdGFydFggLSBjdXJYKTtcclxuICAgIGNvbnN0IGhlaWdodCA9IE1hdGguYWJzKHN0YXJ0WSAtIGN1clkpO1xyXG4gICAgbGV0IHN0eWxlID0ge2xlZnQsIHRvcCwgd2lkdGgsIGhlaWdodH07XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJyY3Q5ay1zZWxlY3Rvci1vdXRlclwiIHN0eWxlPXtzdHlsZX0gLz47XHJcbiAgfVxyXG59XHJcbiJdfQ==