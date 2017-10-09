/*
 * Easy (and default) way of wrapping a component in needs.
 *
 * Usage:
 *
 *    needs((ownProps) => ({
 *      condition: [bool based on ownProps],
 *      needs: [function to call in order the fulfill condition if necessary],
 *      needsInProgress: [bool indicating if needs are being fetched currently or not],
 *      progressComponent: [component to render during progress],
 *      blockedComponent: [component to render after condition hasn't been met]
 *    }))(MyComponent)
 */
import React, { Component } from 'react'
import hoistStatics from 'hoist-non-react-statics'

import NeedyComponent from './NeedyComponent'

/**
 * Wraps a component in NeedyComponent and handles resolving of all props.
 *
 * @param  {Object|Function} mapProps   Object of required props or a function that returns such object.
 * @param  {Object}          lifecycles Map of React component lifecycle methods to hook into.
 * @return {Function}
 */
export default function needs (mapProps = {}, lifecycles = {}) {
  const propsMapper = typeof mapProps === 'function' ? mapProps : () => mapProps

  return (WrappedComponent) => provideComponent(WrappedComponent, propsMapper, lifecycles)
}

/**
 * Provides wrapping components generated for the WrappedComponent.
 *
 * @param  {Component} WrappedComponent React Component to be wrapped.
 * @param  {Function}  propsMapper      Function that resolves props.
 * @param  {Object}    lifecycles       Map of React component lifecycle methods to hook into.
 * @return {Class}
 */
function provideComponent (WrappedComponent, propsMapper, lifecycles = {}) {
  const componentName = getComponentName(WrappedComponent)

  // populate lifecycle methods with defaults
  lifecycles = {
    componentWillMount: () => null,
    componentDidMount: () => null,
    componentWillReceiveProps: () => null,
    shouldComponentUpdate: () => null,
    componentWillUpdate: () => null,
    componentDidUpdate: () => null,
    componentWillUnmount: () => null,
    ...lifecycles
  }

  class NeedsWrapper extends NeedyComponent {
    static displayName = `NeedyComponent(${componentName})`
  }

  class Wrapper extends Component {
    static displayName = `Needs(${NeedsWrapper.displayName})`

    componentWillMount () {
      lifecycles.componentWillMount(this.props)
    }

    componentDidMount () {
      lifecycles.componentDidMount(this.props)
    }

    componentWillReceiveProps (nextProps) {
      lifecycles.componentWillReceiveProps(nextProps, this.props)
    }

    shouldComponentUpdate (nextProps) {
      const should = lifecycles.shouldComponentUpdate(nextProps, this.props)
      if (should === false) {
        return false
      }
      return true
    }

    componentWillUpdate (nextProps) {
      lifecycles.componentWillUpdate(nextProps, this.props)
    }

    componentDidUpdate (prevProps) {
      lifecycles.componentDidUpdate(prevProps, this.props)
    }

    componentWillUnmount() {
      lifecycles.componentWillUnmount(this.props)
    }

    render () {
      const allProps = {
        ...this.props,
        ...propsMapper(this.props)
      }

      return (
        <NeedsWrapper
          {...allProps}
          component={WrappedComponent}
        />
      )
    }
  }

  return hoistStatics(Wrapper, WrappedComponent)
}

/**
 * Get component name easily.
 *
 * @param  {Component|Function} component React component.
 * @return {String}
 */
function getComponentName(component) {
  return component.displayName || component.name || 'Unknown'
}
