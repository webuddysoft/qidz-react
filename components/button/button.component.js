import React from 'react';

class ButtonComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			callback: this.props.callback,
			disabled: !!this.props.disabled,
			loading: !!this.props.loading,
			label: this.props.label || null,
			subLabel: this.props.subLabel || null,
			type: this.props.type || 'primary',
			isWide: !!this.props.isWide,
			isWideNotFull: !!this.props.isWideNotFull,
			isSquare: !!this.props.isSquare,
			buttonIcon: this.props.buttonIcon || null,
			forceLoadingSpinner: !!this.props.forceLoadingSpinner,
			clicked: false,
			clickTriggered: false,
			focus: this.props.focus || false,
		};

		this.buttonRef = React.createRef();
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.focus && this.props.focus && this.buttonRef.current) {
			window.setTimeout(() => {
				this.buttonRef.current.focus();
			}, 100);
		}
	}

	componentWillReceiveProps(props) {
		let clicked = false;

		if (this.state.clickTriggered && !this.state.loading && props.loading) {
			clicked = true;
		}

		this.setState({
			callback: props.callback,
			disabled: !!props.disabled,
			loading: !!props.loading,
			label: props.label || null,
			subLabel: props.subLabel || null,
			type: props.type || 'primary',
			isWide: !!props.isWide,
			isWideNotFull: !!this.props.isWideNotFull,
			isSquare: !!props.isSquare,
			buttonIcon: props.buttonIcon || null,
			forceLoadingSpinner: !!this.props.forceLoadingSpinner,
			clicked,
			clickTriggered: false,
		});
	}

	componentWillUnmount() {
		this.isUnmounted = true;
	}

	render() {
		const buttonClasses = `button button-${this.state.type} ${!this.state.isSquare ? 'button-outline' : ''} ${
			this.state.isWide ? 'button-wide' : ''
		} ${this.state.isWideNotFull ? 'button-wide-not-full' : ''}`;

		let buttonIcon = this.state.buttonIcon ? (
			<div className={`icon ${this.state.loading ? 'loader_spinner' : this.state.buttonIcon}`} />
		) : null;

		if (this.state.clicked && this.state.loading && this.state.forceLoadingSpinner) {
			buttonIcon = <div className={`icon loader_spinner`} />;
		}

		const { id, dataQsId, customCssClass, wrapperClass } = this.props;

		return (
			<div className={`button-component-wrapper ${wrapperClass || ''}`}>
				<button
					className={`${buttonClasses} ${customCssClass || ''}`}
					disabled={this.state.disabled || this.state.loading}
					onClick={(event) => this.handleClick(event)}
					data-qs-id={dataQsId}
					id={id}
					ref={this.buttonRef}
				>
					{buttonIcon}

					<span className="text-content">
						<span>{this.state.label}</span>
						{this.state.subLabel ? <span className="sub-label">{this.state.subLabel}</span> : null}
					</span>
				</button>
			</div>
		);
	}

	handleClick(event) {
		this.setState(
			{
				clickTriggered: true,
			},
			() => {
				this.state.callback && this.state.callback(event);
			}
		);
	}
}

export default ButtonComponent;
