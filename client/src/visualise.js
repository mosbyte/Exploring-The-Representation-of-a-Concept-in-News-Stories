import React, { Component } from 'react';
import axios from 'axios'
import TopTags from './components/VisualiseTopTags'
import ShowStories from './components/ShowStories'
import ReactChartkick, { LineChart, } from 'react-chartkick'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, LabelList,
  Radar, RadarChart, PolarGrid, Legend,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import Chart from 'chart.js'

ReactChartkick.addAdapter(Chart)

export default class Visualise extends Component {

  constructor(props) {
    super(props);

    if (this.props.match.params.id === 'chant') { this.URL = '/chantnews'; this.proceduralDBName = 'Chant' }
    else if (this.props.match.params.id === 'ritual') { this.URL = '/ritualnews'; this.proceduralDBName = 'Ritual' }

    this.state = {
      editPath: "/" + this.props.match.params.id + "/edit",
      news: [],
      radarGraphData: [],
      firstOccurence: '',
      lastOccurence: '',
      mostOccurences: '',
      numAssociations: 0,
      occurences: [],
      freqAssTags: [],
      similarTags: [],
      tag: 'Tag'
    }
    this.handleInput = this.handleInput.bind(this);
    this.searchTag = this.searchTag.bind(this);
    this.searchMultiTag = this.searchMultiTag.bind(this);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.location !== this.props.location) {
      window.location.reload();
    }
  }
  handleInput = e => {
    if (e.target.value !== '') {
      var tagsString = this.state.tag + ',' + e.target.value.toLowerCase().replace(/\s/g, '')
      var tagsArray = tagsString.split(',')
      this.setState({ multiTag: tagsArray }, this.searchMultiTag)
    } else {
      this.getTagDashBoard(this.state.tag)
    }
  }
  searchMultiTag() {
    console.log(this.state.multiTag)
    axios.get(this.URL + '/search/multitag/' + this.state.multiTag)
      .then(response => {
        if (response.data.length > 0) {
          this.setState({ news: response.data });
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  //search method for database
  searchTag(e) {
    if (this.state.tag === '') {
      axios.get(this.URL + '/categorised')
        .then(response => {
          this.setState({ news: response.data });
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }
  getSimilarTags(searchTag, data) {
    var myTags = [];
    // eslint-disable-next-line
    data.map(function (object, i) {
      if (object.tags.length !== 0) {
        myTags.push(...object.tags)
      }
    });
    var selectedTags = [];
    myTags.filter(function (element) {
      if (element.includes(searchTag)) {
        if (!selectedTags.includes(element)) {
          if (element !== searchTag) {
            selectedTags.push(element)
          }
        }
      }
    });
    this.setState({ similarTags: selectedTags })
  }
  getTags() {
    var myTags = [];
    // eslint-disable-next-line
    this.state.news.map(function (object, i) {
      if (object.tags.length !== 0) {
        myTags.push(...object.tags)
      }
    });
    return myTags
  }
  getFrequentlyAssociated() {
    var radarGraphData = []
    var tags = this.getTags();
    var toptags = this.countTagOccurences("tops", tags)
    var toptagOccurences = this.countTagOccurences("counts", tags)
    for (var element in toptagOccurences) {
      const obj = {
        tag: element,
        occurences: toptagOccurences[element]
      }
      radarGraphData.push(obj)
    }
    var sortedOccs = radarGraphData.sort((b, a) => (a.occurences > b.occurences) ? 1 : ((b.occurences > a.occurences) ? -1 : 0));
    this.setState({
      freqAssTags: toptags.slice(1, 6),
      radarGraphData: sortedOccs,
      numAssociations: toptags.length - 1
    })
  }
  countTagOccurences(which, tags) {
    var counts = {}
    var i, x;
    var value;
    for (i = 0; i < tags.length; i++) {
      if (tags[i] !== 'skipped') {
        value = tags[i];
        if (typeof counts[value] === "undefined") {
          counts[value] = 1;
        } else {
          counts[value]++;
        }
      }
    }
    var keysSorted = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] })
    if (which === 'counts') {
      x = counts
    } else {
      x = keysSorted
    }
    return x;
  }
  setTags(tags) {
    this.setState({
      similarTags: tags
    }, console.log("TAGS" + this.state.similarTags))
  }
  getOccurenceOfTag() {
    var first = this.state.news[this.state.news.length - 1]
    var last = this.state.news[0]
    var dates = [];
    var numericalDates = [];
    this.state.news.map(function (object, i) {
      var date = object.published.split('-')
      dates.push(date[0])
      var numericalDate = object.date.split('T')
      numericalDates.push(numericalDate[0])
    });
    var topDate = this.countTagOccurences('top', dates)
    var dateOccs = []
    var topNumericalDates = this.countTagOccurences('counts', numericalDates)
    for (var element in topNumericalDates) {
      const obj = {
        date: element,
        occurences: topNumericalDates[element]
      }
      dateOccs.push(obj)
    }
    var sortedOccs = dateOccs.sort((b, a) => (a.occurences > b.occurences) ? 1 : ((b.occurences > a.occurences) ? -1 : 0));

    this.setState({
      firstOccurence: first.published,
      lastOccurence: last.published,
      mostOccurences: topDate[0],
      occurences: topNumericalDates
    })
  }
  getInfo() {
    this.getFrequentlyAssociated();
    this.getOccurenceOfTag();
  }
  getTagDashBoard = searchTag => {
    axios.get(this.URL + '/search/multitag/' + searchTag)
      .then(response => {
        this.setState({ news: response.data, tag: searchTag }, this.getInfo);
      })
      .catch(function (error) {
        console.log(error);
      })
    axios.get(this.URL + '/searchsimilar/' + searchTag).then(response => {
      this.getSimilarTags(this.state.tag, response.data);
    })
      .catch(function (error) {
        console.log(error);
      })
  }
  getClickableTag = tag => {
    return (
      <div>
        {/* <button className="btn" onClick={() => this.props.getTagDashBoard(tag)}>{tag}</button> */}{tag}
      </div>
    )
  }
  render() {
    // var similarTags = this.state.similarTags.slice(0, 20).map(this.getClickableTag)
    var similarTags = this.state.similarTags.toString();
    var freqAssTags = this.state.freqAssTags.toString();
    var numAssociations = this.state.numAssociations.toString();
    var lastOccurence = this.state.lastOccurence.toString();
    var mostOccurences = this.state.mostOccurences.toString();
    return (
      <div className="d-flex">

        <div style={{ width: "75%", margin: 10 }} className="borders">
          <h1>{this.proceduralDBName} Visualise Dashboard</h1>
          <div className="toprow border" style={{ position: 'relative' }}><br></br>
            <h2 className="text-bottom">{this.state.tag}</h2>
            <div className="border items d-flex justify-content-between">
              <div className="d-flex align-items-start flex-column" style={{ margin: 10 }}>
                <p></p><br></br>
                <p><b>Top sub tags: </b>{freqAssTags}</p>
                <p><b>Number of subtags: </b>{numAssociations}</p>
                <p><b>Similar tags: </b>{similarTags}</p>
              </div>
              <div className="d-flex flex column align-items-start" style={{ margin: 10 }}>
                <RadarChart cx={200} cy={100} outerRadius={80} width={400} height={175} data={this.state.radarGraphData.slice(1,6)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="tag" />
                  <PolarRadiusAxis />
                  <Radar dataKey="occurences" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </div>
            </div>
            <div>
              
            </div>
            <div className="border items d-flex justify-content-between">
              <div style={{ width: "90%", margin: 10 }}>
                <LineChart data={this.state.occurences} />
              </div>
              <div className="d-flex flex column align-items-start" style={{ margin: 10 }}>
                <BarChart
                  width={400}
                  height={300}
                  data={this.state.radarGraphData.slice(1,15)}
                  margin={{
                    top: 5, right: 5, left: 5, bottom: 5}}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tag" />
                  <YAxis dataKey="occurences"/>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="occurences" fill="#8884d8" minPointSize={3}></Bar>
                </BarChart>
              </div>
            </div>
            <div className="d-flex justify-content-around">
              <h6>X: Date Y: No. Occurences</h6>
              <h6>Most associated tags</h6>
            </div>
          </div>
          <p>Enter additional tags seperated by a comma</p>
          <form className="form-inline" onSubmit={this.searchMultiTag} >
            <input className="form-control mr-sm-2" onChange={this.handleInput} type="search" placeholder="tag (e.g religion, catholic)" aria-label="Search" style={{ width: "90%" }}></input>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit" style={{ width: "9%" }}>Search</button>
          </form>
          <ShowStories
            URL={this.URL}
            editPath={this.state.editPath}
            stories={this.state.news}>
          </ShowStories>
        </div>

        <TopTags
          URL={this.URL}
          DBName={this.proceduralDBName}
          getTagDashBoard={this.getTagDashBoard}>
        </TopTags>
      </div>
    )
  }
}
