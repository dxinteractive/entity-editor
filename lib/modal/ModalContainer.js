"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModalContainer = function (_Component) {
    _inherits(ModalContainer, _Component);

    function ModalContainer(props) {
        _classCallCheck(this, ModalContainer);

        var _this = _possibleConstructorReturn(this, (ModalContainer.__proto__ || Object.getPrototypeOf(ModalContainer)).call(this, props));

        _this.promptOnYes = _this.promptOnYes.bind(_this);
        _this.promptOnNo = _this.promptOnNo.bind(_this);
        return _this;
    }

    _createClass(ModalContainer, [{
        key: "promptOnYes",
        value: function promptOnYes() {
            this.props.workflow.next("onYes", this.props.workflow.end);
        }
    }, {
        key: "promptOnNo",
        value: function promptOnNo() {
            this.props.workflow.next("onNo", this.props.workflow.end);
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                userConfig = _props.userConfig,
                task = _props.workflow.task,
                promptProps = _props.promptProps;


            var workflowTask = userConfig.getIn(['tasks', task]);
            var promptOpen = !!workflowTask && workflowTask.get('status') && workflowTask.get('statusStyle') == "modal";

            var promptDetails = null;

            if (promptOpen && workflowTask) {
                promptDetails = workflowTask.get('status')(promptProps);
            }

            var Prompt = userConfig.getIn(['components', 'prompt']);
            var PromptContent = userConfig.getIn(['components', 'promptContent']);

            return _react2.default.createElement(
                Prompt,
                _extends({}, promptDetails, {
                    open: promptOpen,
                    onYes: this.promptOnYes,
                    onNo: this.promptOnNo
                }),
                promptDetails && _react2.default.createElement(
                    PromptContent,
                    promptDetails,
                    promptDetails && promptDetails.message
                )
            );
        }
    }]);

    return ModalContainer;
}(_react.Component);

ModalContainer.propTypes = {
    workflow: _react.PropTypes.object,
    userConfig: _react.PropTypes.object.isRequired,
    promptProps: _react.PropTypes.object.isRequired
};

exports.default = ModalContainer;