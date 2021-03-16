'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactVirtualized = require('react-virtualized');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Timeline body/grid
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var TimelineBody = function (_Component) {
  _inherits(TimelineBody, _Component);

  function TimelineBody() {
    _classCallCheck(this, TimelineBody);

    return _possibleConstructorReturn(this, (TimelineBody.__proto__ || Object.getPrototypeOf(TimelineBody)).apply(this, arguments));
  }

  _createClass(TimelineBody, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.forceUpdate();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var props = this.props;

      if (!props.shallowUpdateCheck) {
        return true;
      }

      // prettier-ignore
      var shallowChange = props.height !== nextProps.height || props.width !== nextProps.width || props.rowCount !== nextProps.rowCount;

      if (props.forceRedrawFunc) {
        return shallowChange || props.forceRedrawFunc(props, nextProps);
      }

      return shallowChange;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          width = _props.width,
          columnWidth = _props.columnWidth,
          height = _props.height,
          rowHeight = _props.rowHeight,
          rowCount = _props.rowCount;
      var _props2 = this.props,
          grid_ref_callback = _props2.grid_ref_callback,
          cellRenderer = _props2.cellRenderer;


      return _react2.default.createElement(_reactVirtualized.Grid, {
        ref: grid_ref_callback,
        autoContainerWidth: true,
        cellRenderer: cellRenderer,
        columnCount: 2,
        columnWidth: columnWidth,
        height: height,
        rowCount: rowCount,
        rowHeight: rowHeight,
        width: width
      });
    }
  }]);

  return TimelineBody;
}(_react.Component);

TimelineBody.propTypes = {
  width: _propTypes2.default.number.isRequired,
  columnWidth: _propTypes2.default.func.isRequired,
  height: _propTypes2.default.number.isRequired,
  rowHeight: _propTypes2.default.func.isRequired,
  rowCount: _propTypes2.default.number.isRequired,
  grid_ref_callback: _propTypes2.default.func.isRequired,
  cellRenderer: _propTypes2.default.func.isRequired,
  shallowUpdateCheck: _propTypes2.default.bool,
  forceRedrawFunc: _propTypes2.default.func
};

TimelineBody.defaultProps = {
  shallowUpdateCheck: false,
  forceRedrawFunc: null
};
exports.default = TimelineBody;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2JvZHkuanMiXSwibmFtZXMiOlsiVGltZWxpbmVCb2R5IiwiZm9yY2VVcGRhdGUiLCJuZXh0UHJvcHMiLCJwcm9wcyIsInNoYWxsb3dVcGRhdGVDaGVjayIsInNoYWxsb3dDaGFuZ2UiLCJoZWlnaHQiLCJ3aWR0aCIsInJvd0NvdW50IiwiZm9yY2VSZWRyYXdGdW5jIiwiY29sdW1uV2lkdGgiLCJyb3dIZWlnaHQiLCJncmlkX3JlZl9jYWxsYmFjayIsImNlbGxSZW5kZXJlciIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJmdW5jIiwiYm9vbCIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFJQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7OytlQVBBOzs7O0lBU01BLFk7Ozs7Ozs7Ozs7O3dDQUNnQjtBQUNsQixXQUFLQyxXQUFMO0FBQ0Q7OzswQ0FDcUJDLFMsRUFBVztBQUFBLFVBQ3hCQyxLQUR3QixHQUNmLElBRGUsQ0FDeEJBLEtBRHdCOztBQUUvQixVQUFJLENBQUNBLE1BQU1DLGtCQUFYLEVBQStCO0FBQzdCLGVBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0EsVUFBTUMsZ0JBQWdCRixNQUFNRyxNQUFOLEtBQWlCSixVQUFVSSxNQUEzQixJQUNqQkgsTUFBTUksS0FBTixLQUFnQkwsVUFBVUssS0FEVCxJQUVqQkosTUFBTUssUUFBTixLQUFtQk4sVUFBVU0sUUFGbEM7O0FBSUEsVUFBSUwsTUFBTU0sZUFBVixFQUEyQjtBQUN6QixlQUFPSixpQkFBaUJGLE1BQU1NLGVBQU4sQ0FBc0JOLEtBQXRCLEVBQTZCRCxTQUE3QixDQUF4QjtBQUNEOztBQUVELGFBQU9HLGFBQVA7QUFDRDs7OzZCQUNRO0FBQUEsbUJBQ21ELEtBQUtGLEtBRHhEO0FBQUEsVUFDQUksS0FEQSxVQUNBQSxLQURBO0FBQUEsVUFDT0csV0FEUCxVQUNPQSxXQURQO0FBQUEsVUFDb0JKLE1BRHBCLFVBQ29CQSxNQURwQjtBQUFBLFVBQzRCSyxTQUQ1QixVQUM0QkEsU0FENUI7QUFBQSxVQUN1Q0gsUUFEdkMsVUFDdUNBLFFBRHZDO0FBQUEsb0JBRW1DLEtBQUtMLEtBRnhDO0FBQUEsVUFFQVMsaUJBRkEsV0FFQUEsaUJBRkE7QUFBQSxVQUVtQkMsWUFGbkIsV0FFbUJBLFlBRm5COzs7QUFJUCxhQUNFLDhCQUFDLHNCQUFEO0FBQ0UsYUFBS0QsaUJBRFA7QUFFRSxnQ0FGRjtBQUdFLHNCQUFjQyxZQUhoQjtBQUlFLHFCQUFhLENBSmY7QUFLRSxxQkFBYUgsV0FMZjtBQU1FLGdCQUFRSixNQU5WO0FBT0Usa0JBQVVFLFFBUFo7QUFRRSxtQkFBV0csU0FSYjtBQVNFLGVBQU9KO0FBVFQsUUFERjtBQWFEOzs7O0VBdEN3Qk8sZ0I7O0FBeUMzQmQsYUFBYWUsU0FBYixHQUF5QjtBQUN2QlIsU0FBT1Msb0JBQVVDLE1BQVYsQ0FBaUJDLFVBREQ7QUFFdkJSLGVBQWFNLG9CQUFVRyxJQUFWLENBQWVELFVBRkw7QUFHdkJaLFVBQVFVLG9CQUFVQyxNQUFWLENBQWlCQyxVQUhGO0FBSXZCUCxhQUFXSyxvQkFBVUcsSUFBVixDQUFlRCxVQUpIO0FBS3ZCVixZQUFVUSxvQkFBVUMsTUFBVixDQUFpQkMsVUFMSjtBQU12Qk4scUJBQW1CSSxvQkFBVUcsSUFBVixDQUFlRCxVQU5YO0FBT3ZCTCxnQkFBY0csb0JBQVVHLElBQVYsQ0FBZUQsVUFQTjtBQVF2QmQsc0JBQW9CWSxvQkFBVUksSUFSUDtBQVN2QlgsbUJBQWlCTyxvQkFBVUc7QUFUSixDQUF6Qjs7QUFZQW5CLGFBQWFxQixZQUFiLEdBQTRCO0FBQzFCakIsc0JBQW9CLEtBRE07QUFFMUJLLG1CQUFpQjtBQUZTLENBQTVCO2tCQUllVCxZIiwiZmlsZSI6ImJvZHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogVGltZWxpbmUgYm9keS9ncmlkXHJcbiAqL1xyXG5cclxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XHJcblxyXG5pbXBvcnQge0dyaWR9IGZyb20gJ3JlYWN0LXZpcnR1YWxpemVkJztcclxuXHJcbmNsYXNzIFRpbWVsaW5lQm9keSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XHJcbiAgfVxyXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgIGNvbnN0IHtwcm9wc30gPSB0aGlzO1xyXG4gICAgaWYgKCFwcm9wcy5zaGFsbG93VXBkYXRlQ2hlY2spIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJldHRpZXItaWdub3JlXHJcbiAgICBjb25zdCBzaGFsbG93Q2hhbmdlID0gcHJvcHMuaGVpZ2h0ICE9PSBuZXh0UHJvcHMuaGVpZ2h0XHJcbiAgICAgIHx8IHByb3BzLndpZHRoICE9PSBuZXh0UHJvcHMud2lkdGhcclxuICAgICAgfHwgcHJvcHMucm93Q291bnQgIT09IG5leHRQcm9wcy5yb3dDb3VudDtcclxuXHJcbiAgICBpZiAocHJvcHMuZm9yY2VSZWRyYXdGdW5jKSB7XHJcbiAgICAgIHJldHVybiBzaGFsbG93Q2hhbmdlIHx8IHByb3BzLmZvcmNlUmVkcmF3RnVuYyhwcm9wcywgbmV4dFByb3BzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2hhbGxvd0NoYW5nZTtcclxuICB9XHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3Qge3dpZHRoLCBjb2x1bW5XaWR0aCwgaGVpZ2h0LCByb3dIZWlnaHQsIHJvd0NvdW50fSA9IHRoaXMucHJvcHM7XHJcbiAgICBjb25zdCB7Z3JpZF9yZWZfY2FsbGJhY2ssIGNlbGxSZW5kZXJlcn0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxHcmlkXHJcbiAgICAgICAgcmVmPXtncmlkX3JlZl9jYWxsYmFja31cclxuICAgICAgICBhdXRvQ29udGFpbmVyV2lkdGhcclxuICAgICAgICBjZWxsUmVuZGVyZXI9e2NlbGxSZW5kZXJlcn1cclxuICAgICAgICBjb2x1bW5Db3VudD17Mn1cclxuICAgICAgICBjb2x1bW5XaWR0aD17Y29sdW1uV2lkdGh9XHJcbiAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XHJcbiAgICAgICAgcm93Q291bnQ9e3Jvd0NvdW50fVxyXG4gICAgICAgIHJvd0hlaWdodD17cm93SGVpZ2h0fVxyXG4gICAgICAgIHdpZHRoPXt3aWR0aH1cclxuICAgICAgLz5cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5UaW1lbGluZUJvZHkucHJvcFR5cGVzID0ge1xyXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgY29sdW1uV2lkdGg6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgcm93SGVpZ2h0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gIHJvd0NvdW50OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgZ3JpZF9yZWZfY2FsbGJhY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgY2VsbFJlbmRlcmVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gIHNoYWxsb3dVcGRhdGVDaGVjazogUHJvcFR5cGVzLmJvb2wsXHJcbiAgZm9yY2VSZWRyYXdGdW5jOiBQcm9wVHlwZXMuZnVuY1xyXG59O1xyXG5cclxuVGltZWxpbmVCb2R5LmRlZmF1bHRQcm9wcyA9IHtcclxuICBzaGFsbG93VXBkYXRlQ2hlY2s6IGZhbHNlLFxyXG4gIGZvcmNlUmVkcmF3RnVuYzogbnVsbFxyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBUaW1lbGluZUJvZHk7XHJcbiJdfQ==