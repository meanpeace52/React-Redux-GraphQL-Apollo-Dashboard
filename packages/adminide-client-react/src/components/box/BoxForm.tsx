import * as React from 'react';
import {Component} from 'react';
import * as PropTypes from 'prop-types';
import * as ReactFela from 'react-fela';
import { findDOMNode } from 'react-dom';
import { Modal, FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';

export interface IBoxFormProps {
    onHide: any;
    styles: string;
    close: Function;
    show: boolean;
    create: Function;
    update: Function;
    isEdit: boolean;
    box: any;
}

export interface IState {
    error: boolean;
}

class BoxForm extends React.Component<IBoxFormProps, IState> {

    public static propTypes = {
        show: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            error: false,
        };
    }


    protected submit() {
        let { box, create, update, isEdit } = this.props;
        return (e) => {
            e.preventDefault();
            this.setState({error: false});
            const data = {
                name: findDOMNode<HTMLInputElement>(this.refs['name']).value.trim(),
                language: findDOMNode<HTMLInputElement>(this.refs['lang']).value.trim(),
                description: findDOMNode<HTMLInputElement>(this.refs['description']).value.trim(),
            };
            isEdit ? update({ _id: box._id, ...data }) : create(data);
        };
    }

    public render() {
        const box = this.props.box;
        const styles = this.props.styles;
        const { name = '', lang = '', description = '' } = box;
        const { error } = this.state;

        return (
            <Modal className={styles} show={this.props.show} onHide={this.props.close}>
                <form onSubmit={this.submit()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Box</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error ? <Alert bsStyle='danger'>Check your data!</Alert> : null}
                        <FormGroup>
                            <ControlLabel>Box Name:
                                <sup>*</sup>
                            </ControlLabel>
                            <FormControl ref='name' defaultValue={name} type='text' required/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Language:
                                <sup>*</sup>
                            </ControlLabel>
                            <FormControl ref='lang' defaultValue={lang} componentClass='select' required>
                                <option value='js'>Javascript</option>
                                <option value='go'>Go</option>
                                <option value='python'>Python</option>
                                <option value='ruby'>Ruby</option>
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Description:</ControlLabel>
                            <FormControl ref='description' defaultValue={description} componentClass='textarea'/>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='button' onClick={() => this.props.close()} bsStyle='default'>Close</Button>
                        <Button type='submit' bsStyle='primary'>Save</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

const boxFormStyles = props => ({
    border: '1px solid #000',
});

const mapStylesToProps = props =>
    renderer => renderer.renderRule(boxFormStyles);

export const BoxFormComponent = ReactFela.connect(mapStylesToProps)(BoxForm);

// export const BoxForm = connect(mapStateToProps, mapDispatchToProps)(BoxFormComponent)
