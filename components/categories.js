import React, { Component } from "react";
import Carousel from 'react-multi-carousel';
// import { Carousel } from "react-responsive-carousel";

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
    },
};

class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Categories: this.props.parentCategoryData
        };
    }
    oncategorySelect(id) {
        window.open('search/?parentcategory=' + id, '_self');
    }

    render() {
        const { parentCategoryData } = this.props;
        return (
            <div>
                <div className="catergory-section">
                    <div className="category-data">
                        <div className="category-carousel">
                            {
                                <Carousel responsive={responsive} autoPlay={true} infinite={true} autoPlaySpeed={5000} >
                                    {
                                        parentCategoryData.map(
                                            (category, i) => (
                                                <div key={i + 1} className="category-link">
                                                    <a href={`search/?parentcategory=${category.id}`}>                                                       
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Categories;