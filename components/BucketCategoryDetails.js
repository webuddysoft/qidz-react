import React, { Component } from "react";
import axios from "axios";
import Carousel from 'react-multi-carousel';
// import "react-multi-carousel/lib/styles.css";
// import config from "../config";

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};


class BucketCategoryDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adBanners: props.ad_banners,
            showImageData: true,
        };
    }
    onCategorySelect(id) {
        window.open('event-list/?bannerId=' + id, '_self');
    }
    componentDidMount() {
        this.adBanners();
    }
    adBanners() {
        const { adBanners } = this.state;
        let data = [];
        return adBanners.map((ad, j) => {
            const adUrl = ad.url.split('/');
            data.push({ bucket: ad.bucket, title: ad.title, image: ad.image, urlId: adUrl[4] })
            this.setState({ adBanners: data })
        });
    }

    render() {
        const { ad_banners } = this.props;
        let data = [];
        const adBanners =  ad_banners.map((ad, j) => {
            const adUrl = ad.url.split('/');
            data.push({ bucket: ad.bucket, title: ad.title, image: ad.image, urlId: adUrl[4] })
            //this.setState({ adBanners: data })
        });
        console.log(data,'adBannersadBanners');
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="ad_banner">
                        <div className="ad_banner_inner">
                            <div className="ad-banner">
                                <Carousel responsive={responsive} autoPlay={true} infinite={true} autoPlaySpeed={5000}>
                                    {
                                        data.map(
                                            (ad, i) => (
                                                <div key={i + 1} className="ad_image">
                                                    <a href={`event-list/?bannerId=`+ad.urlId}>
                                                        {/* {this.state.showImageData ? <div><p>{category.name}</p></div> : ''} */}
                                                        <img src={ad.image.replace('q_30', 'q_80')} alt="" />
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
export default BucketCategoryDetails;
