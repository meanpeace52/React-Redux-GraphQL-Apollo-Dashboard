import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import * as PrettySize from 'prettysize';
import { Panel, ButtonGroup, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { STATUS_ACTIVE, STATUS_DISABLED, STATUS_PENDING } from '../../consts'; // TODO Move to @adminide-stack/core

console.log({ STATUS_ACTIVE, STATUS_DISABLED, STATUS_PENDING }); // TODO Fix issue with unreachable file

const langs = {
    rust: <i className='devicon-rust-plain colored'/>,
    js: <i className='devicon-javascript-plain colored'/>,
    ruby: <i className='devicon-ruby-plain colored'/>,
    python: <i className='devicon-python-plain colored'/>,
    go: <i className='devicon-go-line colored'/>,
};

export class BoxComponent extends React.Component<any, any> {

    public static contextTypes = {
        renderer: PropTypes.object.isRequired,
    };

    public static propTypes = {
        box: PropTypes.object.isRequired,
        start: PropTypes.func.isRequired,
        shutdown: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
        routeTo: PropTypes.func.isRequired,
        onSettings: PropTypes.func.isRequired,
    };

    get footer() {
        const { box } = this.props;
        const { renderer } = this.context;
        return (
            <div className={`row text-center ${renderer.renderRule(styles.footer.container)}`}>
                <div className={`col-sm-4 ${renderer.renderRule(styles.footer.column)}`}>
                    <strong>{box.spec.cpu}</strong> CPU
                </div>
                <div className={`col-sm-4 ${renderer.renderRule(styles.footer.column)}`}>
                    <strong>{PrettySize(box.spec.ram, true, false, 0)}</strong> RAM
                </div>
                <div className={`col-sm-4 ${renderer.renderRule(styles.footer.column)}`}>
                    <strong>{PrettySize(box.spec.hdd, true, false, 0)}</strong> HDD
                </div>
            </div>
        );
    }

    public get description() {
        const { box: { description } } = this.props;
        const { renderer } = this.context;
        return description.split('\n').map(line => <p className={`${renderer.renderRule(styles.description)}`}>{line}</p>);
    }

    public render() {
        const { box, remove, start, shutdown, routeTo, onSettings, ...rest } = this.props;
        const { renderer } = this.context;

        return (
            <Panel footer={this.footer} {...rest} className={renderer.renderRule(styles.box)} bsStyle='default'>
                <div className='panel-content'>
                    <div className='icon'>{ langs[box.lang] }</div>
                    <div className='information'>
                        <div className={renderer.renderRule(styles.name)}>
                            <span>
                                <i
                                    className={`
                                    indicator
                                    glyphicon
                                    glyphicon-certificate
                                    ${renderer.renderRule(styles.status)}
                                    -${box.status}
                                    `}
                                />
                            </span> <strong>
                                {box.name}
                            </strong>
                            <div className='pull-right'>
                                <DropdownButton
                                    className={`${renderer.renderRule(styles.menu)}`}
                                    pullRight
                                    noCaret
                                    bsSize='xsmall'
                                    bsStyle='default'
                                    title={<i className='glyphicon glyphicon-option-vertical' />}
                                    id={`workspace-dropdown-${box._id}`}
                                >
                                    { box.status === STATUS_ACTIVE ? [
                                        <MenuItem onClick={e => routeTo(`/app/box/${box._id}/editor`)}>Open Workspace</MenuItem>,
                                        <MenuItem onClick={e => shutdown(box._id)}>Stop Workspace</MenuItem>,
                                    ] : null }
                                    { box.status === STATUS_DISABLED ? (
                                        <MenuItem onClick={e => start(box._id)}>Start Workspace</MenuItem>
                                    ) : null }
                                    <MenuItem onClick={e => onSettings()}>Settings</MenuItem>
                                    <MenuItem divider/>
                                    <MenuItem onClick={e => confirm('Are you shure?') && remove(box._id)}>Remove</MenuItem>
                                </DropdownButton>
                            </div>
                        </div>
                        <div>{ this.description }</div>
                    </div>
                </div>
            </Panel>
        );

    }
}

const styles = {
    box: props => ({
        borderRadius: '1px !important',
    }),
    name: props => ({
        fontSize: '16px',
        margin: '0 0 5px 0',
    }),
    description: props => ({
        fontSize: '12px',
        margin: 0,
        ':first-child': {
            marginTop: '5px',
        },
    }),
    status: props => ({
        [`&.-${STATUS_ACTIVE}`]: ({
            color: '#449d44',
        }),
        [`&.-${STATUS_DISABLED}`]: ({
            color: '#ababab',
        }),
        [`&.-${STATUS_PENDING}`]: ({
            color: '#ec971f',
        }),
    }),
    menu: props => ({
        border: 'none !important',
        ':hover': {
            background: 'transparent !important',
            boxShadow: 'none !important',
        },
        ':visited': {
            background: 'transparent !important',
            boxShadow: 'none !important',
        },
        ':focus': {
            background: 'transparent !important',
            boxShadow: 'none !important',
        },
    }),
    footer: {
        container: props => ({}),
        column: props => ({
            fontSize: '12px',
        }),
    },
};
