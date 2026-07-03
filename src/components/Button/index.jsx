import PropTypes from 'prop-types'
import classnames from 'classnames'

const Button = props => (
  <button
    type={props.type}
    className={classnames('btn', props.className)}
    onClick={props.onClick}
    aria-label={props.ariaLabel}
    aria-haspopup={props.ariaHasPopup}
    aria-expanded={props.ariaExpanded}
    aria-pressed={props.ariaPressed}
    disabled={props.disabled} >
    {props.label}
  </button>)

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaHasPopup: PropTypes.bool,
  ariaExpanded: PropTypes.bool,
  ariaPressed: PropTypes.bool,
  iconAfter: PropTypes.string,
  iconBefore: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}

export default Button
