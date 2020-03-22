import styled, { css } from 'styled-components';
import { Button } from 'antd';
import PropTypes from 'prop-types';

const MavButton = styled(Button)`
  &&& {
	font-size: 1.6rem;
	box-shadow: none;
	height: auto;
	padding: 0.2rem 1.8rem;
	transition: all .3s;
  
	&:active,
	&:hover,
	&:focus {
	  border-color: ${props => props.theme.colorFanxpDark};
	  color: ${props => props.theme.colorFanxpDark};
	}

		${props =>
			!props.shape &&
			css`
				border-radius: 5px;
			`}
  
		${props =>
			props.size === 'small' &&
			css`
				font-size: 1.4rem;
				padding: 0.2rem 0.7rem;
			`}
  
		${props =>
			props.size === 'large' &&
			css`
				font-size: 1.7rem;
				padding: 1rem 3rem;
			`}
  
		${props =>
			props.type === 'primary' &&
			css`
				&,
				&.ant-btn-primary[disabled] {
					background-color: ${props.theme.colorFanxp};
					border-color: ${props.theme.colorFanxp};
					color: #fff;
				}

				&:active,
				&:focus {
					background-color: ${props.theme.colorFanxp};
					border-color: ${props.theme.colorFanxp};
					color: #fff;
				}

				&:hover {
					background-color: ${props.theme.colorFanxpDark};
					border-color: ${props.theme.colorFanxpDark};
					color: #fff;
				}

				&[disabled] {
					opacity: 0.7;
				}
			`}
  
		${props =>
			props.type === 'secondary' &&
			css`
				background-color: transparent;
				border: 1px solid ${props.theme.colorOilslick80};
				color: ${props.theme.colorOilslick80};

				&:active,
				&:focus {
					background-color: transparent;
					border: 1px solid ${props.theme.colorOilslick80};
					color: ${props.theme.colorOilslick80};
				}

				&:hover {
					background-color: ${props.theme.colorOilslick80};
					border: 1px solid ${props.theme.colorOilslick80};
					color: #fff;
				}
			`}
  
		${props =>
			props.type === 'tertiary' &&
			css`
				border: 2px solid ${props.theme.colorFanxpSecondary};
				background-color: transparent;
				color: ${props.theme.colorOilslick};
				font-weight: bold;
				a {
					transition: none;
				}
				&:focus,
				&:active {
					border: 2px solid ${props.theme.colorFanxpSecondary};
					background-color: transparent;
					color: ${props.theme.colorOilslick};
				}

				&:hover {
					background-color: ${props.theme.colorFanxpSecondary};
					border: 2px solid ${props.theme.colorFanxpSecondary};
					color: #fff;
				}

				&.ant-btn[disabled] {
					border: 2px solid ${props.theme.colorFanxpSecondary};
					background-color: transparent;
					color: ${props.theme.colorOilslick};
					opacity: 0.5;
					&:hover {
						border-color: ${props.theme.colorFanxpSecondary};
					}
				}
			`}
  }
`;

MavButton.propTypes = {
	size: PropTypes.oneOf(['small', 'default', 'large']),
	type: PropTypes.oneOf(['primary', 'secondary', 'tertiary'])
};

MavButton.defaultProps = {
	size: 'default',
	type: 'primary'
};

export default MavButton;
