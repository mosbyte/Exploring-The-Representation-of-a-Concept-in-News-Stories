import React, { Component } from 'react';
import axios from 'axios';

export default class TopTags extends Component {
    constructor(props){
        super(props);
        this.setTags = this.setTags.bind(this);
        this.state = {
            data: [],
            allTags:[]
        }
    }
    componentDidMount(){
        // axios.get('http://localhost:4000/news/toptags')
        console.log("FOR TOP TAGS COMPOENT "+this.props.URL)
        axios.get(this.props.URL+'/categorised')
          .then(response => {
            this.setState({ 
              data: response.data
            }, () => this.getTags());
          })
          .catch(function (error) {
            console.log(error);
          })
    }
    getTags(){
        var myTags = [];
        // eslint-disable-next-line
        this.state.data.map(function(object,i){
            if(object.tags.length !== 0){
                // console.log(object.tags)
                myTags.push(...object.tags)            }
        })
        this.countTagOccurences(myTags)
    }
    countTagOccurences(tags) {
        // var counts = {};
        var counts = {}
        var i;
        var value;
        // tags.sort()
        for (i = 0; i < tags.length; i++) {
            if( tags[i]!=='skipped'){
                value = tags[i];
                if (typeof counts[value] === "undefined") {
                    counts[value] = 1;
                } else {
                    counts[value]++;
                }
            }
        }
        // var map = Object.entries(counts)
        // console.log(counts)
        var keysSorted = Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]})
        console.log(keysSorted)
        this.setTags(keysSorted);
        // const tags = [...this.state.tags]
        // this.sortedTags = tags.map(x => x.text)
        // console.log(this.sortedTags)

    }
    removeTag = selectedTag => {
        const filteredtags = this.state.allTags.filter(tag => {
          return tag !== selectedTag
        })
        this.setState({
          allTags: filteredtags    
        })
        // console.log(this.state.tags);
    }
    addTag = selectedTag => {
        this.props.addTopTag(selectedTag)
        this.removeTag(selectedTag)
    }
    setTags(tags) {    
        this.setState({
            allTags: tags
        })
    }
    getTopFiveTags= tag =>{

        return(
            <div className="list-group-item">
                <li>{tag}</li>
                <div className="buttons" style={{float: 'right'}}>
                    <button className="btn btn-outline-success" onClick={() => this.addTag(tag)}>
                    +
                    </button>
                    <button className="btn btn-outline-danger" key={tag} onClick={() => this.removeTag(tag)}>
                    -
                    </button>
                </div>
                
            </div>
        )
    }
    render() {
        const tags = this.state.allTags.slice(0, 5).map(this.getTopFiveTags)
        return (       
            <div className="list-group"> 
                {tags}
            </div>
        )
    }
}