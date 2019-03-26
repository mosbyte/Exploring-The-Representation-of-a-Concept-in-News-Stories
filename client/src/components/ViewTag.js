import React, { Component } from 'react';

export default class ViewTag extends Component {
    componentDidUpdate() {
        // this.props.inputElement.current.focus();
      }
    render() {
        return (
                           
            <tr>
                <td>
                    {/* <Link to={this.props.URL+'/visualise/'+tag.text}>{tag.text}</Link> */}
                    {/* <button onClick={this.props.getTagDashBoard(tag.text)}>{tag.text}</button> */}
                    <button onClick={this.props.getTagDashBoard(this.props.text)}>{this.props.tag}</button>
                </td> 
                <td>
                {this.props.occurences}
                </td>
            </tr> 
                    
        )
    }
}