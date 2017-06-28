import * as React from 'react';
import * as ReactFela from 'react-fela';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

export interface ITopNavigationProps {
    user: any;
    onCreate: Function;
    styles: string;
}
export interface ITopNavigationState {}

class TopNavigationComponent extends React.Component<ITopNavigationProps, ITopNavigationState> {
    public render(): any {
        const { user, styles } = this.props;
        return (
            <Navbar fluid className={`top-navigation ${styles}`}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href='#'>Admin IDE</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavItem eventKey={1} href='#'>
                            <i className='glyphicon glyphicon-cog'/> Settings
                        </NavItem>
                        <NavItem onClick={() => this.props.onCreate()} eventKey={2} href='javascript:void(0)'>
                            <i className='glyphicon glyphicon-plus'/> Create new
                        </NavItem>
                        <NavDropdown eventKey={3} title={user.email} id='navbar-account-dropdown'>
                            <MenuItem eventKey={3.1}>Account</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey={3.4}>Logout</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

const topNavigationStyles = props => ({
    'margin-bottom': '0 !important',
    'flex-grow': 0,
});

const mapStylesToProps = props =>
    renderer => renderer.renderRule(topNavigationStyles);

export const TopNavigation = ReactFela.connect(mapStylesToProps)(TopNavigationComponent);
