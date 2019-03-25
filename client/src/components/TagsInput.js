import React, { Component } from 'react';

export default class TagInput extends Component {
    componentDidUpdate() {
        this.props.inputElement.current.focus()
      }
    render() {
        return (
                           
                <form className="form-inline justify-content-center bg-secondary">
                    <input
                        placeholder="Tag"
                        type="text"
                        className="input"
                        ref={this.props.inputElement}
                        value={this.props.currTag.text}
                        onChange={this.props.handleInput}
                        minLength="2"
                    />
                    <button className="button" onClick={this.props.addTag}>Add Tag</button>
                </form>
                    
        )
    }
}