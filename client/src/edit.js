import React, { Component } from 'react';
import axios from 'axios';
import TopTags from './components/toptags'
import TagInput from './components/TagsInput'
import AddedTags from './components/AddedTags'

export default class Edit extends Component {
  
    inputElement = React.createRef()

    constructor(props) {
        super(props);
        if(this.props.match.params.which === 'chant'){ this.URL = '/chantnews'} 
        else if(this.props.match.params.which === 'ritual'){this.URL = '/ritualnews'}
        this.setUpTags = this.setUpTags.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.setStates = this.setStates.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
          potentialTags: [],
          allTags: [],
          data: [],
          multiTag: [],
          tags: [],
          currTag: {
            text: '',
            key: ''
          }
        };
      }
      componentDidMount(){
        var id =this.props.match.params.id
          axios.get(this.URL+'/edit/'+id)
          .then(response => {
            this.setState({ 
              id: response.data._id,
              title: response.data.title,
              contents: response.data.contents,
              published: response.data.published,
              source: response.data.source,
              link: response.data.link,
              prev_tags: response.data.tags
            }, this.addPrevioustags, this.tagSuggestionsFromInput);
          })
          .catch(function (error) {
            console.log("IT NEVER RECEIVED")
            console.log(error);
          })
          document.addEventListener('keydown', this.handleKeyPress);
      }
      componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.location !== this.props.location){
          window.location.reload();
        }
      }
      tagSuggestionsFromInput(){
        var tags = this.state.tags;
        if(tags.length===0){
            console.log("FOR TOP TAGS COMPOENT "+this.URL)
            axios.get(this.URL+'/categorised')
            .then(response => {
                this.setState({ 
                data: response.data, 
                multiTag: []
                }, () => this.getTags());
            })
            .catch(function (error) {
                console.log(error);
            })
        }else{
            console.log("TEST")
            var multi_tags = tags.map(x => x.text)
            axios.get(this.URL+'/search/multitag/'+multi_tags)
            .then(response => {
                this.setState({ 
                data: response.data,
                multiTag: multi_tags
                }, () => this.getTags());
            })
            .catch(function (error) {
                console.log(error);
            })
        }     
      }
      getTags(){
        var myTags = [];
        this.state.data.map(function(object,i){
            if(object.tags.length !== 0){
                myTags.push(...object.tags)              
            }
        })
        // this.collectPotentialTags()
        this.countTagOccurences(myTags)
      }

      countTagOccurences(tags) {
          var counts = {}
          var i;
          var value;
          var multiTags = this.state.multiTag
          var unique = tags.filter(function(obj) { return multiTags.indexOf(obj) == -1; });
          console.log("unique!!"+unique)
          for (i = 0; i < unique.length; i++) {
              if( unique[i]!=='skipped'){
                  value = unique[i];
                  if (typeof counts[value] === "undefined") {
                      counts[value] = 1;
                  } else {
                      counts[value]++;                          
                  }
              }
          }
          
          var keysSorted = Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]})
          console.log(keysSorted)
          this.setTags(keysSorted);
      }
      setTags(tags) {    
        this.setState({
            allTags: tags
        })
      }
      collectPotentialTags = () => {
        var contents = this.cleanStoryText(this.state.contents)
        var title = this.cleanStoryText(this.state.title)
        var source = this.cleanStoryText(this.state.source)
        var allText = contents + title + source
        var words = allText.split(" ");
        this.setState({
          potentialTags: words
        })
        console.log(words)
      }
      cleanStoryText = (str) => {
        var removeChars = str.replace(/[,\/#"!$%\^&\*;:{}=\-_`~()]/g,"");
        removeChars = removeChars.replace(/[.]/g, " ")
        removeChars = removeChars.replace(/\s{2,}/g," ");
        return removeChars.toLowerCase()
      }
      handleKeyPress = e => {
   
        var updateKeyNum = 85; //u
        if (e.altKey && e.keyCode === updateKeyNum) {
          this.onSubmit(e);
        }
      }
      handleInput = e => {
        var delimiters = [","];
        const itemText = e.target.value.toLowerCase();
        console.log(itemText)
        const currTag = { 
          text: itemText,
          key: Date.now()
        }
        if(delimiters.includes(itemText.slice(-1))){
          this.addTag(e)
        } else{
          this.setState({
            currTag
          })
        } 
      }
    
      addTag = e => {
        e.preventDefault()
        var currTag = this.state.currTag;
        const newTag = { 
            text: currTag.text.toLowerCase().replace(/\s/g,''),
            key: currTag.key
          }
        // newTag = newTag.text.toLowerCase().replace(/\s/g,'');
        if (newTag.text !== "") {
          console.log(newTag)
          const tags = [...this.state.tags, newTag]
          this.setState({
            tags: tags, 
            currTag: {
              text: "",
              key: "" 
            }
          }, this.tagSuggestionsFromInput)
          console.log(this.state.tags)
        }
        console.log(this.state.tags)
      }
      addTopTag = tag => {
        const topTag = { 
          text: tag,
          key: Date.now()
        }
        console.log(topTag)
        const tags = [...this.state.tags, topTag]
        this.setState({
          tags: tags
        }, this.tagSuggestionsFromInput)
        console.log(this.state.tags)
      }
      removeTopTag = selectedTag => {
        const filteredtags = this.state.allTags.filter(tag => {
          return tag !== selectedTag
        })
        this.setState({
          allTags: filteredtags    
        })
      }
      removeTag = tag => {
        const filteredtags = this.state.tags.filter(item => {
          return item.key !== tag
        })
        this.setState({
          tags: filteredtags    
        }, this.tagSuggestionsFromInput)
        console.log(this.state.tags);
      }
      addPrevioustags = () =>{
        var xx = this.state.prev_tags;
        var prevTags = []
        xx.forEach(element => {
          const prevTag = { 
            text: element,
            key: Date.now() + xx.indexOf(element)
          }
          prevTags.push(prevTag);
        });
        this.setState({tags: prevTags},);
      }
      setUpTags() {
        const tags = [...this.state.tags]
        var arr_tags = tags.map(x => x.text)
        this.setState({
          valid_tags: arr_tags 
        }, () => {this.setStates('categorised')});        
      }
  
      setStates(statusOfStory) {
        var curr_date = Date.now()
        
        if(statusOfStory==="categorised"){
          var tags = this.state.valid_tags
        }
        this.setState({
          date: curr_date,
          valid_tags: tags,
          status: statusOfStory,
        }, () => {this.submitChanges()});
      }
      onSubmit(e) {
        this.setUpTags()
        e.preventDefault();
      }
      submitChanges(){
        const obj = {
          title: this.state.title,
          contents: this.state.contents,
          published: this.state.published,
          source: this.state.source,
          link: this.state.link,
          status: this.state.status,
          date_categorised: this.state.date,
          tags: this.state.valid_tags,
        };
        console.log("what has been submitted "+obj)
        // await axios.post(this.URL+'/news/add/'+this.state.category, obj).then(res => console.log(res.data));
        axios.post(this.URL+'/update/old/'+this.state.id, obj).then(res => console.log(res.data));
        
        this.props.history.push(this.URL.replace("news","")+'/database');
      }
     
      render() {
        return (
          <div className="d-flex justify-content-between">
          <div style={{width: 750, margin:10}}className="flex-column border border-secondary border rounded bg-light">
            <h4>Top Tags</h4>
              <TopTags
                potentialTags = {this.state.potentialTags}
                tags = {this.state.allTags}
                removeTopTag = {this.removeTopTag}
                URL={this.URL}
                addTopTag={this.addTopTag}>
              </TopTags>
              <br></br>
              Tag Delimeters: Enter, Space or Comma<br></br>
              Update: alt + u <br></br><br></br>
          </div>
            <div style={{ margin: 10}} className="border border-secondary border rounded bg-gradient-secondary bg-light">
            <div className="form-inline justify-content-center bg-secondary"  style={{padding:5}}>
                {/* <label className="my-1 mr-2" for="inlineFormCustomSelectPref"></label> */}
                <TagInput           
                      addTag={this.addTag} 
                      inputElement={this.inputElement}
                      handleInput={this.handleInput}
                      currTag={this.state.currTag}
                      onChange={this.handleInput}
                    />
              </div>               
                <div style={{marginTop: 10}}>
                  
                {/* <iframe src={this.state.link} frameBorder="1" style={{wdith: 1200}}></iframe> */}
                  <h3 className="content-width">
                      <a href={this.state.link} target="_blank" rel="noopener noreferrer">{this.state.title}</a>
                  </h3>
                  <h6>{this.state.source} - {this.state.published}</h6>
                  <br></br>
                  <h5 className="content-width">"{this.state.contents}..."</h5>
                  <br></br>
              </div> 
            </div>
            <div style={{width: 750, margin:10}}className="flex-column border border-secondary border rounded bg-light">
                <h4>Added Tags</h4>
                  <button className="btn btn-outline-success btn-sm" onClick={this.onSubmit}>Update</button>          
                <AddedTags 
                  entries={this.state.tags} 
                  removeTag={this.removeTag}
                />
                </div>
          </div>       
        )
    }
}