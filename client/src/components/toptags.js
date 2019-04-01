import React, { Component } from 'react';

export default class TopTags extends Component {

    addTag = selectedTag => {
        this.props.addTopTag(selectedTag)
        this.props.removeTopTag(selectedTag)
    }
    getTopFiveTags= tag =>{
        return(
            <div className="list-group-item">
                <a>{tag}</a>
                <div className="buttons" style={{float: 'right'}}>
                    <button className="btn btn-outline-success" onClick={() => this.addTag(tag)}>+</button>
                    <button className="btn btn-outline-danger" key={tag} onClick={() => this.props.removeTopTag(tag)}>-</button>
                </div>      
            </div>
        )
    }
    render() {
        var tags = this.props.tags.slice(0,5).map(this.getTopFiveTags)
        return (       
            <div className="list-group"> 
                {tags}
            </div>
        )
    }
}