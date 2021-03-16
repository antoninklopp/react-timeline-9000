'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Marker = function Marker(props) {
  var height = props.height,
      left = props.left,
      top = props.top;

  return _react2.default.createElement('div', { className: 'rct9k-marker-overlay', style: { height: height, left: left, top: top } });
};

Marker.propTypes = {
  height: _propTypes2.default.number.isRequired,
  left: _propTypes2.default.number.isRequired,
  top: _propTypes2.default.number.isRequired
};

exports.default = Marker;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21hcmtlci5qcyJdLCJuYW1lcyI6WyJNYXJrZXIiLCJoZWlnaHQiLCJwcm9wcyIsImxlZnQiLCJ0b3AiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJudW1iZXIiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLFNBQVRBLE1BQVMsUUFBUztBQUFBLE1BQ2ZDLE1BRGUsR0FDTUMsS0FETixDQUNmRCxNQURlO0FBQUEsTUFDUEUsSUFETyxHQUNNRCxLQUROLENBQ1BDLElBRE87QUFBQSxNQUNEQyxHQURDLEdBQ01GLEtBRE4sQ0FDREUsR0FEQzs7QUFFdEIsU0FBTyx1Q0FBSyxXQUFVLHNCQUFmLEVBQXNDLE9BQU8sRUFBQ0gsY0FBRCxFQUFTRSxVQUFULEVBQWVDLFFBQWYsRUFBN0MsR0FBUDtBQUNELENBSEQ7O0FBS0FKLE9BQU9LLFNBQVAsR0FBbUI7QUFDakJKLFVBQVFLLG9CQUFVQyxNQUFWLENBQWlCQyxVQURSO0FBRWpCTCxRQUFNRyxvQkFBVUMsTUFBVixDQUFpQkMsVUFGTjtBQUdqQkosT0FBS0Usb0JBQVVDLE1BQVYsQ0FBaUJDO0FBSEwsQ0FBbkI7O2tCQU1lUixNIiwiZmlsZSI6Im1hcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XHJcblxyXG5jb25zdCBNYXJrZXIgPSBwcm9wcyA9PiB7XHJcbiAgY29uc3Qge2hlaWdodCwgbGVmdCwgdG9wfSA9IHByb3BzO1xyXG4gIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cInJjdDlrLW1hcmtlci1vdmVybGF5XCIgc3R5bGU9e3toZWlnaHQsIGxlZnQsIHRvcH19IC8+O1xyXG59O1xyXG5cclxuTWFya2VyLnByb3BUeXBlcyA9IHtcclxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICBsZWZ0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgdG9wOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hcmtlcjtcclxuIl19