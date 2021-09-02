import React from 'react'
import config from '../config'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment/moment'

class Search extends React.Component {
  constructor (props) {
    super(props)
    this.onHandleSearch = this.onHandleSearch.bind(this)
    this.state = {
      startDate: '',
      endDate: '',
      ages: this.props.homeData.ages,
      activity: '',
      day: '',
      ageFrom: '',
      ageTo: '',
      dateErrorMessage: '',
      ageFromErrorMessage: '',
      activityErrorMessage: '',
      staticLanguage: this.props.staticLanguage
    }
  }

  componentDidMount () {
    //this.cities();
  }

  // cities() {
  //   axios.get(config.qidz.endpoints.cities, {// + "?latitude=37.33233141&longitude=-122.0312186&ad_banners=true&tenant_id=1&locale='en'&level0=true", {
  //     data: {},
  //     headers: {
  //       "accept": 'application/json'
  //     }
  //   })
  //     .then((response) => {
  //       console.log(response, 'city');
  //       this.setState({
  //         cityData: response.data
  //       })
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }
  onHandleSearch () {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    let ageBetween = ''
    if (
      this.state.activity != '' &&
      this.state.ageFromErrorMessage === '' &&
        this.state.dateErrorMessage === ''
    ) {
      let startDate = this.state.startDate
        ? moment(this.state.startDate).format('YYYY-MM-DD')
        : ''
      let endDate = this.state.endDate
        ? moment(this.state.endDate).format('YYYY-MM-DD')
        : ''
      if (this.state.ageFrom && this.state.ageTo) {
        ageBetween = this.rangeBetween(
          parseInt(this.state.ageFrom),
          parseInt(this.state.ageTo)
        )
      }

      const languageId = localStorage.getItem('languageId')
      window.open(
        '/' +
          languageId +
          '/search/?activity=' +
          this.state.activity +
          '&startDate=' +
          startDate +
          '&endDate=' +
          endDate +
          '&day=' +
          this.state.day +
          '&age=' +
          ageBetween, // + '&city=' + this.state.city
        '_self'
      )
    } else {
      if (this.state.activity === '') {
        this.setState({
          activityErrorMessage:
            languageId === config.lang
              ? staticLanguage.common.activity_error
              : 'Please enter activity'
        })
      } else {
        this.setState({ activityErrorMessage: '' })
      }
    }
  }
  rangeBetween (start, end) {
    if (start > end) {
      var arr = new Array(start - end + 1)
      for (var i = 0; i < arr.length; i++, start--) {
        resarrult[i] = start
      }
      return arr
    } else {
      var arro = new Array(end - start + 1)

      for (var j = 0; j < arro.length; j++, start++) {
        arro[j] = start
      }
      console.log(arro)
      return arro
    }
  }
  searchActivity (event) {
    this.setState({ activity: event.target.value, activityErrorMessage: '' })
  }
  onchangeDay (event) {
    this.setState({ day: event.target.value })
  }

  onchangeAgeFrom (event) {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    if (parseInt(event.target.value) > parseInt(this.state.ageTo)) {
      this.setState({
        ageFrom: event.target.value,
        ageFromErrorMessage:  (languageId === config.lang
          ? staticLanguage.common.fromAge_error
          : 'From age must be less than to age')
      })
    } else {
      this.setState({ ageFrom: event.target.value, ageFromErrorMessage: '' })
    }
  }
  onchangeAgeTo (event) {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    if (this.state.ageFrom.length == 0) {
      this.setState({
        ageTo: event.target.value,
        ageFromErrorMessage:  (languageId === config.lang
          ? staticLanguage.common.select_age
          : 'Please select from age')
      })
    }
    if (parseInt(this.state.ageFrom) > parseInt(event.target.value)) {
      this.setState({
        ageTo: event.target.value,
        ageFromErrorMessage:  (languageId === config.lang
          ? staticLanguage.common.toAge_error
          :'To age must be greater than from age')
      })
    } else {
      this.setState({ ageTo: event.target.value, ageFromErrorMessage: '' })
    }
  }

  setStartDate (date) {
    this.setState({ startDate: date })
  }
  setEndDate (date) {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    if (this.state.startDate == '') {
      this.setState({ dateErrorMessage:  (languageId === config.lang
        ? staticLanguage.common.startDate_error
        : 'Please select start date') })
      return false
    } else if (this.state.startDate && this.state.startDate > date) {
      this.setState({
        dateErrorMessage:  (languageId === config.lang
          ? staticLanguage.common.start_date
          : 'Start date is not greater than end date')
      })
      return false
    } else {
      this.setState({ endDate: date, dateErrorMessage: '' })
    }
  }

  render () {
    const languageId = localStorage.getItem('languageId')
    const { staticLanguage } = this.state
    return (
      <div id='home-filter'>
        <div className='hf_outer'>
          <div className='hf_inner'>
            <h1>
              {languageId === config.lang
                ? staticLanguage.common.find_out
                : 'Find the best around town'}
            </h1>
            <form>
              <div className='row'>
                <div className='col-md-12 serah_form_field'>
                  <img
                    className='search_filed_ic'
                    src='/wp-content/themes/wpreactqidz/assets/images/search_ic.png'
                  />
                  <input
                    type='text'
                    className='form-control search_field'
                    id='formGroupExampleInput'
                    onChange={e => this.searchActivity(e)}
                    placeholder={
                      languageId === config.lang
                        ? staticLanguage.common.search_for_activity
                        : 'Search for Activity...'
                    }
                  />
                  <button
                    type='button'
                    className='search_btn'
                    onClick={() => this.onHandleSearch()}
                  >
                    {languageId === config.lang
                      ? staticLanguage.datepicker.search
                      : 'Search'}
                  </button>
                  <span
                    className={`errorMessage  alert-danger ${
                      this.state.activityErrorMessage != '' ? 'alert' : ''
                    }`}
                  >
                    {this.state.activityErrorMessage}
                  </span>
                </div>
              </div>
              <div className='row hf_bottom_filter'>
                <div className='col-md-3'>
                  <div className='form-group'>
                    <select
                      defaultValue={'DEFAULT'}
                      className='form-control'
                      onChange={e => this.onchangeDay(e)}
                    >
                      <option value='DEFAULT'>
                        {languageId === config.lang
                          ? staticLanguage.form.when
                          : 'When'}
                      </option>
                      <option value='today'>
                        {languageId === config.lang
                          ? staticLanguage.home.today
                          : 'Today'}
                      </option>
                      <option value='tomorrow'>
                        {languageId === config.lang
                          ? staticLanguage.home.tomorrow
                          : 'Tomorrow'}
                      </option>
                      <option value='this_weekend'>
                        {languageId === config.lang
                          ? staticLanguage.home.this_weekend
                          : 'This Weekend'}
                      </option>
                    </select>
                  </div>
                </div>
                <div className='col-md-5'>
                  <div className='form-group date_main'>
                    <div className='input-group date col-md-6'>
                      <DatePicker
                        name='datetimepicker1'
                        onChange={date => this.setStartDate(date)}
                        selected={
                          this.state.startDate ? this.state.startDate : ''
                        }
                        dateFormat='d-MM-yyyy'
                        placeholderText={
                          languageId === config.lang
                            ? staticLanguage.shared.amount.from
                            : 'From'
                        }
                      />
                      <span className='errorMessage alert alert-danger'>
                        {this.state.dateErrorMessage}
                      </span>
                    </div>
                    <div className='input-group date col-md-6'>
                      <DatePicker
                        name='datetimepicker2'
                        onChange={date => this.setEndDate(date)}
                        selected={this.state.endDate ? this.state.endDate : ''}
                        dateFormat='d-MM-yyyy'
                        placeholderText={
                          languageId === config.lang
                            ? staticLanguage.shared.amount.to
                            : 'To'
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className='col-md-5'>
                  <div class='form-group date_main'>
                    <div class='input-group date col-md-6'>
                      <select
                        class='form-control'
                        onChange={e => this.onchangeAgeFrom(e)}
                      >
                        <option value='DEFAULT' selected=''>
                          {languageId === config.lang
                            ? staticLanguage.common.from_age
                            : 'Age From'}
                        </option>
                        {this.state.ages.map(age => (
                          <option value={age}>{age}</option>
                        ))}
                      </select>
                      <span className='errorMessage alert alert-danger'>
                        {this.state.ageFromErrorMessage}
                      </span>
                    </div>
                    <div class='input-group date col-md-6'>
                      <select
                        class='form-control'
                        onChange={e => this.onchangeAgeTo(e)}
                      >
                        <option value='DEFAULT' selected=''>
                          {languageId === config.lang
                            ? staticLanguage.common.to_age
                            : 'Age To'}
                        </option>
                        {this.state.ages.map(age => (
                          <option value={age}>{age}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* <div className="col-md-2">
                  <div className="form-group">
                    <select defaultValue={'DEFAULT'} className="form-control" onChange={(e) => this.onchangeCity(e)}>
                      <option value="DEFAULT">Select City</option>
                      {
                        this.state.cityData && this.state.cityData.map(
                          (cities, i) => (
                            <option value={cities.id}>{cities.name}</option>
                          )
                        )
                      }
                    </select>
                    <span className="errorMessage alert alert-danger">{this.state.cityErrorMessage}</span>
                  </div>
                </div> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Search
