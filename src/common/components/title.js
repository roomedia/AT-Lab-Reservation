import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap'

export default class Title extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    span: PropTypes.string,
  }

  render () {
    const {
      title,
      span,
    } = this.props

    return (
      <Row noGutters={true}>
        <Col md={{ size: 10, offset: 1 }} className="title">
          <h2>{title}</h2>
          <span>{span}</span>
        </Col>
      </Row>
    )
  }
}