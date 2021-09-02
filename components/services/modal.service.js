//mport invoiz from 'services/invoiz.service';
import React from 'react';
import ReactDOM from 'react-dom';
import ModalBaseComponent from './modal-base.component';

class ModalService {
	constructor() {
		const modalElement = document.createElement('div');
		modalElement.id = 'modal-component-wrapper';
		document.body.appendChild(modalElement);

		setTimeout(() => {
			this.modalBase = ReactDOM.render(
				React.createElement(ModalBaseComponent, {}),
				document.getElementById('modal-component-wrapper')
			);
		});
	}
	
	// handleOutsideClick = e => {
	// 	if (!this.node.contains(e.target)) this.handleClick();
	//   };
	open(content, options) {
		$('body').addClass('has-modal');

		if (options.isFullscreen) {
			$('body').addClass('fullscreen-modal');
		}

		this.modalBase.open(content, options);
	}

	close(isFromCancel) {
		this.modalBase.close(isFromCancel);
		setTimeout(() => {
			$('body').removeClass('has-modal').removeClass('fullscreen-modal');
		}, 300);
	}
}

export default new ModalService();
