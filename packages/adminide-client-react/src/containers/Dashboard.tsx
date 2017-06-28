import * as React from 'react';
import * as _ from 'lodash';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button, Panel, Col, Grid, FormGroup, FormControl } from 'react-bootstrap';
import { BoxFormComponent as BoxForm, ListComponent as WorkspacesList, TopNavigation, Sidebar } from '../components';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { STATUS_ACTIVE, STATUS_DISABLED, STATUS_PENDING } from '../consts'; // TODO Move to @adminide-stack/core

import BOXES_QUERY from '../gql/boxes-query';

import ADD_BOX_MUTATION from '../gql/addBox-mutation';
import UPDATE_BOX_MUTATION from '../gql/updateBox-mutation';
import REMOVE_BOX_MUTATION from '../gql/removeBox-mutation';
import START_BOX_MUTATION from '../gql/startBox-mutation';
import STOP_BOX_MUTATION from '../gql/stopBox-mutation';

import WORKSPACES_SUBSCRIPTION from '../gql/workspaces-subscription';

export function isDuplicateWorkspace(newWorkspace, existingWorkspaces = []) {
    return existingWorkspaces.some(workspace => newWorkspace._id === workspace._id);
}

export interface IDashboardProps {
    boxes: any[];
    loading: boolean;
    user: any;
    authenticated: boolean;
    start: Function;
    update: Function;
    create: Function;
    shutdown: Function;
    routeTo: Function;
    createBoxForm: any;
    add: Function;
    remove: Function;
    subscribeToMore: Function;
}

interface IState {
    modal: boolean;
    filter: string;
    status: string;
    box: any;
    data: object;
}

const testUser = {
    email: 'test.cdmbase@dispostable.com',
};

const mapStateToProps = (state, ownProps) => ({
    authenticated: (state.auth || {}).authenticated || true,
    user: (state.auth || {}).user || testUser,
});

const mapDispatchToProps = (dispatch) => ({});

class Dashboard extends React.Component<IDashboardProps, IState> {

    public static propTypes = {
        add: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
        start: PropTypes.func.isRequired,
        boxes: PropTypes.array.isRequired,
    };

    public static contextTypes = {
        renderer: PropTypes.object.isRequired,
    };

    public static defaultProps = {
        boxes: [],
        routeTo: () => ({}),
    };

    public state: IState;
    public props: IDashboardProps;
    public subscription: null;

    constructor(props: IDashboardProps) {
        super(props);
        this.state = {
            modal: false,
            filter: '',
            status: '',
            box: {},
            data: {},
        };
    }

    protected close() {
        this.setState({ modal: false, box: {} });
    }

    protected create(data) {
        this.props.add(data);
        this.close();
    }

    protected update(data) {
        this.props.update(data);
        this.close();
    }

    public componentWillReceiveProps(nextProps) {
        if (!this.subscription && !nextProps.loading) {
            this.subscription = this.props.subscribeToMore({
                document: WORKSPACES_SUBSCRIPTION,
                variables: { filter: { creator:  undefined }, // TODO Add creator from Redux Store
                    mutations: ['createWorkspace', 'updateWorkspace', 'deleteWorkspace'] },
                updateQuery: (previousResult, { subscriptionData }) => {
                    const payload = subscriptionData.data.subscribeToWorkspace;
                    if (payload.mutation === 'deleteWorkspace') {
                        const newResult = Object.assign({}, previousResult, {
                            boxes: _.filter(previousResult.boxes, box => box._id !== payload.value._id),
                         });
                        return newResult;
                    }
                    if (isDuplicateWorkspace(payload.value,
                            previousResult.boxes)) {
                        return previousResult;
                    }

                    const newResult = Object.assign({}, previousResult, {
                        boxes: [...previousResult.boxes, payload.value],
                    });

                    return newResult;
                },
            });
        }
    }

    public render() {
        const { renderer } = this.context;
        const { boxes = [], start, create, shutdown, remove, routeTo, loading, user } = this.props;

        return (
            <div className={`dashboard ${renderer.renderRule(styles.page)}`}>
                <TopNavigation user={user} onCreate={() => this.setState({ modal: true })} />
                <div className={renderer.renderRule(styles.dashboard)}>
                    <Sidebar user={user} />
                    {loading ? <h1 className={renderer.renderRule(styles.loading)}>Loading...</h1> : (
                        <div className={renderer.renderRule(styles.content)}>
                            <div className={renderer.renderRule(styles.header.wrapper)}>
                                <h1 className={renderer.renderRule(styles.header.title)}>
                                    Workspaces
                                </h1>
                                <div className={`${renderer.renderRule(styles.header.search)} row`}>
                                    <FormGroup className='col-md-6' style={{ margin: 0 }}>
                                        <FormControl
                                            type='text'
                                            placeholder='Search...'
                                            onChange={e => this.setState({ filter: e.target.value })}
                                        />
                                    </FormGroup>
                                    <FormGroup className='col-md-6' style={{ margin: 0 }}>
                                        <FormControl
                                            componentClass='select'
                                            onChange={e => this.setState({ status: e.target.value })}
                                        >
                                            <option value=''>All</option>
                                            <option value={STATUS_ACTIVE}>Enabled</option>
                                            <option value={STATUS_DISABLED}>Disabled</option>
                                            <option value={STATUS_PENDING}>Pending</option>
                                        </FormControl>
                                    </FormGroup>
                                </div>
                            </div>
                            <WorkspacesList
                                filter={this.state.filter}
                                status={this.state.status}
                                onNewWorkspace={() => this.setState({ modal: true })}
                                onWorkspaceSettings={box => this.setState({ modal: true, box })}
                                workspaces={boxes}
                                start={start}
                                shutdown={shutdown}
                                routeTo={routeTo}
                                create={create}
                                remove={remove}
                            />
                        </div>
                    )}
                </div>
                <BoxForm
                    isEdit={!!this.state.box._id}
                    onHide={this.close.bind(this)}
                    close={this.close.bind(this)}
                    show={this.state.modal}
                    create={this.create.bind(this)}
                    update={this.update.bind(this)}
                    box={this.state.box || {}}
                />
            </div>
        );
    }
}

const styles  = ({
    page: props => ({
        display: 'flex',
        width: '100%',
        'flex-direction': 'column',
    }),
    dashboard: props => ({
        height: '100%',
        display: 'flex',
        'flex-grow': '1',
        'flex-direction': 'row',
    }),
    content: props => ({
        width: '100%',
        padding: '15px 15px 0 15px',
        height: '100%',
        display: 'flex',
        'flex-direction': 'column',
    }),
    loading: props => ({
        margin: 0,
        width: '100%',
        'text-align': 'center',
        'align-self': 'center',
        'justify-content': 'center',
        'display': 'flex',
        'flex-direction': 'column',
    }),
    header: {
        wrapper: props => ({
            display: 'flex',
            'flex-grow': '0',
            'flex-direction': 'row',
            'margin-bottom': '15px',
        }),
        title: props => ({
            margin: 0,
            'flex-grow': 2,
        }),
        search: props => ({
            'flex-grow': 1,
            'justify-content': 'center',
            'align-self': 'center',
        }),
    },
});

export const DashboardComponent = ( // tslint:disable-line
    compose(
        connect(mapStateToProps, mapDispatchToProps),
        graphql(ADD_BOX_MUTATION, {
            props: ({ mutate }) => ({
                add: data => mutate({ variables: data }),
            }),
        }),
        graphql(UPDATE_BOX_MUTATION, {
            props: ({ mutate }) => ({
                update: data => mutate({ variables: data }),
            }),
        }),
        graphql(REMOVE_BOX_MUTATION, {
            props: ({ mutate }) => ({
                remove: id => mutate({ variables: { id } }),
            }),
        }),
        graphql(START_BOX_MUTATION, {
            props: ({ mutate }) => ({
                start: id => mutate({ variables: { id } }),
            }),
        }),
        graphql(STOP_BOX_MUTATION, {
            props: ({ mutate }) => ({
                shutdown: id => mutate({ variables: { id } }),
            }),
        }),
        graphql(BOXES_QUERY, {
            props: ({ data: { loading, boxes, subscribeToMore } }) => ({ boxes, loading, subscribeToMore }),
        }),
    )(Dashboard)
);
