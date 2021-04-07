import { useEffect, useState } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
// temp vars
import './tailwind.css';
import NotFound from './views/404';
import LoadingScreen from './views/LoadingScreen';
import Main from './views/Main';

function App() {

  const [headerTitle, setHeaderTitle] = useState("Waterfront Trail")
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const item = JSON.parse(localStorage.getItem('expiryTime'))
    const now = new Date()
    if(item === null){ 
    } else if (item > now.getTime()) {
      setLoading(false)
    } else if (item < now.getTime()) {
      localStorage.removeItem('expiryTime')
    }

    setTimeout(() => {
      setLoading(false)

      const now = new Date()
      localStorage.setItem('expiryTime', JSON.stringify(now.getTime() + 3600000))
    }, 6000)

  }, [])

  let dataFile = require('./assets/data.json')
  let distanceFile = require('./assets/parks-distance.json')

  let points = (dataFile.points) ? dataFile.points : ''
  let distance = (distanceFile.distance) ? distanceFile.distance : ''

  return (
    <>
      {loading === false ? (
        <HashRouter>
          <Switch>
            <Route exact path="/">
              <Main points={points} distance={distance} />
            </Route>
            <Route path="/:id" render={(props) => <Main {...props} points={points} distance={distance} preload={true} /> } />
            <Route path="*" component={NotFound} />
          </Switch>

        </HashRouter>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

export default App;
