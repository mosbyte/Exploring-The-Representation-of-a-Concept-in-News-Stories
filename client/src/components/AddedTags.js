import React, { Component } from 'react';

export default class AddedTags extends Component {

  createTags = tag => {
    return (
      <div className="list-group-item">
        <li>{tag.text}</li>
        <button className="button btn-danger" style={{float: "right"}}key={tag.key} onClick={() => this.props.removeTag(tag.key)}>
          X
        </button>
      </div>
    )
    
  }
  render() {
    const tagEntries = this.props.entries
    // let uniq = a => [...new Set(a)];
    const tags = tagEntries.map(this.createTags)
    return (
      <div>
        <ul className="list-group">{tags}</ul>
      </div>
    )
  }
}
              