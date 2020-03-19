import React, { Component } from "react";
import {
  Alert,
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";
import axios from "axios";

export class MapComponentModal extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.props.toggle
    this.onSubmit = this.props.onSubmit
    this.state = {
      activeMap: this.props.activeMap,
      activeComponent: this.props.activeComponent,
      resourceId: "",
      error: "",
    };
  }
  handleChange = e => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    const activeComponent = { ...this.state.activeComponent, [name]: value };
    this.setState({ activeComponent });
  };
  handleResourceIdChange = e => {
    let { value } = e.target;
    this.setState({ resourceId: value })
  };
  toggleData = data => {
    if (data.data) {
      this.handleChange({"target": {"name": "archivesspace_uri", "value": data.data.uri}});
      this.handleChange({"target": {"name": "title", "value": data.data.title}});
      this.handleChange({"target": {"name": "level", "value": data.data.level}});
      return;
    }
    this.setState({ activeComponent: this.props.activeComponent })
  };
  fetchResource = resourceId => {
    this.setState({error: ""})
    axios
      .get(`/api/fetch-resource/${resourceId}`)
      .then(res => this.toggleData(res))
      .catch(error => this.setState({error: error.response.data}));
  };
  toggleTab = tab => {
    if(this.activeTab !== tab) this.setState({activeTab: tab});
  };
  render() {
    const { toggle } = this.props;
    return (
      <Modal isOpen={true} toggle={toggle} className="modal-md">
        <ModalHeader tag="h2" toggle={toggle}> Arrangement Map Component </ModalHeader>
        <ModalBody>
          <Row>
            <Col sm="12">
            { this.state.error ? (
              <Alert className="mt-2" color="danger">
                {this.state.error}
              </Alert>) : null
            }
            { this.state.activeComponent.archivesspace_uri ? (
              <div className="mt-2">
                <p className="h5">{this.state.activeComponent.title}</p>
                <p className="text-muted">{this.state.activeComponent.archivesspace_uri}</p>
                <Button
                  color="warning"
                  onClick={this.toggleData}
                  >
                  Clear
                </Button>
              </div>
            ) : (
              <div>
                <Form>
                  <FormGroup>
                    <Label for="description">ArchivesSpace Resource ID</Label>
                    <Input
                      type="number"
                      name="resourceId"
                      value={this.state.resourceId}
                      onChange={this.handleResourceIdChange}
                    />
                  </FormGroup>
                </Form>
                <Button
                  className="btn btn-sm btn-secondary"
                  onClick={() => this.fetchResource(this.state.resourceId)}
                  >
                  Fetch from ArchivesSpace
                </Button>
              </div>)}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => this.onSubmit(this.state.activeComponent, this.props.path)}
            disabled={!this.state.activeComponent.title}>
            Save
          </Button>
          <Button
            color="danger"
            onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export class ConfirmModal extends Component {
  render() {
    const { toggle, title, message, onConfirm, cancelButtonText, confirmButtonText } = this.props;
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader tag="h2" toggle={toggle}>{title}</ModalHeader>
        <ModalBody>
          {message}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={onConfirm}>
            {confirmButtonText}
          </Button>
          <Button color="secondary" onClick={toggle}>
            {cancelButtonText}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
