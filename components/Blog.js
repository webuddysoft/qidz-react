import React, { Component } from "react";
import axios from "axios";
import config from "../config";

class Blog extends Component {
    componentDidMount() {
        this.blog();
    }
    
      blog(){
        const headers = {
            'accept': 'application/json',
          }
        axios.get('http://qidz.mangoitsol.com/wp-json/qidz/v1/home_data/',{
            headers: headers
          })
        .then(function(response){
            console.log(response);
        })
        .catch(function(error){
            console.log(error);
        })
        .then(function(response){
            console.log(response);
        })
    }
    render() {
        return (
        <div id = "blog">
            <span>blog1</span>
            <span>blog2</span>
            <span>blog3</span>
            <span>blog4</span>
        </div>
       )
    }
}
export default Blog;
