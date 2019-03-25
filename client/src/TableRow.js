// TableRow.js

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class TableRow extends Component {
 
  render() {
    return (
        <tr>
          <td>
            {this.props.index}
          </td>
          <td>
            {this.props.obj.title}
          </td>
          <td>
            {this.props.obj.status}
          </td>
          <td>
            {this.props.obj.tags.join(', ')}
          </td>
          <td>
            <a href={this.props.obj.link} target="_blank" rel="noopener noreferrer">link</a>
          </td>
          <td>
            <Link to={this.props.which+'/'+this.props.obj._id} className="btn btn-primary">Edit</Link>
          </td>
        </tr>
    );
  }
}

export default TableRow;