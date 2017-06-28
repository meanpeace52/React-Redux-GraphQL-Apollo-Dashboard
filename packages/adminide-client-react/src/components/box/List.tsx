import * as _ from 'lodash';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Row, Col, Button, FormGroup, FormControl } from 'react-bootstrap';

import { BoxComponent as Box } from './Box';

export interface IListProps {
    workspaces: any[];
    start: Function;
    create: Function;
    routeTo: Function;
    shutdown: Function;
    remove: Function;
    onNewWorkspace: Function;
    onWorkspaceSettings: Function;
    filter: string;
    status: string;
}

export class ListComponent extends React.Component<IListProps, any> {

    public static propTypes = {
        workspaces: PropTypes.array,
    };

    public static contextTypes = {
        renderer: PropTypes.object.isRequired,
    };

    public static defaultProps = {
        workspaces: [],
    };

    constructor(context, props) {
        super(context, props);
        this.state = {
            filter: false,
        };
    }

    get workspaces() {
        const { filter, status, workspaces } = this.props;
        const result = filter || status
            ? workspaces
                .filter(workspace => filter ? workspace.name.toLowerCase().includes(filter.toLowerCase()) : true)
                .filter(workspace => status ? workspace.status === status : true)
            : workspaces;

        return result.map((workspace, _index) => ({...workspace, _index}));
    }

    public render() {
        const { renderer } = this.context;
        const { start, remove, shutdown, routeTo, onNewWorkspace, onWorkspaceSettings } = this.props;
        // const rows = _.chunk(this.workspaces, 3);

        const rows = _.groupBy(this.workspaces, function(workspace) {
            return Math.floor(workspace._index % 3);
        });

        return (
            <div className={`${renderer.renderRule(styles.list)} ${ _.isEmpty(rows) && '-empty' }`}>
                {!_.isEmpty(rows) ? (
                    <Row>
                        {_.map(rows, (elements, colIndex) => (
                            <Col key={colIndex} sm={4}>
                                { elements.map(box => (
                                    <Box
                                        onSettings={() => onWorkspaceSettings(box)}
                                        key={box._id}
                                        box={box}
                                        start={start}
                                        remove={remove}
                                        routeTo={routeTo}
                                        shutdown={shutdown}
                                    />
                                )) }
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className={`${renderer.renderRule(styles.centered)}`}>
                        <h3>Nothing to show...</h3>
                        <Button onClick={() => onNewWorkspace()} bsStyle='primary'>New Workspace</Button>
                    </div>
                )}
            </div>
        );
    }
}

const styles = {
    list: props => ({
        width: '100%',
        display: 'flex',
        'flex-direction': 'column',
        'flex-grow': 1,
        '&.-empty': {
            'align-items': 'center',
            'justify-content': 'center',
        },
    }),
    centered: props => ({
        'text-align': 'center',
    }),
};
