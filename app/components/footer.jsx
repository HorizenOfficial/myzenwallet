import React from 'react'
import {Container, Row, Col} from 'reactstrap';

var footer = {
  backgroundColor: '#f5f5f5'
}

var longP = {
  wordWrap: 'break-word'
}

export default class ZFooter extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div style={footer}>
        <br/>
        <Container>
        <Row>
          <Col md="8">
            <p>MAKE SURE YOU ARE ON <b>MYZENWALLET.IO</b></p>

            <p>Keys are validated client-side and do not leave your browser or network. You are responsible for keeping your own keys safe!!!</p>

            <p>For assistance please take a look in the <a href="https://horizenofficial.atlassian.net/wiki/spaces/ZEN/overview">ZenWiki</a> or contact the <a href="https://support.horizen.global">support</a></p>
          </Col>
          <Col md="4">
            <a href="https://horizen.global/">website</a><br/>
            <a href="https://blog.horizen.global/">blog</a><br/>
            <a href="https://forum.horizen.global/">forum</a><br/>
            <a href="https://github.com/ZencashOfficial/">github</a><br/>
            <a href="https://discordapp.com/invite/Hu5mQxR">discord</a><br/>
          </Col>
        </Row>
        </Container>
      </div>
    )
  }
}
