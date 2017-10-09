/*
 * Needy Component
 *
 * Wraps a component and blocks its rendering until `condition` prop is met. If it's not met
 * it will call `needs()` prop to try and satisfy the condition.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class NeedyComponent extends Component {

  static propTypes = {
    condition: PropTypes.bool.isRequired,
    needs: PropTypes.func,
    component: PropTypes.func.isRequired,
    needsInProgress: PropTypes.bool,
    progressComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    blockedComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
  }

  static defaultProps = {
    needs: () => null,
    needsInProgress: false,
    progressComponent: () => false,
    blockedComponent: () => false
  }

  wrappedComponent = null

  constructor (props) {
    super(props)
    this.needsCalled = false
  }

  componentWillMount () {
    this.checkNeeds(this.props)
  }

  componentWillUpdate (nextProps) {
    this.checkNeeds(nextProps)
  }

  getWrappedComponent () {
    return this.wrappedComponent
  }

  /**
   * Check if there are any needs that need to be called.
   *
   * @param  {Object} props Props to base the decision on.
   * @return {Boolean}
   */
  checkNeeds (props) {
    const {
      condition,
      needs
    } = props

    if (condition) {
      this.needsCalled = false
      return true
    }

    if (!this.needsCalled) {
      needs()
      this.needsCalled = true
      return false
    }

    return false
  }

  render () {
    const {
      condition,
      component,
      needs,
      needsInProgress,
      progressComponent,
      blockedComponent,
      ...props
    } = this.props

    if (!condition) {
      // need to capitalize so that JSX parser picks these up as components
      const Blocked = blockedComponent
      const Progress = progressComponent

      return needsInProgress
        ? (typeof Progress === 'function' ? <Progress {...props} /> : Progress)
        : (typeof Blocked === 'function' ? <Blocked {...props} /> : Blocked)
    }

    const WrappedComponent = component
    return (
      <WrappedComponent
        {...props}
        ref={(component) => this.wrappedComponent = component}
      />
    )
  }
}
