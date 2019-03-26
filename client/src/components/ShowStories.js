import React, { Component } from 'react';
import axios from 'axios';
import TableRow from '../TableRow'

export default class ShowStories extends Component {
    
    constructor(props){
      
        super(props);
        this.setTags = this.setTags.bind(this);
        this.state = {
            data: [],
            allTags:[]
        }
    }
    componentDidMount(){
        console.log("MY URL = "+ this.props.URL)
        axios.get(this.props.URL)
          .then(response => {
            this.setState({ 
              data: response.data
            }, () => this.getTags());
          })
          .catch(function (error) {
            console.log(error);
          })
    }
    componentDidUpdate(prevProps, prevState, snapshot){
      if(prevProps.location !== this.props.location){
        window.location.reload();
      }
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
        this.setState({
            allTags: tags
        })
    }
    getTagDashBoard(){

    }
    searchTag(e){
      if(this.state.tag===''){
        axios.get(this.URL+'/')
          .then(response => {
            this.setState({ news: response.data });
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      else{
        axios.get(this.URL+'/search/'+this.state.tag)
          .then(response => {
            this.setState({ news: response.data });
          })
          .catch(function (error) {
            console.log(error);
          })
      }   
      e.preventDefault();
    }
    tabRow(){
      var theEditPath = this.props.editPath
      var arr = this.props.stories
      return this.props.stories.map(function(object, i){
          return <TableRow obj={object} index={arr.indexOf(object)+1} key={i} which={theEditPath} />;
      });
    }
    render() {
        // const tags = this.state.allTags.slice(0, 20).map(this.getTopTags)
        return (
            <div>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Tags</th>
                      <th>Link</th>
                      <th colSpan="2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.tabRow() }
                  </tbody>
                </table>
            </div> 
          
        )
    }
}
              