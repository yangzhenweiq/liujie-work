import Page1 from './List';
import Page2 from './Detail';
import Page3 from './Recordlist';
import React from 'react';
import {Router,Route,Switch,Redirect} from 'react-router-dom';
import { createHashHistory } from "history";
const history = createHashHistory();

class RouterConfig extends React.Component{
    render(){
        return(
            <Router history={history}>
                <Switch>
                    <Route path='/' exact render={()=>(
                        <Redirect to='/list'/>
                    )}/>
                    <Route path='/list' component={Page1}/>
                    <Route path='/detail' component={Page2}/>
                    <Route path='/recordlist' component={Page3}/>
                </Switch>
            </Router>
        )
    }
}
export default RouterConfig;
