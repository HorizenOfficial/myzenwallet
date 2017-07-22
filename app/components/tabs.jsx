import React from 'react';
import {generatePrivateKey, privateKeyToWIF} from '../lib/generateKeys.js'

export default class GenerateButton extends React.Component {    
    constructor(){
        super();

        this.onClick = this.handleClick.bind(this);

        this.state = {
            'privateKey': ''
        };
    }

    handleClick(e){
        var pk = generatePrivateKey();
        var pkwif = privateKeyToWIF(pk);   
        console.log(pkwif);  
        this.setState({
            'privateKey': pkwif
        })
    }
    

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <button onClick={this.onClick}>Hello</button><br/>
                <input disabled value={this.state.privateKey}></input>
            </div>
        );
    }
}
