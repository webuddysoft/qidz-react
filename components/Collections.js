import React, { Component } from "react";
import config from "../config";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
    },
    tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 3,
    },
    mobilemedium: {
        breakpoint: { max: 768, min: 600 },
        items: 3,
    },
    mobile: {
        breakpoint: { max: 600, min: 0 },
        items: 1,
    },
};

class Collections extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Collections: props.collectionData,
            staticLanguage:this.props.staticLanguage,
        };
    }
    onCollectionSelect(id) {
        window.open("event-list?collectionId=" + id, '_self');
    }
    onCollectionList(){
        window.open("collection-list", '_self');
    }
    // keydownHandler(e){
    //     if(e.keyCode===13 && e.ctrlKey) this.onCollectionList(e.keyCode)
    //   }
    // componentDidMount() {
    //     document.addEventListener('keydown', this.keydownHandler);
    // }
    // componentWillUnmount() {
    //     document.removeEventListener('keydown', this.keydownHandler);
    // }
    
    render() {
        const languageId=localStorage.getItem('languageId');
        const {staticLanguage}=this.state;
        const {collectionData}=this.props;
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="event_cat_section">
                        <div className="event_cat_section_inner">
                            <div className="events_main_heading">
                                <h1>{languageId===config.lang?staticLanguage.common.get_inspiration:'Get Inspiration For Your Next Outing'}</h1>
                                <a href="collection-list">{languageId===config.lang?staticLanguage.common.seeall:"See All"}</a>
                            </div>
                            <div className="event_cat_carousel">
                                <Carousel responsive={responsive} autoPlay={true} infinite={true} autoPlaySpeed={5000}>
                                    {
                                        collectionData.map(
                                            (collection, i) => (
                                                <div key = {i+1} className="event_image">
                                                    <a href={`event-list?collectionId=${collection.id}`}>
                                                        <img src={collection.avatar_url.replace('q_30','q_80')} alt="ad_01" />
                                                        <div className="event_heading yellow_bg">{collection.name}</div>
                                                    </a>
                                                </div>
                                            )
                                        )
                                    }
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Collections;
