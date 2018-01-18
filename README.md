React Component Needs
=====================

Block rendering of a React component until its needs (requirements / conditions) are met.

Call a function if they are not met.

Render alternative components while getting the needs (e.g. waiting for API response) or the conditions check has
failed.

# Installation

```
npm i react-component-needs --save
```

# Usage

The recommended and simplest usage is with [React Redux's](https://www.npmjs.com/package/react-redux) `connect` method:

_containers/MyContainer/index.js:_

```
import { connect } from 'react-redux'
import { needs } from 'react-component-needs'

// your custom code
import { getMyDataAction } from 'actions/my'
import MyComponent from 'components/MyComponent'
import InProgress from 'components/InProgress'
import Error404 from 'components/Error404'

export default connect(
  // mapStateToProps
  (state) => ({
    data: state.my.data,
    fetching: state.my.fetching
  }),
  // mapDispatchToProps
  (dispatch, ownProps) => ({
    getData: () => dispatch(getMyDataAction())
  })
)(needs(
  // ownProps resolved after mapStateToProps and mapDispatchToProps, so have access to all of it
  (ownProps) => ({
    // (bool) condition that needs to be met to render the component
    condition: !ownProps.fetching && ownProps.data !== null,
    // (function) fire if the condition has not been met (most commonly a function that will dispatch an action)
    needs: ownProps.getData,
    // (bool) indicate that "needs" process is in progress, e.g. action has been dispatched and waiting for response
    needsInProgress: ownProps.fetching,
    // (node) component to display when `needsInProgress === true`, will receive all the same props as the wrapped component
    progressComponent: InProgress,
    // (node) component to display when `condition === false && needsInProgress === false`,
    // i.e. needs have been fired and resolved but the condition still fails
    blockedComponent: Error404,
    // (bool) set to true if you want to call needs() when the component is mounting regardless of condition being fulfilled
    // useful when you want to refresh the data on every component mount
    forceNeeds: true
  })
)(MyComponent))
```

This method will allow you to keep your components clean and only containers worry about logic. It will also make it
trivial to reuse redux actions and state, so you write minimal code.

The package also exports `NeedyComponent` if you want to wrap your components yourself.

# License

MIT, see [LICENSE.md](LICENSE.md).

Copyright (c) 2017 Michał Pałys-Dudek
