import React, { Component } from 'react';
import axios from 'axios';

class Story extends Component {

  constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
    }
    delete() {
        axios.get('http://localhost:4000/chant/database/delete/'+this.props.obj._id)
            .then(console.log('Deleted'))
            .catch(err => console.log(err))
    }
  render() {
    return (
        <div>
            {/* <p>{this.props.obj.num}</p> */}
            <h3 className="content-width">
                <a href={this.props.obj.link}>{this.props.obj.title}</a>
            </h3>
            <h6>{this.props.obj.source} - {this.props.obj.published}</h6>
            <br></br>
            <h5 className="content-width">"{this.props.obj.contents}"</h5>
            <br></br>
            <br></br>
            <br></br> 
        </div>   
    );
  }
}

export default Story;