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
import NeedyComponent from './NeedyComponent'

/**
 * Wraps a component in NeedyComponent and handles resolving of all props.
 *
 * @param  {Object|Function} mapProps Object of required props or a function that returns such object.
 * @return {Function}
 */
export default function needs (mapProps = {}) {
  const propsMapper = typeof mapProps === 'function' ? mapProps : () => mapProps

  return (WrappedComponent) => provideComponent(WrappedComponent, propsMapper)
}

/**
 * Provides wrapping components generated for the WrappedComponent.
 *
 * @param  {Component} WrappedComponent React Component to be wrapped.
 * @param  {Function}  propsMapper      Function that resolves props.
 * @return {Class}
 */
function provideComponent (WrappedComponent, propsMapper) {
  const componentName = getComponentName(WrappedComponent)

  class NeedsWrapper extends NeedyComponent {
    static displayName = `NeedyComponent(${componentName})`
  }

  class Wrapper extends Component {
    static displayName = `Needs(${NeedsWrapper.displayName})`

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

  return Wrapper
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
