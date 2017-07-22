import React from 'react';
import {addTwo} from '../lib/zed.js'

export default class Tabs extends React.Component {
    constructor(){
        super();
        this.onClick = this.handleClick.bind(this);
    }

    handleClick(e){
        addTwo();
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <button onClick={this.onClick}>Hello</button>
            </div>
        );
    }
}
