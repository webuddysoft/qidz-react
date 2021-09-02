import {Component} from "react";
import adImg from "../assets/images/home_ad.jpg";

class StaticWidget extends Component {
    render() {
        return (
            <section id="text-5" className="widget widget_text">			
                <div className="textwidget">
                    <section id="home_ad_section" className="home_ad">
                    <div className="container">
                        <div className="ad_main">
                        <div className="row">
                            <div className="col-md-7">
                            <div className="ad_content">
                            <h1>Travel with kids made easy:<br />
                            best airlines for families |<br />
                            HoneyKids Asia</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus</p>
                            <div><a className="ad_read_more">Learn More</a></div>
                            </div>
                            </div>
                            <div className="col-md-5">
                            <div className="home_ad_image"><img src={adImg} /></div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </section>
                </div>
            </section>
        )
    }
}
export default StaticWidget;