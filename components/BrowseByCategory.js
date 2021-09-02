import React, { Component } from "react";
import axios from "axios";
import config from "../config";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Select from 'react-select'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import ReactStars from "react-rating-stars-component";

const language = localStorage.getItem('language');
const tenant_id = localStorage.getItem('cityId');

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 6,
    },
    tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 3,
    },
    mobilemedium: {
        breakpoint: { max: 768, min: 600 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 600, min: 0 },
        items: 1,
    },
};

class BrowseByCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            BrowseCategory: [],
            showImageData: true,
            category: "",
            OpenReview: false,
            starRating: "",
            selectedFile: null,
            comment: "",
            searchText: "",
            selectedOption: null
        };
        this.browseByCategory = this.browseByCategory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.activityOptions = [];
    }
    componentDidMount() {
        this.browseByCategory();
    }
    onCategorySelect(id) {
        window.open('search/?category=' + id, '_self');
    }

    browseByCategory() {
        axios.post(config.qidz.endpoints.homePageData + '?tenant_id=' + tenant_id + '&locale=' + language, {
            data: {},
            headers: {
                "accept": 'application/json'
            }
        })
            .then((response) => {
                console.log(response, 'responseresponseresponseresponse');
                this.setState({
                    BrowseCategory: response.data.parent_categories,
                    isFetching: false
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }
    oncategorySelect(id) {
        window.open('search/?parentcategory=' + id, '_self');
    }
    onOpenModalReview() {
        this.setState({
            OpenReview: true
        })
    }

    onCloseModalReview() {
        this.setState({
            OpenReview: false
        })
    }
    ratingChanged(newRating) {
        console.log(newRating, 1);
        this.setState({ starRating: newRating });
    }
    fileSelectedHandler(event) {
        this.setState({
            selectedFile: event.target.files[0],
        })
    }
    PostComment(event) {
        this.setState({
            comment: event.target.value
        })
    }
    addReview() {
        let body = {
            "image": this.state.selectedFile ? this.state.selectedFile.name : '',
            "content": this.state.comment ? this.state.comment : '',
            "stars": this.state.starRating ? this.state.starRating : '',
            "activityId": params.activityId,
            "authentication_token": localStorage.getItem('settoken')
        }
        axios.post(config.qidz.endpoints.addReviews, {
            data: body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.data.error != '') {
                    alert(response.data.error);
                    this.setState({ OpenReview1: false, starRatingForm2: '', comment: "" });
                } else {
                    alert('Thank you so much for leaving a review for this actvity. Keep an eye out for it as it will be published within 48 hours.');
                    this.setState({ OpenReview1: false });
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    searchResult(activity) {
        let body = { q: activity }
        axios.post(config.qidz.endpoints.search + '?tenantId=' + tenant_id + '&locale=' + language, {
            data: body
        })
            .then((response) => {
                response.data.activities.map((ac, i) => {
                    console.log(ac, 'ac');
                    this.activityOptions({ value: ac.id, label: ac.name })
                    // activityOptions = [
                    //     { value: 'chocolate', label: 'Chocolate' },
                    //     { value: 'strawberry', label: 'Strawberry' },
                    //     { value: 'vanilla', label: 'Vanilla' }
                    //   ]
                });
                // this.setState({
                //   searchResultData: response.data.activities,
                //   loaded: true
                // })
            })
            .catch((error) => {
                console.log(error);
            })
    }
    searchActivity(event) {
        alert(event.target.value);
        this.searchResult(event.target.value);
    }
    handleChange(event) {
        console.log(event)
        // this.setState(
        //   { selectedOption },
        //   () => console.log(`Option selected:`, this.state.selectedOption)
        // );
    };

    render() {
        console.log(this.activityOptions, ' this.activityOptions')
        const { selectedOption } = this.state;
        return (
            <section id="event_category" className="event_category browse_category">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div class="browse_main_heading center_heading text-center">
                                <h1>Browse By Category</h1>
                                <p>Lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam nonummy</p>
                            </div>
                            <div className="catergory-section">
                                <div className="category-data">

                                    <div className="category-carousel">
                                        {
                                            <Carousel responsive={responsive}>
                                                {
                                                    this.state.BrowseCategory.map(
                                                        (category, i) => (
                                                            <div key={i + 1} className="category-link">
                                                                <a href={`search/?parentcategory=${category.id}`} >
                                                                    <span class="cat_text_main">
                                                                        <span class="cat_text"> {category.name}
                                                                        </span>
                                                                        <span class="cat_icons">
                                                                        </span>
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        )
                                                    )
                                                }
                                            </Carousel>
                                        }
                                        <div class="reveiw_btn text-center">
                                            {/* <button type="button" onClick={() => this.onOpenModalReview()} >
                                                <div class="review btn_inner">
                                                    <ul>
                                                        <li><i class="fas fa-star"></i></li>
                                                        <li><i class="fas fa-star"></i></li>
                                                        <li><i class="fas fa-star"></i></li>
                                                        <li><i class="fas fa-star"></i></li>
                                                        <li><i class="fas fa-star"></i></li>
                                                    </ul>
                                                </div> Share with the community your review on an activity</button> */}
                                            <Modal open={this.state.OpenReview} onClose={() => this.onCloseModalReview()} center>
                                                <div className="reveiw_form_section">
                                                    <h3>Pick an activity</h3>
                                                    <span>...and let us know what you think of this activity</span>
                                                    <div className="review_inputs d-flex">
                                                        <label>The activity to review</label>
                                                        <div className="review">
                                                            <Select value={selectedOption} options={this.activityOptions} onChange={(e) => this.handleChange(e)} />
                                                        </div>
                                                        <span className="validate_msg">{this.state.reviewsRatingError ? this.state.reviewsRatingError : ''}</span>
                                                    </div>
                                                    <div className="review_inputs d-flex">
                                                        <label>Your Review:</label>
                                                        <div className="review">
                                                            <ReactStars
                                                                count={5}
                                                                onChange={this.ratingChanged}
                                                                size={20}
                                                                isHalf={true}
                                                                activeColor="#ffd700"
                                                            />
                                                        </div>
                                                        <span className="validate_msg">{this.state.reviewsRatingError ? this.state.reviewsRatingError : ''}</span>
                                                    </div>
                                                    <div className="review_inputs d-flex">
                                                        <label>Your Photos:</label>
                                                        <input
                                                            type="file"
                                                            onChange={(e) => this.fileSelectedHandler(e)}
                                                        />
                                                        <div className="upload_btn">Upload Now</div>
                                                    </div>
                                                    <div className="review_inputs d-flex">
                                                        <label>Your Message:</label>
                                                        <textarea id="comment" name="comment" onKeyUp={this.PostComment.bind(this)} placeholder="Type your message here..." />
                                                        <span className="validate_msg">{this.state.reviewsCommentError ? this.state.reviewsCommentError : ''}</span>
                                                    </div>
                                                    <div className="review_inputs d-flex">
                                                        <button type="button" onClick={() => this.addReview()}>Post Review</button>
                                                    </div>
                                                </div>
                                            </Modal>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}
export default BrowseByCategory;
