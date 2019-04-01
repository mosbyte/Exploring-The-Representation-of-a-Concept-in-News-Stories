import React, { Component } from 'react';
import axios from 'axios';

export default class VisualiseTopTags extends Component {

    // inputElement = React.createRef()

    constructor(props){
        super(props);
        this.setTags = this.setTags.bind(this);
        this.state = {
            tag: '',
            data: [],
            allTags:[]
        }
        this.handleInput = this.handleInput.bind(this);
        this.searchTag = this.searchTag.bind(this);
    }
    componentDidMount(){

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
    handleInput = e => {
        this.setState({tag: e.target.value}, this.searchTag); 
      }
      //search method for database
    searchTag(){
        // e.preventDefault();
        if(this.state.tag===''){
          axios.get(this.props.URL+'/categorised')
            .then(response => {
              this.setState({ data: response.data
            }, () => this.getTags());
            })
            .catch(function (error) {
              console.log(error);
            })
        }
        else{
          axios.get(this.props.URL+'/searchsimilar/'+this.state.tag)
            .then(response => {
              this.setState({ data: response.data }
            , () => this.getSimilarTags(this.state.tag));
            })
            .catch(function (error) {
              console.log(error);
            })
        }   
        
      }
    getSimilarTags(searchTag){
        var myTags = [];
        // eslint-disable-next-line
        this.state.data.map(function(object,i){ // eslint-disable-next-line
            if(object.tags.length !== 0){
                myTags.push(...object.tags)}
        });
        var similarTags = myTags.filter(function(element){
            if(element.includes(searchTag)) {
              return searchTag;
            }
          });
        this.countTagOccurences(similarTags)
    }
    getTags(){
        var myTags = [];
        // eslint-disable-next-line
        this.state.data.map(function(object,i){ // eslint-disable-next-line
            if(object.tags.length !== 0){
                // console.log(object.tags)
                myTags.push(...object.tags)}
        });
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
        console.log("COUNTS: "+counts['trump'])
        var keysSorted = Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]})
        var tagMap = []
        keysSorted.forEach(element => {
          const topTag = { 
            text: element,
            occurences: counts[element]
          }
          tagMap.push(topTag)
        });
        // console.log("KEY SORTED: "+keysSorted)
        this.setTags(tagMap);
       
    }
    setTags(tags) {
        console.log(tags)  
        this.setState({
            allTags: tags
        })
    }
    viewTag = selectedTag => {
        console.log(selectedTag)
        this.props.getTagDashBoard(selectedTag)
        // this.props.getTagDashBoard(selectedTag);
    }
    getTopTags= tag =>{
        return(  
            <tr>
                <td>
                    <button className="btn" onClick={() => this.viewTag(tag.text)}>{tag.text}</button>
                </td> 
                <td>
                    {tag.occurences}
                </td>
            </tr>     
        )
    }
    render() {
        const tags = this.state.allTags.slice(0, 20).map(this.getTopTags)
    
        return (
            <div style={{width: "25%", margin:10}}  className="borders">
                <h4>Top 20 {this.props.DBName} Tags</h4> 
                <form className="form-inline justify-content-center" onSubmit={this.searchTag}>
                    <input className="form-control mr-sm-2" onChange={this.handleInput} type="search" placeholder="tag (e.g religion)" aria-label="Search" ></input>
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit" >Search </button>
                </form>
                <table className="table" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                    {/* <th>#</th> */}
                    <th>Tag</th>
                    <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {tags}
                </tbody>
                </table> 
            </div> 
          
        )
    }
}
              