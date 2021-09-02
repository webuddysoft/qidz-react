import React from 'react';
import _ from 'lodash';
import ModalService from './modal.service';
import ButtonComponent from '../button/button.component';
import * as $ from "jquery";

// import TextInputExtendedComponent from '../inputs/text-input-extended/text-input-extended.component';

const DEFAULT_OPTIONS = {
	customHeadline: null,
	customFooter: null,
	closeOnEscape: true,
	confirmButtonType: 'primary',
	confirmLabel: '',
	confirmIcon: '',
	cancelLabel: '',
	isCloseable: false,
	isCloseableViaOverlay: false,
	isFullscreen: false,
	loadingOnConfirmUntilClose: false,
	headline: '',
	modalClass: '',
	width: 500,
	resizePopupOnWindowResize: false,
	padding: null,
	onCancel: null,
	onConfirm: null,
	afterClose: () => {
		return;
	},
	afterOpen: () => {
		return;
	},
};

class ModalBaseComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			content: null,
			confirmDisabled: false,
			loading: false,
			options: DEFAULT_OPTIONS,
			viewportHeight: window.innerHeight,
			inputFieldValue: '',
			focusConfirm: false,
		};

		this.debounceResize = null;
		this.resizeInterval = null;
		this.handleResize = this.handleResize.bind(this);
		this.contentRef = React.createRef();
	}

	componentDidUpdate(prevProps) {
		if (this.props.confirmDisabled !== prevProps.confirmDisabled) {
			this.setState({ confirmDisabled: !!this.props.confirmDisabled });
		}
	}

	handleCloseOnEscape(event) {
		if (event.key === 'Escape' || event.keyCode === 27) {
			ModalService.close();
		}
	}

	render() {
		const { options, viewportHeight, inputFieldValue } = this.state;

		const style = {
			width: options.width || 'auto',
			padding: options.padding,
			borderRadius: options.borderRadius || '3px',
		};

		if (options.noTransform) {
			style.transform = 'none';
		}

		if (options.forceLoadingSpinner && this.state.loading) {
			options.confirmIcon = 'icon loader_spinner';
		}

		const footer = options.customFooter ? (
			options.customFooter
		) : options.cancelLabel || options.confirmLabel ? (
			<div className="modal-base-footer">
				{options.cancelLabel ? (
					<div className="modal-base-cancel">
						<ButtonComponent
							type="cancel"
							loading={this.state.loading}
							callback={() => {
								if (this.state.options.onCancel) {
									if (this.state.options.loadingOnConfirmUntilClose) {
										this.setState({ loading: true });
									}

									this.state.options.onCancel();
								} else {
									ModalService.close(true);
								}
							}}
							label={options.cancelLabel}
							dataQsId="modal-btn-cancel"
						/>
					</div>
				) : null}
				{options.confirmLabel ? (
					<div className="modal-base-confirm">
						<ButtonComponent
							focus={this.state.focusConfirm}
							buttonIcon={options.confirmIcon}
							loading={this.state.loading}
							type={options.confirmButtonType}
							disabled={options.confirmDisabled || this.state.confirmDisabled}
							callback={() => this.onConfirm()}
							label={options.confirmLabel}
							dataQsId="modal-btn-confirm"
						/>
					</div>
				) : null}
			</div>
		) : null;

		let modalWrapperClass = `modal-base ${options.modalClass} ${this.state.open ? 'modal-base-show' : ''} ${
			!footer ? 'no-footer' : ''
		}`;

		if ($('.modal-base-view')[0] && options.resizePopupOnWindowResize) {
			const modalMarginTop = parseInt($('.modal-base-view').css('margin-top'));
			const modalHeight = $('.modal-base-view').height();

			if (modalHeight >= viewportHeight - modalMarginTop - 100) {
				modalWrapperClass += ' resized';
				$('.modal-base-view').height(viewportHeight - modalMarginTop - 100);
			} else {
				$('.modal-base-view').height('auto');
			}
		}

		return options.isFullscreen ? (
			<div className="modal-fullscreen">
				{options.isCloseable ? (
					<div className="modal-fullscreen-close" onClick={() => ModalService.close(true)} />
				) : null}

				{this.state.content}
			</div>
		) : (
			<div className={modalWrapperClass}>
				<div className="modal-base-overlay" onClick={() => this.onOverlayClick()} />
				<div className="modal-base-view" style={style}>
					{options.headline ? (
						<div className="modal-base-headline">{options.headline}</div>
					) : (
						options.customHeadline
					)}

					<div className="modal-base-content" ref={this.contentRef}>
						{this.state.content}
					</div>

					{/* {options.inputFieldOptions ? (
						<div>
							<TextInputExtendedComponent
								value={inputFieldValue}
								placeholder={options.inputFieldOptions.placeholder || ''}
								onChange={(val) =>
									this.setState({
										inputFieldValue: val,
										confirmDisabled: !val || val.trim().length === 0,
									})
								}
							/>
						</div>
					) : null} */}

					{options.noFooter ? null : footer}

					{options.isCloseable ? (
						<div className="modal-base-close" onClick={() => ModalService.close(true)} />
					) : null}
				</div>
			</div>
		);
	}

	handleResize() {
		clearTimeout(this.debounceResize);
		window.clearInterval(this.resizeInterval);

		this.debounceResize = setTimeout(() => {
			this.setState({ viewportHeight: window.innerHeight }, () => {
				setTimeout(() => {
					this.setState({ viewportHeight: window.innerHeight });
				}, 0);
			});

			this.resizeInterval = setInterval(() => {
				this.setState({ viewportHeight: window.innerHeight });
			}, 1000);
		}, 300);
	}

	conentHasFormElements() {
		const content = this.contentRef.current;
		const formElements = ['input', 'button', 'select', 'textarea', '.selectInput'];

		if (content) {
			formElements.forEach((formElement) => {
				if (content.querySelector(formElement)) {
					return true;
				}
			});
		}
	}

	open(content, opts) {
		const options = _.assign({}, DEFAULT_OPTIONS, opts || {});
		let confirmDisabled = false;

		//window.addEventListener('resize', this.handleResize);
		this.handleResize();

		if (options.closeOnEscape) {
			//document.addEventListener('keydown', this.handleCloseOnEscape);
		}

		if (options.inputFieldOptions) {
			confirmDisabled = true;
		}

		this.setState({ content, options, confirmDisabled }, () => {
			setTimeout(() => {
				this.setState({ open: true }, () => {
					setTimeout(() => {
						this.state.options.afterOpen();
					}, 100);

					$('.modal-base-view').scrollTop(0);

					if (
						(!options.inputFieldOptions || _.isString(content) || !this.conentHasFormElements()) &&
						options.confirmLabel
					) {
						this.setState({ focusConfirm: true });
					}
				});
			}, 250);
		});
	}

	close(isFromCancel) {
		const options = this.state.options;

		window.removeEventListener('resize', this.handleResize);
		window.clearInterval(this.resizeInterval);

		if (options.closeOnEscape) {
			document.removeEventListener('keydown', this.handleCloseOnEscape);
		}

		if (options.loadingOnConfirmUntilClose) {
			this.setState({ loading: false });
		}

		this.setState({ open: false }, () => {
			options.afterClose(isFromCancel);

			setTimeout(() => {
				this.setState({ content: null, options: DEFAULT_OPTIONS, inputFieldValue: '', focusConfirm: false });
			}, 250);
		});
	}

	onConfirm() {
		if (this.state.options.onConfirm) {
			if (this.state.options.loadingOnConfirmUntilClose) {
				this.setState({ loading: true });
			}

			this.state.options.onConfirm(this.state.inputFieldValue);

			setTimeout(() => {
				this.setState({ inputFieldValue: '' });
			}, 250);
		}
	}

	onOverlayClick() {
		if (this.state.options.isCloseableViaOverlay) {
			if (this.state.options.loadingOnConfirmUntilClose) {
				this.setState({ loading: false });
			}

			ModalService.close(true);
		}
	}
}

export default ModalBaseComponent;
