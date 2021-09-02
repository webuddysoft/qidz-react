import React, { Component } from "react";
import ModalService from "./services/modal.service";
import config from "../config";

const language = localStorage.getItem('language');
const tenant_id = localStorage.getItem('cityId');

class MyWalletModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            wallet: localStorage.getItem('wallet_balance'),
            staticLanguage:this.props.staticLanguage,
            cityId: localStorage.getItem('cityId'),
            language: localStorage.getItem('lang') ? JSON.parse(localStorage.getItem('lang')) : "",
            languageId: localStorage.getItem('languageId'),
        }
    }

    render() {
        const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    const currency = localStorage.getItem('currency')
    ? localStorage.getItem('currency')
    : 'AED'
        return (
            <div className="reveiw_form_section">
                <span className="icon icon-close" onClick={(e) => ModalService.close(true)}><svg width="28" height="28" viewBox="0 0 36 36" data-testid="close-icon"><path d="M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z"></path></svg></span>
                <h3>
                {languageId === config.lang
                                ? staticLanguage.common.available_credit
                                : 'Available Credit'}
                </h3>
                <span className="thankyouMessage">{currency} {this.state.wallet}</span>
                <div>
                    <span>
                        {currency} {this.state.wallet}  {languageId === config.lang
                                ? staticLanguage.common.first_purchase
                                : 'off your first purchase'}
                    </span>
                </div>
            </div>
        );
    }
}
export default MyWalletModal;