/*
 * Component Needs
 *
 * Block rendering of a component until its needs (requirements / conditions) are met.
 * Call a function if they are not met.
 * Render alternative components while getting the needs (e.g. waiting for API response) or meeting the conditions
 * has failed after the needs have been met.
 */
import needs from './needs'
import NeedyComponent from './NeedyComponent'

export {
  needs,
  NeedyComponent
}
