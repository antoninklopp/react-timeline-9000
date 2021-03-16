'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _commonUtils = require('../utils/commonUtils');

var _timebarConsts = require('../consts/timebarConsts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Timebar component - displays the current time on top of the timeline
 */
var Timebar = function (_React$Component) {
  _inherits(Timebar, _React$Component);

  function Timebar(props) {
    _classCallCheck(this, Timebar);

    var _this = _possibleConstructorReturn(this, (Timebar.__proto__ || Object.getPrototypeOf(Timebar)).call(this, props));

    _this.state = {};

    _this.guessResolution = _this.guessResolution.bind(_this);
    _this.renderBar = _this.renderBar.bind(_this);
    _this.renderTopBar = _this.renderTopBar.bind(_this);
    _this.renderBottomBar = _this.renderBottomBar.bind(_this);
    return _this;
  }

  _createClass(Timebar, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.guessResolution();
    }
    /**
     * On new props we check if a resolution is given, and if not we guess one
     * @param {Object} nextProps Props coming in
     */

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.top_resolution && nextProps.bottom_resolution) {
        this.setState({ resolution: { top: nextProps.top_resolution, bottom: nextProps.bottom_resolution } });
      } else {
        this.guessResolution(nextProps.start, nextProps.end);
      }
    }

    /**
     * Attempts to guess the resolution of the top and bottom halves of the timebar based on the viewable date range.
     * Sets resolution to state.
     * @param {moment} start Start date for the timebar
     * @param {moment} end End date for the timebar
     */

  }, {
    key: 'guessResolution',
    value: function guessResolution(start, end) {
      if (!start || !end) {
        start = this.props.start;
        end = this.props.end;
      }
      var durationSecs = end.diff(start, 'seconds');
      //    -> 1h
      if (durationSecs <= 60 * 60) this.setState({ resolution: { top: 'hour', bottom: 'minute' } });
      // 1h -> 3d
      else if (durationSecs <= 24 * 60 * 60 * 3) this.setState({ resolution: { top: 'day', bottom: 'hour' } });
        // 1d -> 30d
        else if (durationSecs <= 30 * 24 * 60 * 60) this.setState({ resolution: { top: 'month', bottom: 'day' } });
          //30d -> 1y
          else if (durationSecs <= 365 * 24 * 60 * 60) this.setState({ resolution: { top: 'year', bottom: 'month' } });
            // 1y ->
            else this.setState({ resolution: { top: 'year', bottom: 'year' } });
    }

    /**
     * Renderer for top bar.
     * @returns {Object} JSX for top menu bar - based of time format & resolution
     */

  }, {
    key: 'renderTopBar',
    value: function renderTopBar() {
      var res = this.state.resolution.top;
      return this.renderBar({ format: this.props.timeFormats.majorLabels[res], type: res });
    }
    /**
     * Renderer for bottom bar.
     * @returns {Object} JSX for bottom menu bar - based of time format & resolution
     */

  }, {
    key: 'renderBottomBar',
    value: function renderBottomBar() {
      var res = this.state.resolution.bottom;
      return this.renderBar({ format: this.props.timeFormats.minorLabels[res], type: res });
    }
    /**
     * Gets the number of pixels per segment of the timebar section (using the resolution)
     * @param {moment} date The date being rendered. This is used to figure out how many days are in the month
     * @param {string} resolutionType Timebar section resolution [Year; Month...]
     * @returns {number} The number of pixels per segment
     */

  }, {
    key: 'getPixelIncrement',
    value: function getPixelIncrement(date, resolutionType) {
      var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var _props = this.props,
          start = _props.start,
          end = _props.end;

      var width = this.props.width - this.props.leftOffset;

      var start_end_min = end.diff(start, 'minutes');
      var pixels_per_min = width / start_end_min;
      function isLeapYear(year) {
        return year % 400 === 0 || year % 100 !== 0 && year % 4 === 0;
      }
      var daysInYear = isLeapYear(date.year()) ? 366 : 365;
      var inc = width;
      switch (resolutionType) {
        case 'year':
          inc = pixels_per_min * 60 * 24 * (daysInYear - offset);
          break;
        case 'month':
          inc = pixels_per_min * 60 * 24 * (date.daysInMonth() - offset);
          break;
        case 'day':
          inc = pixels_per_min * 60 * (24 - offset);
          break;
        case 'hour':
          inc = pixels_per_min * (60 - offset);
          break;
        case 'minute':
          inc = pixels_per_min - offset;
          break;
        default:
          break;
      }
      return Math.min(inc, width);
    }
    /**
     * Renders an entire segment of the timebar (top or bottom)
     * @param {string} resolution The resolution to render at [Year; Month...]
     * @returns {Object[]} A list of sections (making up a segment) to be rendered
     * @property {string} label The text displayed in the section (usually the date/time)
     * @property {boolean} isSelected Whether the section is being 'touched' when dragging/resizing
     * @property {number} size The number of pixels the segment will take up
     * @property {number|string} key Key for react
     */

  }, {
    key: 'renderBar',
    value: function renderBar(resolution) {
      var _props2 = this.props,
          start = _props2.start,
          end = _props2.end,
          selectedRanges = _props2.selectedRanges;

      var width = this.props.width - this.props.leftOffset;

      var currentDate = start.clone();
      var timeIncrements = [];
      var pixelsLeft = width;
      var labelSizeLimit = 60;

      function _addTimeIncrement(initialOffset, offsetType, stepFunc) {
        var offset = null;
        while (currentDate.isBefore(end) && pixelsLeft > 0) {
          // if this is the first 'block' it may be cut off at the start
          if (pixelsLeft === width) {
            offset = initialOffset;
          } else {
            offset = _moment2.default.duration(0);
          }
          var pixelIncrements = Math.min(this.getPixelIncrement(currentDate, resolution.type, offset.as(offsetType)), pixelsLeft);
          var labelSize = pixelIncrements < labelSizeLimit ? 'short' : 'long';
          var label = currentDate.format(resolution.format[labelSize]);
          var isSelected = _lodash2.default.some(selectedRanges, function (s) {
            return currentDate.isSameOrAfter(s.start.clone().startOf(resolution.type)) && currentDate.isSameOrBefore(s.end.clone().startOf(resolution.type));
          });
          timeIncrements.push({ label: label, isSelected: isSelected, size: pixelIncrements, key: pixelsLeft });
          stepFunc(currentDate, offset);
          pixelsLeft -= pixelIncrements;
        }
      }

      var addTimeIncrement = _addTimeIncrement.bind(this);

      if (resolution.type === 'year') {
        var offset = _moment2.default.duration(currentDate.diff(currentDate.clone().startOf('year')));
        addTimeIncrement(offset, 'months', function (currentDt, offst) {
          return currentDt.subtract(offst).add(1, 'year');
        });
      } else if (resolution.type === 'month') {
        var _offset = _moment2.default.duration(currentDate.diff(currentDate.clone().startOf('month')));
        addTimeIncrement(_offset, 'days', function (currentDt, offst) {
          return currentDt.subtract(offst).add(1, 'month');
        });
      } else if (resolution.type === 'day') {
        var _offset2 = _moment2.default.duration(currentDate.diff(currentDate.clone().startOf('day')));
        addTimeIncrement(_offset2, 'hours', function (currentDt, offst) {
          return currentDt.subtract(offst).add(1, 'days');
        });
      } else if (resolution.type === 'hour') {
        var _offset3 = _moment2.default.duration(currentDate.diff(currentDate.clone().startOf('hour')));
        addTimeIncrement(_offset3, 'minutes', function (currentDt, offst) {
          return currentDt.subtract(offst).add(1, 'hours');
        });
      } else if (resolution.type === 'minute') {
        addTimeIncrement(_moment2.default.duration(0), 'minutes', function (currentDt, offst) {
          return currentDt.add(1, 'minutes');
        });
      }
      return timeIncrements;
    }

    /**
     * Renders the timebar
     * @returns {Object} Timebar component
     */

  }, {
    key: 'render',
    value: function render() {
      var cursorTime = this.props.cursorTime;

      var topBarComponent = this.renderTopBar();
      var bottomBarComponent = this.renderBottomBar();
      var GroupTitleRenderer = this.props.groupTitleRenderer;

      // Only show the cursor on 1 of the top bar segments
      // Pick the segment that has the biggest size
      var topBarCursorKey = null;
      if (topBarComponent.length > 1 && topBarComponent[1].size > topBarComponent[0].size) topBarCursorKey = topBarComponent[1].key;else if (topBarComponent.length > 0) topBarCursorKey = topBarComponent[0].key;

      return _react2.default.createElement(
        'div',
        { className: 'rct9k-timebar' },
        _react2.default.createElement(
          'div',
          { className: 'rct9k-timebar-group-title', style: { width: this.props.leftOffset } },
          _react2.default.createElement(GroupTitleRenderer, null)
        ),
        _react2.default.createElement(
          'div',
          { className: 'rct9k-timebar-outer', style: { width: this.props.width, paddingLeft: this.props.leftOffset } },
          _react2.default.createElement(
            'div',
            { className: 'rct9k-timebar-inner rct9k-timebar-inner-top' },
            _lodash2.default.map(topBarComponent, function (i) {
              var topLabel = i.label;
              if (cursorTime && i.key === topBarCursorKey) {
                topLabel += ' [' + cursorTime + ']';
              }
              var className = 'rct9k-timebar-item';
              if (i.isSelected) className += ' rct9k-timebar-item-selected';
              return _react2.default.createElement(
                'span',
                { className: className, key: i.key, style: { width: (0, _commonUtils.intToPix)(i.size) } },
                topLabel
              );
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'rct9k-timebar-inner rct9k-timebar-inner-bottom' },
            _lodash2.default.map(bottomBarComponent, function (i) {
              var className = 'rct9k-timebar-item';
              if (i.isSelected) className += ' rct9k-timebar-item-selected';
              return _react2.default.createElement(
                'span',
                { className: className, key: i.key, style: { width: (0, _commonUtils.intToPix)(i.size) } },
                i.label
              );
            })
          )
        )
      );
    }
  }]);

  return Timebar;
}(_react2.default.Component);

exports.default = Timebar;


Timebar.propTypes = {
  cursorTime: _propTypes2.default.any,
  groupTitleRenderer: _propTypes2.default.func,
  start: _propTypes2.default.object.isRequired, //moment
  end: _propTypes2.default.object.isRequired, //moment
  width: _propTypes2.default.number.isRequired,
  leftOffset: _propTypes2.default.number,
  top_resolution: _propTypes2.default.string,
  bottom_resolution: _propTypes2.default.string,
  selectedRanges: _propTypes2.default.arrayOf(_propTypes2.default.object), // [start: moment ,end: moment (end)]
  timeFormats: _propTypes2.default.object
};
Timebar.defaultProps = {
  selectedRanges: [],
  groupTitleRenderer: function groupTitleRenderer() {
    return _react2.default.createElement('div', null);
  },
  leftOffset: 0,
  timeFormats: _timebarConsts.timebarFormat
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3RpbWViYXIuanMiXSwibmFtZXMiOlsiVGltZWJhciIsInByb3BzIiwic3RhdGUiLCJndWVzc1Jlc29sdXRpb24iLCJiaW5kIiwicmVuZGVyQmFyIiwicmVuZGVyVG9wQmFyIiwicmVuZGVyQm90dG9tQmFyIiwibmV4dFByb3BzIiwidG9wX3Jlc29sdXRpb24iLCJib3R0b21fcmVzb2x1dGlvbiIsInNldFN0YXRlIiwicmVzb2x1dGlvbiIsInRvcCIsImJvdHRvbSIsInN0YXJ0IiwiZW5kIiwiZHVyYXRpb25TZWNzIiwiZGlmZiIsInJlcyIsImZvcm1hdCIsInRpbWVGb3JtYXRzIiwibWFqb3JMYWJlbHMiLCJ0eXBlIiwibWlub3JMYWJlbHMiLCJkYXRlIiwicmVzb2x1dGlvblR5cGUiLCJvZmZzZXQiLCJ3aWR0aCIsImxlZnRPZmZzZXQiLCJzdGFydF9lbmRfbWluIiwicGl4ZWxzX3Blcl9taW4iLCJpc0xlYXBZZWFyIiwieWVhciIsImRheXNJblllYXIiLCJpbmMiLCJkYXlzSW5Nb250aCIsIk1hdGgiLCJtaW4iLCJzZWxlY3RlZFJhbmdlcyIsImN1cnJlbnREYXRlIiwiY2xvbmUiLCJ0aW1lSW5jcmVtZW50cyIsInBpeGVsc0xlZnQiLCJsYWJlbFNpemVMaW1pdCIsIl9hZGRUaW1lSW5jcmVtZW50IiwiaW5pdGlhbE9mZnNldCIsIm9mZnNldFR5cGUiLCJzdGVwRnVuYyIsImlzQmVmb3JlIiwibW9tZW50IiwiZHVyYXRpb24iLCJwaXhlbEluY3JlbWVudHMiLCJnZXRQaXhlbEluY3JlbWVudCIsImFzIiwibGFiZWxTaXplIiwibGFiZWwiLCJpc1NlbGVjdGVkIiwiXyIsInNvbWUiLCJpc1NhbWVPckFmdGVyIiwicyIsInN0YXJ0T2YiLCJpc1NhbWVPckJlZm9yZSIsInB1c2giLCJzaXplIiwia2V5IiwiYWRkVGltZUluY3JlbWVudCIsImN1cnJlbnREdCIsIm9mZnN0Iiwic3VidHJhY3QiLCJhZGQiLCJjdXJzb3JUaW1lIiwidG9wQmFyQ29tcG9uZW50IiwiYm90dG9tQmFyQ29tcG9uZW50IiwiR3JvdXBUaXRsZVJlbmRlcmVyIiwiZ3JvdXBUaXRsZVJlbmRlcmVyIiwidG9wQmFyQ3Vyc29yS2V5IiwibGVuZ3RoIiwicGFkZGluZ0xlZnQiLCJtYXAiLCJ0b3BMYWJlbCIsImkiLCJjbGFzc05hbWUiLCJSZWFjdCIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsImFueSIsImZ1bmMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwibnVtYmVyIiwic3RyaW5nIiwiYXJyYXlPZiIsImRlZmF1bHRQcm9wcyIsImRlZmF1bHRUaW1lYmFyRm9ybWF0Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUE7OztJQUdxQkEsTzs7O0FBQ25CLG1CQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0hBQ1hBLEtBRFc7O0FBRWpCLFVBQUtDLEtBQUwsR0FBYSxFQUFiOztBQUVBLFVBQUtDLGVBQUwsR0FBdUIsTUFBS0EsZUFBTCxDQUFxQkMsSUFBckIsT0FBdkI7QUFDQSxVQUFLQyxTQUFMLEdBQWlCLE1BQUtBLFNBQUwsQ0FBZUQsSUFBZixPQUFqQjtBQUNBLFVBQUtFLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQkYsSUFBbEIsT0FBcEI7QUFDQSxVQUFLRyxlQUFMLEdBQXVCLE1BQUtBLGVBQUwsQ0FBcUJILElBQXJCLE9BQXZCO0FBUGlCO0FBUWxCOzs7O3lDQUVvQjtBQUNuQixXQUFLRCxlQUFMO0FBQ0Q7QUFDRDs7Ozs7Ozs4Q0FJMEJLLFMsRUFBVztBQUNuQyxVQUFJQSxVQUFVQyxjQUFWLElBQTRCRCxVQUFVRSxpQkFBMUMsRUFBNkQ7QUFDM0QsYUFBS0MsUUFBTCxDQUFjLEVBQUNDLFlBQVksRUFBQ0MsS0FBS0wsVUFBVUMsY0FBaEIsRUFBZ0NLLFFBQVFOLFVBQVVFLGlCQUFsRCxFQUFiLEVBQWQ7QUFDRCxP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LEVBQWtCMEIsYUFBYSw4QkFBYjtBQUNsQixxQkFDRTtBQUFBO0FBQUEsa0JBQU0sV0FBV0EsU0FBakIsRUFBNEIsS0FBS0QsRUFBRWhCLEdBQW5DLEVBQXdDLE9BQU8sRUFBQ3RDLE9BQU8sMkJBQVNzRCxFQUFFakIsSUFBWCxDQUFSLEVBQS9DO0FBQ0dpQixrQkFBRTFCO0FBREwsZUFERjtBQUtELGFBUkE7QUFESDtBQWhCRjtBQUpGLE9BREY7QUFtQ0Q7Ozs7RUE3TmtDNEIsZ0JBQU1DLFM7O2tCQUF0QnJGLE87OztBQWdPckJBLFFBQVFzRixTQUFSLEdBQW9CO0FBQ2xCZCxjQUFZZSxvQkFBVUMsR0FESjtBQUVsQlosc0JBQW9CVyxvQkFBVUUsSUFGWjtBQUdsQjFFLFNBQU93RSxvQkFBVUcsTUFBVixDQUFpQkMsVUFITixFQUdrQjtBQUNwQzNFLE9BQUt1RSxvQkFBVUcsTUFBVixDQUFpQkMsVUFKSixFQUlnQjtBQUNsQy9ELFNBQU8yRCxvQkFBVUssTUFBVixDQUFpQkQsVUFMTjtBQU1sQjlELGNBQVkwRCxvQkFBVUssTUFOSjtBQU9sQm5GLGtCQUFnQjhFLG9CQUFVTSxNQVBSO0FBUWxCbkYscUJBQW1CNkUsb0JBQVVNLE1BUlg7QUFTbEJ0RCxrQkFBZ0JnRCxvQkFBVU8sT0FBVixDQUFrQlAsb0JBQVVHLE1BQTVCLENBVEUsRUFTbUM7QUFDckRyRSxlQUFha0Usb0JBQVVHO0FBVkwsQ0FBcEI7QUFZQTFGLFFBQVErRixZQUFSLEdBQXVCO0FBQ3JCeEQsa0JBQWdCLEVBREs7QUFFckJxQyxzQkFBb0I7QUFBQSxXQUFNLDBDQUFOO0FBQUEsR0FGQztBQUdyQi9DLGNBQVksQ0FIUztBQUlyQlIsZUFBYTJFO0FBSlEsQ0FBdkIiLCJmaWxlIjoidGltZWJhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0IHtpbnRUb1BpeH0gZnJvbSAnLi4vdXRpbHMvY29tbW9uVXRpbHMnO1xyXG5pbXBvcnQge3RpbWViYXJGb3JtYXQgYXMgZGVmYXVsdFRpbWViYXJGb3JtYXR9IGZyb20gJy4uL2NvbnN0cy90aW1lYmFyQ29uc3RzJztcclxuXHJcbi8qKlxyXG4gKiBUaW1lYmFyIGNvbXBvbmVudCAtIGRpc3BsYXlzIHRoZSBjdXJyZW50IHRpbWUgb24gdG9wIG9mIHRoZSB0aW1lbGluZVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSB7fTtcclxuXHJcbiAgICB0aGlzLmd1ZXNzUmVzb2x1dGlvbiA9IHRoaXMuZ3Vlc3NSZXNvbHV0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlbmRlckJhciA9IHRoaXMucmVuZGVyQmFyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlbmRlclRvcEJhciA9IHRoaXMucmVuZGVyVG9wQmFyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlbmRlckJvdHRvbUJhciA9IHRoaXMucmVuZGVyQm90dG9tQmFyLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcbiAgICB0aGlzLmd1ZXNzUmVzb2x1dGlvbigpO1xyXG4gIH1cclxuICAvKipcclxuICAgKiBPbiBuZXcgcHJvcHMgd2UgY2hlY2sgaWYgYSByZXNvbHV0aW9uIGlzIGdpdmVuLCBhbmQgaWYgbm90IHdlIGd1ZXNzIG9uZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBuZXh0UHJvcHMgUHJvcHMgY29taW5nIGluXHJcbiAgICovXHJcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgIGlmIChuZXh0UHJvcHMudG9wX3Jlc29sdXRpb24gJiYgbmV4dFByb3BzLmJvdHRvbV9yZXNvbHV0aW9uKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Jlc29sdXRpb246IHt0b3A6IG5leHRQcm9wcy50b3BfcmVzb2x1dGlvbiwgYm90dG9tOiBuZXh0UHJvcHMuYm90dG9tX3Jlc29sdXRpb259fSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmd1ZXNzUmVzb2x1dGlvbihuZXh0UHJvcHMuc3RhcnQsIG5leHRQcm9wcy5lbmQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXR0ZW1wdHMgdG8gZ3Vlc3MgdGhlIHJlc29sdXRpb24gb2YgdGhlIHRvcCBhbmQgYm90dG9tIGhhbHZlcyBvZiB0aGUgdGltZWJhciBiYXNlZCBvbiB0aGUgdmlld2FibGUgZGF0ZSByYW5nZS5cclxuICAgKiBTZXRzIHJlc29sdXRpb24gdG8gc3RhdGUuXHJcbiAgICogQHBhcmFtIHttb21lbnR9IHN0YXJ0IFN0YXJ0IGRhdGUgZm9yIHRoZSB0aW1lYmFyXHJcbiAgICogQHBhcmFtIHttb21lbnR9IGVuZCBFbmQgZGF0ZSBmb3IgdGhlIHRpbWViYXJcclxuICAgKi9cclxuICBndWVzc1Jlc29sdXRpb24oc3RhcnQsIGVuZCkge1xyXG4gICAgaWYgKCFzdGFydCB8fCAhZW5kKSB7XHJcbiAgICAgIHN0YXJ0ID0gdGhpcy5wcm9wcy5zdGFydDtcclxuICAgICAgZW5kID0gdGhpcy5wcm9wcy5lbmQ7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkdXJhdGlvblNlY3MgPSBlbmQuZGlmZihzdGFydCwgJ3NlY29uZHMnKTtcclxuICAgIC8vICAgIC0+IDFoXHJcbiAgICBpZiAoZHVyYXRpb25TZWNzIDw9IDYwICogNjApIHRoaXMuc2V0U3RhdGUoe3Jlc29sdXRpb246IHt0b3A6ICdob3VyJywgYm90dG9tOiAnbWludXRlJ319KTtcclxuICAgIC8vIDFoIC0+IDNkXHJcbiAgICBlbHNlIGlmIChkdXJhdGlvblNlY3MgPD0gMjQgKiA2MCAqIDYwICogMykgdGhpcy5zZXRTdGF0ZSh7cmVzb2x1dGlvbjoge3RvcDogJ2RheScsIGJvdHRvbTogJ2hvdXInfX0pO1xyXG4gICAgLy8gMWQgLT4gMzBkXHJcbiAgICBlbHNlIGlmIChkdXJhdGlvblNlY3MgPD0gMzAgKiAyNCAqIDYwICogNjApIHRoaXMuc2V0U3RhdGUoe3Jlc29sdXRpb246IHt0b3A6ICdtb250aCcsIGJvdHRvbTogJ2RheSd9fSk7XHJcbiAgICAvLzMwZCAtPiAxeVxyXG4gICAgZWxzZSBpZiAoZHVyYXRpb25TZWNzIDw9IDM2NSAqIDI0ICogNjAgKiA2MCkgdGhpcy5zZXRTdGF0ZSh7cmVzb2x1dGlvbjoge3RvcDogJ3llYXInLCBib3R0b206ICdtb250aCd9fSk7XHJcbiAgICAvLyAxeSAtPlxyXG4gICAgZWxzZSB0aGlzLnNldFN0YXRlKHtyZXNvbHV0aW9uOiB7dG9wOiAneWVhcicsIGJvdHRvbTogJ3llYXInfX0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVuZGVyZXIgZm9yIHRvcCBiYXIuXHJcbiAgICogQHJldHVybnMge09iamVjdH0gSlNYIGZvciB0b3AgbWVudSBiYXIgLSBiYXNlZCBvZiB0aW1lIGZvcm1hdCAmIHJlc29sdXRpb25cclxuICAgKi9cclxuICByZW5kZXJUb3BCYXIoKSB7XHJcbiAgICBsZXQgcmVzID0gdGhpcy5zdGF0ZS5yZXNvbHV0aW9uLnRvcDtcclxuICAgIHJldHVybiB0aGlzLnJlbmRlckJhcih7Zm9ybWF0OiB0aGlzLnByb3BzLnRpbWVGb3JtYXRzLm1ham9yTGFiZWxzW3Jlc10sIHR5cGU6IHJlc30pO1xyXG4gIH1cclxuICAvKipcclxuICAgKiBSZW5kZXJlciBmb3IgYm90dG9tIGJhci5cclxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBKU1ggZm9yIGJvdHRvbSBtZW51IGJhciAtIGJhc2VkIG9mIHRpbWUgZm9ybWF0ICYgcmVzb2x1dGlvblxyXG4gICAqL1xyXG4gIHJlbmRlckJvdHRvbUJhcigpIHtcclxuICAgIGxldCByZXMgPSB0aGlzLnN0YXRlLnJlc29sdXRpb24uYm90dG9tO1xyXG4gICAgcmV0dXJuIHRoaXMucmVuZGVyQmFyKHtmb3JtYXQ6IHRoaXMucHJvcHMudGltZUZvcm1hdHMubWlub3JMYWJlbHNbcmVzXSwgdHlwZTogcmVzfSk7XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIG51bWJlciBvZiBwaXhlbHMgcGVyIHNlZ21lbnQgb2YgdGhlIHRpbWViYXIgc2VjdGlvbiAodXNpbmcgdGhlIHJlc29sdXRpb24pXHJcbiAgICogQHBhcmFtIHttb21lbnR9IGRhdGUgVGhlIGRhdGUgYmVpbmcgcmVuZGVyZWQuIFRoaXMgaXMgdXNlZCB0byBmaWd1cmUgb3V0IGhvdyBtYW55IGRheXMgYXJlIGluIHRoZSBtb250aFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXNvbHV0aW9uVHlwZSBUaW1lYmFyIHNlY3Rpb24gcmVzb2x1dGlvbiBbWWVhcjsgTW9udGguLi5dXHJcbiAgICogQHJldHVybnMge251bWJlcn0gVGhlIG51bWJlciBvZiBwaXhlbHMgcGVyIHNlZ21lbnRcclxuICAgKi9cclxuICBnZXRQaXhlbEluY3JlbWVudChkYXRlLCByZXNvbHV0aW9uVHlwZSwgb2Zmc2V0ID0gMCkge1xyXG4gICAgY29uc3Qge3N0YXJ0LCBlbmR9ID0gdGhpcy5wcm9wcztcclxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wcm9wcy53aWR0aCAtIHRoaXMucHJvcHMubGVmdE9mZnNldDtcclxuXHJcbiAgICBjb25zdCBzdGFydF9lbmRfbWluID0gZW5kLmRpZmYoc3RhcnQsICdtaW51dGVzJyk7XHJcbiAgICBjb25zdCBwaXhlbHNfcGVyX21pbiA9IHdpZHRoIC8gc3RhcnRfZW5kX21pbjtcclxuICAgIGZ1bmN0aW9uIGlzTGVhcFllYXIoeWVhcikge1xyXG4gICAgICByZXR1cm4geWVhciAlIDQwMCA9PT0gMCB8fCAoeWVhciAlIDEwMCAhPT0gMCAmJiB5ZWFyICUgNCA9PT0gMCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkYXlzSW5ZZWFyID0gaXNMZWFwWWVhcihkYXRlLnllYXIoKSkgPyAzNjYgOiAzNjU7XHJcbiAgICBsZXQgaW5jID0gd2lkdGg7XHJcbiAgICBzd2l0Y2ggKHJlc29sdXRpb25UeXBlKSB7XHJcbiAgICAgIGNhc2UgJ3llYXInOlxyXG4gICAgICAgIGluYyA9IHBpeGVsc19wZXJfbWluICogNjAgKiAyNCAqIChkYXlzSW5ZZWFyIC0gb2Zmc2V0KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnbW9udGgnOlxyXG4gICAgICAgIGluYyA9IHBpeGVsc19wZXJfbWluICogNjAgKiAyNCAqIChkYXRlLmRheXNJbk1vbnRoKCkgLSBvZmZzZXQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdkYXknOlxyXG4gICAgICAgIGluYyA9IHBpeGVsc19wZXJfbWluICogNjAgKiAoMjQgLSBvZmZzZXQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdob3VyJzpcclxuICAgICAgICBpbmMgPSBwaXhlbHNfcGVyX21pbiAqICg2MCAtIG9mZnNldCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ21pbnV0ZSc6XHJcbiAgICAgICAgaW5jID0gcGl4ZWxzX3Blcl9taW4gLSBvZmZzZXQ7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gTWF0aC5taW4oaW5jLCB3aWR0aCk7XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIFJlbmRlcnMgYW4gZW50aXJlIHNlZ21lbnQgb2YgdGhlIHRpbWViYXIgKHRvcCBvciBib3R0b20pXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlc29sdXRpb24gVGhlIHJlc29sdXRpb24gdG8gcmVuZGVyIGF0IFtZZWFyOyBNb250aC4uLl1cclxuICAgKiBAcmV0dXJucyB7T2JqZWN0W119IEEgbGlzdCBvZiBzZWN0aW9ucyAobWFraW5nIHVwIGEgc2VnbWVudCkgdG8gYmUgcmVuZGVyZWRcclxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gbGFiZWwgVGhlIHRleHQgZGlzcGxheWVkIGluIHRoZSBzZWN0aW9uICh1c3VhbGx5IHRoZSBkYXRlL3RpbWUpXHJcbiAgICogQHByb3BlcnR5IHtib29sZWFufSBpc1NlbGVjdGVkIFdoZXRoZXIgdGhlIHNlY3Rpb24gaXMgYmVpbmcgJ3RvdWNoZWQnIHdoZW4gZHJhZ2dpbmcvcmVzaXppbmdcclxuICAgKiBAcHJvcGVydHkge251bWJlcn0gc2l6ZSBUaGUgbnVtYmVyIG9mIHBpeGVscyB0aGUgc2VnbWVudCB3aWxsIHRha2UgdXBcclxuICAgKiBAcHJvcGVydHkge251bWJlcnxzdHJpbmd9IGtleSBLZXkgZm9yIHJlYWN0XHJcbiAgICovXHJcbiAgcmVuZGVyQmFyKHJlc29sdXRpb24pIHtcclxuICAgIGNvbnN0IHtzdGFydCwgZW5kLCBzZWxlY3RlZFJhbmdlc30gPSB0aGlzLnByb3BzO1xyXG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnByb3BzLndpZHRoIC0gdGhpcy5wcm9wcy5sZWZ0T2Zmc2V0O1xyXG5cclxuICAgIGxldCBjdXJyZW50RGF0ZSA9IHN0YXJ0LmNsb25lKCk7XHJcbiAgICBsZXQgdGltZUluY3JlbWVudHMgPSBbXTtcclxuICAgIGxldCBwaXhlbHNMZWZ0ID0gd2lkdGg7XHJcbiAgICBsZXQgbGFiZWxTaXplTGltaXQgPSA2MDtcclxuXHJcbiAgICBmdW5jdGlvbiBfYWRkVGltZUluY3JlbWVudChpbml0aWFsT2Zmc2V0LCBvZmZzZXRUeXBlLCBzdGVwRnVuYykge1xyXG4gICAgICBsZXQgb2Zmc2V0ID0gbnVsbDtcclxuICAgICAgd2hpbGUgKGN1cnJlbnREYXRlLmlzQmVmb3JlKGVuZCkgJiYgcGl4ZWxzTGVmdCA+IDApIHtcclxuICAgICAgICAvLyBpZiB0aGlzIGlzIHRoZSBmaXJzdCAnYmxvY2snIGl0IG1heSBiZSBjdXQgb2ZmIGF0IHRoZSBzdGFydFxyXG4gICAgICAgIGlmIChwaXhlbHNMZWZ0ID09PSB3aWR0aCkge1xyXG4gICAgICAgICAgb2Zmc2V0ID0gaW5pdGlhbE9mZnNldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb2Zmc2V0ID0gbW9tZW50LmR1cmF0aW9uKDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcGl4ZWxJbmNyZW1lbnRzID0gTWF0aC5taW4oXHJcbiAgICAgICAgICB0aGlzLmdldFBpeGVsSW5jcmVtZW50KGN1cnJlbnREYXRlLCByZXNvbHV0aW9uLnR5cGUsIG9mZnNldC5hcyhvZmZzZXRUeXBlKSksXHJcbiAgICAgICAgICBwaXhlbHNMZWZ0XHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBsYWJlbFNpemUgPSBwaXhlbEluY3JlbWVudHMgPCBsYWJlbFNpemVMaW1pdCA/ICdzaG9ydCcgOiAnbG9uZyc7XHJcbiAgICAgICAgbGV0IGxhYmVsID0gY3VycmVudERhdGUuZm9ybWF0KHJlc29sdXRpb24uZm9ybWF0W2xhYmVsU2l6ZV0pO1xyXG4gICAgICAgIGxldCBpc1NlbGVjdGVkID0gXy5zb21lKHNlbGVjdGVkUmFuZ2VzLCBzID0+IHtcclxuICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIGN1cnJlbnREYXRlLmlzU2FtZU9yQWZ0ZXIocy5zdGFydC5jbG9uZSgpLnN0YXJ0T2YocmVzb2x1dGlvbi50eXBlKSkgJiZcclxuICAgICAgICAgICAgY3VycmVudERhdGUuaXNTYW1lT3JCZWZvcmUocy5lbmQuY2xvbmUoKS5zdGFydE9mKHJlc29sdXRpb24udHlwZSkpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRpbWVJbmNyZW1lbnRzLnB1c2goe2xhYmVsLCBpc1NlbGVjdGVkLCBzaXplOiBwaXhlbEluY3JlbWVudHMsIGtleTogcGl4ZWxzTGVmdH0pO1xyXG4gICAgICAgIHN0ZXBGdW5jKGN1cnJlbnREYXRlLCBvZmZzZXQpO1xyXG4gICAgICAgIHBpeGVsc0xlZnQgLT0gcGl4ZWxJbmNyZW1lbnRzO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWRkVGltZUluY3JlbWVudCA9IF9hZGRUaW1lSW5jcmVtZW50LmJpbmQodGhpcyk7XHJcblxyXG4gICAgaWYgKHJlc29sdXRpb24udHlwZSA9PT0gJ3llYXInKSB7XHJcbiAgICAgIGNvbnN0IG9mZnNldCA9IG1vbWVudC5kdXJhdGlvbihjdXJyZW50RGF0ZS5kaWZmKGN1cnJlbnREYXRlLmNsb25lKCkuc3RhcnRPZigneWVhcicpKSk7XHJcbiAgICAgIGFkZFRpbWVJbmNyZW1lbnQob2Zmc2V0LCAnbW9udGhzJywgKGN1cnJlbnREdCwgb2Zmc3QpID0+IGN1cnJlbnREdC5zdWJ0cmFjdChvZmZzdCkuYWRkKDEsICd5ZWFyJykpO1xyXG4gICAgfSBlbHNlIGlmIChyZXNvbHV0aW9uLnR5cGUgPT09ICdtb250aCcpIHtcclxuICAgICAgY29uc3Qgb2Zmc2V0ID0gbW9tZW50LmR1cmF0aW9uKGN1cnJlbnREYXRlLmRpZmYoY3VycmVudERhdGUuY2xvbmUoKS5zdGFydE9mKCdtb250aCcpKSk7XHJcbiAgICAgIGFkZFRpbWVJbmNyZW1lbnQob2Zmc2V0LCAnZGF5cycsIChjdXJyZW50RHQsIG9mZnN0KSA9PiBjdXJyZW50RHQuc3VidHJhY3Qob2Zmc3QpLmFkZCgxLCAnbW9udGgnKSk7XHJcbiAgICB9IGVsc2UgaWYgKHJlc29sdXRpb24udHlwZSA9PT0gJ2RheScpIHtcclxuICAgICAgY29uc3Qgb2Zmc2V0ID0gbW9tZW50LmR1cmF0aW9uKGN1cnJlbnREYXRlLmRpZmYoY3VycmVudERhdGUuY2xvbmUoKS5zdGFydE9mKCdkYXknKSkpO1xyXG4gICAgICBhZGRUaW1lSW5jcmVtZW50KG9mZnNldCwgJ2hvdXJzJywgKGN1cnJlbnREdCwgb2Zmc3QpID0+IGN1cnJlbnREdC5zdWJ0cmFjdChvZmZzdCkuYWRkKDEsICdkYXlzJykpO1xyXG4gICAgfSBlbHNlIGlmIChyZXNvbHV0aW9uLnR5cGUgPT09ICdob3VyJykge1xyXG4gICAgICBjb25zdCBvZmZzZXQgPSBtb21lbnQuZHVyYXRpb24oY3VycmVudERhdGUuZGlmZihjdXJyZW50RGF0ZS5jbG9uZSgpLnN0YXJ0T2YoJ2hvdXInKSkpO1xyXG4gICAgICBhZGRUaW1lSW5jcmVtZW50KG9mZnNldCwgJ21pbnV0ZXMnLCAoY3VycmVudER0LCBvZmZzdCkgPT4gY3VycmVudER0LnN1YnRyYWN0KG9mZnN0KS5hZGQoMSwgJ2hvdXJzJykpO1xyXG4gICAgfSBlbHNlIGlmIChyZXNvbHV0aW9uLnR5cGUgPT09ICdtaW51dGUnKSB7XHJcbiAgICAgIGFkZFRpbWVJbmNyZW1lbnQobW9tZW50LmR1cmF0aW9uKDApLCAnbWludXRlcycsIChjdXJyZW50RHQsIG9mZnN0KSA9PiBjdXJyZW50RHQuYWRkKDEsICdtaW51dGVzJykpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRpbWVJbmNyZW1lbnRzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVuZGVycyB0aGUgdGltZWJhclxyXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFRpbWViYXIgY29tcG9uZW50XHJcbiAgICovXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3Qge2N1cnNvclRpbWV9ID0gdGhpcy5wcm9wcztcclxuICAgIGNvbnN0IHRvcEJhckNvbXBvbmVudCA9IHRoaXMucmVuZGVyVG9wQmFyKCk7XHJcbiAgICBjb25zdCBib3R0b21CYXJDb21wb25lbnQgPSB0aGlzLnJlbmRlckJvdHRvbUJhcigpO1xyXG4gICAgY29uc3QgR3JvdXBUaXRsZVJlbmRlcmVyID0gdGhpcy5wcm9wcy5ncm91cFRpdGxlUmVuZGVyZXI7XHJcblxyXG4gICAgLy8gT25seSBzaG93IHRoZSBjdXJzb3Igb24gMSBvZiB0aGUgdG9wIGJhciBzZWdtZW50c1xyXG4gICAgLy8gUGljayB0aGUgc2VnbWVudCB0aGF0IGhhcyB0aGUgYmlnZ2VzdCBzaXplXHJcbiAgICBsZXQgdG9wQmFyQ3Vyc29yS2V5ID0gbnVsbDtcclxuICAgIGlmICh0b3BCYXJDb21wb25lbnQubGVuZ3RoID4gMSAmJiB0b3BCYXJDb21wb25lbnRbMV0uc2l6ZSA+IHRvcEJhckNvbXBvbmVudFswXS5zaXplKVxyXG4gICAgICB0b3BCYXJDdXJzb3JLZXkgPSB0b3BCYXJDb21wb25lbnRbMV0ua2V5O1xyXG4gICAgZWxzZSBpZiAodG9wQmFyQ29tcG9uZW50Lmxlbmd0aCA+IDApIHRvcEJhckN1cnNvcktleSA9IHRvcEJhckNvbXBvbmVudFswXS5rZXk7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyY3Q5ay10aW1lYmFyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyY3Q5ay10aW1lYmFyLWdyb3VwLXRpdGxlXCIgc3R5bGU9e3t3aWR0aDogdGhpcy5wcm9wcy5sZWZ0T2Zmc2V0fX0+XHJcbiAgICAgICAgICA8R3JvdXBUaXRsZVJlbmRlcmVyIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyY3Q5ay10aW1lYmFyLW91dGVyXCIgc3R5bGU9e3t3aWR0aDogdGhpcy5wcm9wcy53aWR0aCwgcGFkZGluZ0xlZnQ6IHRoaXMucHJvcHMubGVmdE9mZnNldH19PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyY3Q5ay10aW1lYmFyLWlubmVyIHJjdDlrLXRpbWViYXItaW5uZXItdG9wXCI+XHJcbiAgICAgICAgICAgIHtfLm1hcCh0b3BCYXJDb21wb25lbnQsIGkgPT4ge1xyXG4gICAgICAgICAgICAgIGxldCB0b3BMYWJlbCA9IGkubGFiZWw7XHJcbiAgICAgICAgICAgICAgaWYgKGN1cnNvclRpbWUgJiYgaS5rZXkgPT09IHRvcEJhckN1cnNvcktleSkge1xyXG4gICAgICAgICAgICAgICAgdG9wTGFiZWwgKz0gYCBbJHtjdXJzb3JUaW1lfV1gO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gJ3JjdDlrLXRpbWViYXItaXRlbSc7XHJcbiAgICAgICAgICAgICAgaWYgKGkuaXNTZWxlY3RlZCkgY2xhc3NOYW1lICs9ICcgcmN0OWstdGltZWJhci1pdGVtLXNlbGVjdGVkJztcclxuICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjbGFzc05hbWV9IGtleT17aS5rZXl9IHN0eWxlPXt7d2lkdGg6IGludFRvUGl4KGkuc2l6ZSl9fT5cclxuICAgICAgICAgICAgICAgICAge3RvcExhYmVsfVxyXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJjdDlrLXRpbWViYXItaW5uZXIgcmN0OWstdGltZWJhci1pbm5lci1ib3R0b21cIj5cclxuICAgICAgICAgICAge18ubWFwKGJvdHRvbUJhckNvbXBvbmVudCwgaSA9PiB7XHJcbiAgICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9ICdyY3Q5ay10aW1lYmFyLWl0ZW0nO1xyXG4gICAgICAgICAgICAgIGlmIChpLmlzU2VsZWN0ZWQpIGNsYXNzTmFtZSArPSAnIHJjdDlrLXRpbWViYXItaXRlbS1zZWxlY3RlZCc7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBrZXk9e2kua2V5fSBzdHlsZT17e3dpZHRoOiBpbnRUb1BpeChpLnNpemUpfX0+XHJcbiAgICAgICAgICAgICAgICAgIHtpLmxhYmVsfVxyXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcblRpbWViYXIucHJvcFR5cGVzID0ge1xyXG4gIGN1cnNvclRpbWU6IFByb3BUeXBlcy5hbnksXHJcbiAgZ3JvdXBUaXRsZVJlbmRlcmVyOiBQcm9wVHlwZXMuZnVuYyxcclxuICBzdGFydDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCAvL21vbWVudFxyXG4gIGVuZDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCAvL21vbWVudFxyXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXHJcbiAgbGVmdE9mZnNldDogUHJvcFR5cGVzLm51bWJlcixcclxuICB0b3BfcmVzb2x1dGlvbjogUHJvcFR5cGVzLnN0cmluZyxcclxuICBib3R0b21fcmVzb2x1dGlvbjogUHJvcFR5cGVzLnN0cmluZyxcclxuICBzZWxlY3RlZFJhbmdlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksIC8vIFtzdGFydDogbW9tZW50ICxlbmQ6IG1vbWVudCAoZW5kKV1cclxuICB0aW1lRm9ybWF0czogUHJvcFR5cGVzLm9iamVjdFxyXG59O1xyXG5UaW1lYmFyLmRlZmF1bHRQcm9wcyA9IHtcclxuICBzZWxlY3RlZFJhbmdlczogW10sXHJcbiAgZ3JvdXBUaXRsZVJlbmRlcmVyOiAoKSA9PiA8ZGl2IC8+LFxyXG4gIGxlZnRPZmZzZXQ6IDAsXHJcbiAgdGltZUZvcm1hdHM6IGRlZmF1bHRUaW1lYmFyRm9ybWF0XHJcbn07XHJcbiJdfQ==