"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultGroupRenderer = exports.DefaultItemRenderer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Default item renderer class
 * @param {object} props - Component props
 * @param {object} props.item - The item to be rendered
 * @param {string} props.item.title - The item's title
 * @param {?...object} props.rest - Any other arguments for the span tag
 */
var DefaultItemRenderer = function DefaultItemRenderer(props) {
  var item = props.item,
      rest = _objectWithoutProperties(props, ["item"]);

  return _react2.default.createElement(
    "span",
    rest,
    _react2.default.createElement(
      "span",
      { className: "rct9k-item-renderer-inner" },
      item.title
    )
  );
};

/**
 * Default group (row) renderer class
 * @param {object} props - Component props
 * @param {object} props.group - The group to be rendered
 * @param {string} props.group.title - The group's title
 * @param {string} props.group.id - The group's id
 * @param {?...object} props.rest - Any other arguments for the span tag
 */
exports.DefaultItemRenderer = DefaultItemRenderer;
var DefaultGroupRenderer = function DefaultGroupRenderer(props) {
  var group = props.group,
      rest = _objectWithoutProperties(props, ["group"]);

  return _react2.default.createElement(
    "span",
    _extends({ "data-group-index": group.id }, rest),
    _react2.default.createElement(
      "span",
      null,
      group.title
    )
  );
};
exports.DefaultGroupRenderer = DefaultGroupRenderer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3JlbmRlcmVycy5qcyJdLCJuYW1lcyI6WyJEZWZhdWx0SXRlbVJlbmRlcmVyIiwiaXRlbSIsInByb3BzIiwicmVzdCIsInRpdGxlIiwiRGVmYXVsdEdyb3VwUmVuZGVyZXIiLCJncm91cCIsImlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7QUFFQTs7Ozs7OztBQU9PLElBQU1BLHNCQUFzQixTQUF0QkEsbUJBQXNCLFFBQVM7QUFBQSxNQUNuQ0MsSUFEbUMsR0FDbEJDLEtBRGtCLENBQ25DRCxJQURtQztBQUFBLE1BQzFCRSxJQUQwQiw0QkFDbEJELEtBRGtCOztBQUcxQyxTQUNFO0FBQUE7QUFBVUMsUUFBVjtBQUNFO0FBQUE7QUFBQSxRQUFNLFdBQVUsMkJBQWhCO0FBQTZDRixXQUFLRztBQUFsRDtBQURGLEdBREY7QUFLRCxDQVJNOztBQVVQOzs7Ozs7Ozs7QUFRTyxJQUFNQyx1QkFBdUIsU0FBdkJBLG9CQUF1QixRQUFTO0FBQUEsTUFDcENDLEtBRG9DLEdBQ2xCSixLQURrQixDQUNwQ0ksS0FEb0M7QUFBQSxNQUMxQkgsSUFEMEIsNEJBQ2xCRCxLQURrQjs7QUFHM0MsU0FDRTtBQUFBO0FBQUEsZUFBTSxvQkFBa0JJLE1BQU1DLEVBQTlCLElBQXNDSixJQUF0QztBQUNFO0FBQUE7QUFBQTtBQUFPRyxZQUFNRjtBQUFiO0FBREYsR0FERjtBQUtELENBUk0iLCJmaWxlIjoicmVuZGVyZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbi8qKlxyXG4gKiBEZWZhdWx0IGl0ZW0gcmVuZGVyZXIgY2xhc3NcclxuICogQHBhcmFtIHtvYmplY3R9IHByb3BzIC0gQ29tcG9uZW50IHByb3BzXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcy5pdGVtIC0gVGhlIGl0ZW0gdG8gYmUgcmVuZGVyZWRcclxuICogQHBhcmFtIHtzdHJpbmd9IHByb3BzLml0ZW0udGl0bGUgLSBUaGUgaXRlbSdzIHRpdGxlXHJcbiAqIEBwYXJhbSB7Py4uLm9iamVjdH0gcHJvcHMucmVzdCAtIEFueSBvdGhlciBhcmd1bWVudHMgZm9yIHRoZSBzcGFuIHRhZ1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IERlZmF1bHRJdGVtUmVuZGVyZXIgPSBwcm9wcyA9PiB7XHJcbiAgY29uc3Qge2l0ZW0sIC4uLnJlc3R9ID0gcHJvcHM7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8c3BhbiB7Li4ucmVzdH0+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInJjdDlrLWl0ZW0tcmVuZGVyZXItaW5uZXJcIj57aXRlbS50aXRsZX08L3NwYW4+XHJcbiAgICA8L3NwYW4+XHJcbiAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZWZhdWx0IGdyb3VwIChyb3cpIHJlbmRlcmVyIGNsYXNzXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcyAtIENvbXBvbmVudCBwcm9wc1xyXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHMuZ3JvdXAgLSBUaGUgZ3JvdXAgdG8gYmUgcmVuZGVyZWRcclxuICogQHBhcmFtIHtzdHJpbmd9IHByb3BzLmdyb3VwLnRpdGxlIC0gVGhlIGdyb3VwJ3MgdGl0bGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHByb3BzLmdyb3VwLmlkIC0gVGhlIGdyb3VwJ3MgaWRcclxuICogQHBhcmFtIHs/Li4ub2JqZWN0fSBwcm9wcy5yZXN0IC0gQW55IG90aGVyIGFyZ3VtZW50cyBmb3IgdGhlIHNwYW4gdGFnXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgRGVmYXVsdEdyb3VwUmVuZGVyZXIgPSBwcm9wcyA9PiB7XHJcbiAgY29uc3Qge2dyb3VwLCAuLi5yZXN0fSA9IHByb3BzO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPHNwYW4gZGF0YS1ncm91cC1pbmRleD17Z3JvdXAuaWR9IHsuLi5yZXN0fT5cclxuICAgICAgPHNwYW4+e2dyb3VwLnRpdGxlfTwvc3Bhbj5cclxuICAgIDwvc3Bhbj5cclxuICApO1xyXG59O1xyXG4iXX0=