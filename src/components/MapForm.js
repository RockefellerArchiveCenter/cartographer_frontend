import React, { Component } from "react";
import ComponentList from './ComponentList'
import { ConfirmModal } from "./Modals";
import { walk } from 'react-sortable-tree';
import axios from "axios";

import {
  Button,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";

class MapForm extends Component {
 constructor(props) {
   super(props);
   this.state = {
     pageTitle: "",
     activeMap: {"title": "", },
     editable: this.props.match.params.id ? false : true,
     publishModal: false
   };
 };
 componentDidMount() {
   this.refreshMap();
   document.title = this.props.match.params.id ? document.title + ": Edit Map" : document.title + ": Add New Map"
 };
 toggleEditable = () => {
   this.setState({editable: !this.state.editable})
 }
 toggleModal = map => {
   this.setState({ activeMap: map, publishModal: !this.state.publishModal });
 };
 togglePublish = map => {
   map.publish = !this.state.activeMap.publish
   this.toggleModal(map)
   this.handleSubmit(map);
 }
 refreshMap = () => {
   if (this.props.match.params.id) {
     axios
       .get(`/api/maps/${this.props.match.params.id}`)
       .then(res => this.setState({ activeMap: res.data }))
       .catch(err => console.log(err));
   }
 }
 handleChange = e => {
   let { name, value } = e.target;
   if (e.target.type === "checkbox") {
     value = e.target.checked;
   }
   const activeMap = { ...this.state.activeMap, [name]: value };
   this.setState({ activeMap });
 };
 handleSubmit = map => {
   if (map.id) {
     axios
       .put(`/api/maps/${map.id}/`, map)
       .then(res => this.refreshMap())
       .then(this.setState({editable: false}))
       .catch(err => console.log(err));
     return;
   }
   axios
     .post("/api/maps/", map)
     .then(res => window.location = `/maps/${res.data.id}`)
     .then(this.toggleEditable())
     .catch(err => console.log(err));
 };
 handleComponentSubmit = item => {
   item.map = this.state.activeMap.id;
   if (item.id) {
     return axios
       .put(`/api/components/${item.id}/`, item)
       .then(res => { return res.data })
       .catch(err => console.log(err));
    }
    return axios
       .post("/api/components/", item)
       .then(res => { return res.data })
       .catch(err => console.log(err));
 };
 handleTreeChange = (newItems, callback) => {
   this.handleChange({"target": {"name": "children", "value": newItems}})
   walk({
     treeData: newItems,
     getNodeKey: ({ node }) => node.id,
     callback: (node) => {
       let parentNodeId = node.parentNode ? node.parentNode.id : null
       if (node.node.parent !== parentNodeId || node.node.order !== node.treeIndex) {
         node.node.parent = parentNodeId
         node.node.order = node.treeIndex
         this.handleComponentSubmit(node.node)
          .then((res) => node.node.id = res.id)
          .catch(err => console.log(err));
       }
     },
     ignoreCollapsed: false
   });
   return callback;
 };
 redirectToRoot = () => {
  this.props.history.push('/')
}
render() {
  return (
    <div>
      <div className="row mb-3">
        <div className="col-12 col-sm-6">
          <h1>{this.props.match.params.id ? "Edit Map" : "Add New Map"}</h1>
        </div>
        <div className="col-12 col-sm-6">
         {this.props.match.params.id ? (
           <Button
             color={this.state.activeMap.publish ? "danger" : "success"}
             size="lg"
             className="float-right"
             outline={true}
             onClick={() => this.toggleModal(this.state.activeMap)}
           >
             {this.state.activeMap.publish ? "Unpublish Map" : "Publish Map"}
           </Button>): null}
         </div>
      </div>
      <Form
        className="row mb-4"
        inline={true}
        onSubmit={(e) => {e.preventDefault(); this.handleSubmit(this.state.activeMap)}}
      >
        <FormGroup className="col-12 col-lg-8">
          <Label for="title">Arrangement Map Title</Label>
            <Input
              className="col-sm-12"
              type="text"
              name="title"
              id="title"
              onChange={this.handleChange}
              value={this.state.activeMap.title}
              disabled={this.state.editable ? false : true }
            />
          </FormGroup>
          {this.state.editable ? (
          <div className="col-6 col-lg-4 mt-4">
            <Button
              color="primary"
              className="mr-2"
              disabled={!this.state.activeMap.title}
              onClick={() => this.handleSubmit(this.state.activeMap)}
            >
            Save Title
            </Button>
            <Button
              color="danger"
              className="mr-2"
              onClick={this.props.match.params.id ? this.toggleEditable : this.redirectToRoot}>
            Cancel
            </Button>
          </div>
        ) : (
          <div className="col-6 col-sm-5 col-lg-4 mt-4">
            <Button
              color="primary"
              className="mr-2"
              onClick={this.toggleEditable}
            >
            Edit Title
            </Button>
          </div>
        )}
        </Form>
        {this.state.activeMap.id ? (
          <ComponentList
            activeMap={this.state.activeMap}
            items={this.state.activeMap.children ? this.state.activeMap.children : []}
            refresh={this.refreshMap}
            onChange={this.handleTreeChange}
          />
        ) : null}
        {this.state.publishModal ? (
          <ConfirmModal
            title={`Confirm ${this.state.activeMap.publish ? "unpublish" : "publish"}`}
            activeItem={this.state.activeMap}
            toggle={() => this.toggleModal(this.state.activeMap)}
            onConfirm={() => this.togglePublish(this.state.activeMap)}
            message={`Are you sure you want to ${this.state.activeMap.publish ? "unpublish" : "publish"} ${this.state.activeMap.title}? ${this.state.activeMap.publish ? "Unpublishing" : "Publishing"} this map will result in all related resource records in ArchivesSpace being ${this.state.activeMap.publish ? "unpublished" : "published"} as well.`}
            cancelButtonText="Cancel"
            confirmButtonText={this.state.activeMap.publish ? "Unpublish" : "Publish"}
          />
        ) : null}
      </div>
    );
  }
}

export default MapForm;
