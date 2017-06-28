import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Identicon from 'identicon.js';
import * as Base64 from 'base-64';
import * as ReactFela from 'react-fela';
import { Nav, NavItem } from 'react-bootstrap';

export interface ISidebarProps {
    user: any;
}
export interface ISidebarState {}

export class Sidebar extends React.Component<ISidebarProps, ISidebarState> {

    public static contextTypes = {
        renderer: PropTypes.object.isRequired,
    };

    public static defaultProps() {
        return {
            user: {},
        };
    }

    get icon() {
        const { user } = this.props;
        return user.icon || `data:image/png;base64,${new Identicon(Base64.encode(user.email), 420).toString()}`;
    }

    public render(): any {
        const { renderer } = this.context;
        const { user } = this.props;
        return (
            <div className={`${renderer.renderRule(styles.sidebar)}`}>
                <div className={`${renderer.renderRule(styles.icon)}`}>
                    <p><img style={{ height: '150px' }} src={this.icon} /></p>
                    <p className={`${renderer.renderRule(styles.text)}`}>{ user.email }</p>
                </div>
                <div className={`${renderer.renderRule(styles.menu.container)}`}>
                    <hr className={`${renderer.renderRule(styles.divider)}`} />
                    <Nav bsStyle='pills' stacked activeKey={1}>
                        <NavItem className={`${renderer.renderRule(styles.menu.item)}`} eventKey={1} href='/'>Workspaces</NavItem>
                        <NavItem className={`${renderer.renderRule(styles.menu.item)}`} eventKey={2}>Shared with me</NavItem>
                        <NavItem className={`${renderer.renderRule(styles.menu.item)}`} eventKey={3}>Repositories</NavItem>
                    </Nav>
                    <hr className={`${renderer.renderRule(styles.divider)}`} />
                </div>
            </div>
        );
    }
}

const styles = ({
    sidebar: props => ({
        height: '100%',
        background: '#3899e2',
        'flex-grow': 0,
        'min-width': '20%',
        'max-width': '20%',
    }),
    icon: props => ({
        padding: '15px 15px 0 15px',
        'text-align': 'center',
    }),
    divider: props => ({
        margin: '10px 0',
        padding: '0 15px',
    }),
    text: props => ({
        color: 'white',
    }),
    menu: {
        container: () => ({
            padding: '0 15px',
        }),
        item: () => ({
            '&:active a': {
                'background-color': '#337ab7 !important',
            },
            '&:hover a': {
                'background-color': '#337ab7 !important',
            },
            '& a': {
                color: 'white !important',
            },
        }),
    },
});
