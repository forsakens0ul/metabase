import cx from "classnames";
import PropTypes from "prop-types";
import { Component } from "react";

import CS from "metabase/css/core/index.css";
import { PLUGIN_LOGO_ICON_COMPONENTS } from "metabase/plugins";

export class DefaultLogoIcon extends Component {
  static defaultProps = {
    height: 32,
  };
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    dark: PropTypes.bool,
    fill: PropTypes.string,
  };

  render() {
    const { dark, height, width, fill = "currentcolor" } = this.props;
    return (
      <svg
        className={cx(
          "Icon",
          { [CS.textBrand]: !dark },
          { [CS.textWhite]: dark },
        )}
        viewBox="0 0 212 256"
        width={width}
        height={height}
        fill={fill}
        data-testid="main-logo"
      >
        <path
        fill="#005bab"
        d="M62 66C71.7579 59.1533 79.5627 51.0931 92 49.3002C99.2018 48.2619 107.179 48.6832 114 51.2292C133.099 58.358 147.328 78.2948 145.91 99C144.01 126.746 116.415 149.018 89 142.497C77.7798 139.828 71.0246 132.351 62 126L62 186L73 186L73 172C90.2529 175.561 105.744 177.461 123 172.279C136.451 168.239 147.323 159.921 156.985 150C191.986 114.064 180.067 53.4041 140 27.3449C123.017 16.2993 101.568 13.6821 82 17.804C76.604 18.9407 66.4071 20.7992 63.0278 25.6373C61.0396 28.4838 62 33.7159 62 37L62 66M51 31C39.0702 42.9298 29.0271 55.5936 24.0394 72C19.7029 86.264 21 101.27 21 116L21 186L52 186L52 77L52 46C52 41.1913 52.8752 35.4688 51 31M138 101C133.572 101 125.412 99.4222 121.634 102.028C119.021 103.83 117.869 107.514 115.671 109.79C110.099 115.561 101.444 117.56 94 114.517C73.396 106.093 80.1485 75.6666 102 76.0193C107.773 76.1125 112.889 78.6588 116.66 83.0432C118.436 85.1081 119.464 88.3681 121.688 89.9722C125.339 92.6065 133.664 91 138 91C137.292 85.7672 135.732 80.4916 132.867 76C113.112 45.0272 62.8513 60.0757 64.0432 97C64.4524 109.677 71.7197 122.532 83 128.587C105.005 140.4 135.867 127.08 138 101z"
      />
      <path
        fill="#0080ff"
        d="M92 175L93 176L92 175z"
      />

      </svg>
    );
  }
}

export default function LogoIcon(props) {
  const [Component = DefaultLogoIcon] = PLUGIN_LOGO_ICON_COMPONENTS;
  return <Component {...props} />;
}
