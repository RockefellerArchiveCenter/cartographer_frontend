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
      archivesSpaceButtonText: "Fetch from ArchivesSpace",
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
    this.setState({ activeComponent: { title: "", archivesspace_uri: "", level: ""} })
  };
  fetchResource = resourceId => {
    this.setState({archivesSpaceButtonText: "Fetching..."})
    this.setState({error: ""})
    axios
      .get(`/api/fetch-resource/${resourceId}`)
      .then(res => this.toggleData(res))
      .then(rest => this.setState(
          {archivesSpaceButtonText: "Fetch from ArchivesSpace"}))
      .catch(error => this.setState({
          error: error.response.data,
          archivesSpaceButtonText: "Fetch from ArchivesSpace"
      })
    );
  };
  toggleTab = tab => {
    if(this.activeTab !== tab) this.setState({activeTab: tab});
  };
  render() {
    const { toggle } = this.props;
    return (
      <Modal isOpen={true} toggle={toggle} autoFocus={false} className="modal-md">
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
                <Form onSubmit={(e) => {e.preventDefault(); this.fetchResource(this.state.resourceId)}}>
                  <FormGroup>
                    <Label for="resourceId">ArchivesSpace Resource ID</Label>
                    <Input
                      autoFocus={true}
                      type="number"
                      name="resourceId"
                      id="resourceId"
                      value={this.state.resourceId}
                      onChange={this.handleResourceIdChange}
                    />
                  </FormGroup>
                  <Button
                    type="submit"
                    className="btn btn-sm btn-secondary"
                    onClick={() => this.fetchResource(this.state.resourceId)}
                    disabled={!this.state.resourceId}
                  >
                    {this.state.archivesSpaceButtonText}
                  </Button>
                </Form>
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
          <Button color="primary" onClick={onConfirm}>
            {confirmButtonText}
          </Button>
          <Button color="danger" onClick={toggle}>
            {cancelButtonText}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
