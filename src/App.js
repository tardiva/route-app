import React, { Component } from 'react';
import './App.css';
import Form from './Components/Form/Form';
import List from './Components/List/List';
import MapWrapper from './Components/Map/MapWrapper';
import Sidebar from 'react-sidebar';
import ToggleButton from './Components/ToggleButton/ToggleButton';
import update from 'immutability-helper';

const mql = window.matchMedia('(min-width: 768px)');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scriptError: false,
      points: [],
      currentCoord: {lat: 55.7526443, lng: 37.62370929999997},
      currentId: 0,
      sidebarOpen: true,
      sidebarDocked: mql.matches
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.handleMediaQueryChanged = this.handleMediaQueryChanged.bind(this);
    this.addPoint = this.addPoint.bind(this);
    this.removePoint = this.removePoint.bind(this);
    this.reorderPoints = this.reorderPoints.bind(this);
    this.updateCurrentCoord = this.updateCurrentCoord.bind(this);
    this.movePoint = this.movePoint.bind(this);
    this.callAfterScriptLoads = this.callAfterScriptLoads.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.handleMediaQueryChanged);
  }

  render() {
    const sidebar =
      <div>
        <div className="app__sidebar-top">
          <Form onSubmit={this.addPoint}/>
        </div>
        <List items={this.state.points}
              moveItem={this.reorderPoints}
              removeItem={this.removePoint}/>
      </div>;

    const mainContent =
      <div>
        <MapWrapper warning={this.state.scriptError}
                    center={this.state.currentCoord}
                    points={this.state.points}
                    handleMapChange={this.updateCurrentCoord}
                    handlePointMove={this.movePoint}
                    asyncScriptOnLoad={this.callAfterScriptLoads}
        />
        {!this.state.sidebarDocked ? (<ToggleButton handleClick={this.toggleSidebar} />) : ''}
      </div>;

    return (
      <div className="App">
        <Sidebar
          open={this.state.sidebarOpen}
          docked={this.state.sidebarDocked}
          sidebarClassName="app__sidebar"
          onSetOpen={this.toggleSidebar}
          sidebar={sidebar}
          children={mainContent}
        >
        </Sidebar>
      </div>
    );
  }

  callAfterScriptLoads(resp) {
    this.setState(
      update(this.state, {
        scriptError: {
          $set: resp.errored
        }
      })
    )
  }

  toggleSidebar() {
    this.setState(
      update(this.state, {
        sidebarOpen: {
          $set: !this.state.sidebarOpen
        }
      })
    )
  }

  handleMediaQueryChanged() {
    this.setState(update(this.state, {
      sidebarDocked: {
        $set: mql.matches
      },
      sidebarOpen: {
        $set: false
      }
    }));
  }

  updateCurrentCoord(coord) {
    this.setState(
      update(this.state, {
        currentCoord: {
          $set: coord
        }
      })
    )
  }

  addPoint(name) {
    this.setState(update(this.state, {
      points: {
        $push: [{id: this.state.currentId, name: name, coord: this.state.currentCoord}]
      },
      currentId: {
        $set: this.state.currentId + 1
      }
    }));
  }

  removePoint(index) {
    this.setState(
      update(this.state, {
        points: {
          $splice: [[index, 1]]
        }
      })
    )
  }

  reorderPoints(dragIndex, hoverIndex) {
    this.setState(
      update(this.state, {
        points: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, this.state.points[dragIndex]]]
        }
      })
    )
  }

  movePoint(index, coord) {
    this.setState(
      update(this.state, {
        points: {
          [index]: {
            coord: {
              $set: coord
            }
          }
        }
      })
    )
  }
}

export default App;
