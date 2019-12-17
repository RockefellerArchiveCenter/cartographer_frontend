import React, { Component } from "react";
import ComponentList from './ComponentList'
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
     activeMap: {"title": "", },
     addModal: false,
     editable: this.props.match.params.id ? false : true,
   };
 };
 componentDidMount() {
   this.refreshMap();
 };
 toggleEditable = () => {
   this.setState({editable: !this.state.editable})
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
   console.log(map)
   if (map.id) {
     axios
       .put(`/api/maps/${map.id}/`, map)
       .then(res => this.refreshMap())
       .then(this.toggleEditable());
     return;
   }
   axios
     .post("/api/maps/", map)
     .then(res => window.location = `/maps/${res.data.id}`)
     .then(this.toggleEditable());
 };
 handleComponentSubmit = item => {
   item.map = this.state.activeMap.id;
   if (item.id) {
     return axios
       .put(`/api/components/${item.id}/`, item)
       .then(res => { return res.data })
       .catch(err => console.log(err))
    }
    return axios
       .post("/api/components/", item)
       .then(res => { return res.data })
       .catch(err => console.log(err));
 };
 handleTreeChange = newItems => {
   this.handleChange({"target": {"name": "children", "value": newItems}})
   walk({
     treeData: newItems,
     getNodeKey: ({ node }) => node.id,
     callback: (node) => {
       node.node.parent = node.parentNode ? node.parentNode.id : null
       node.node.tree_index = node.treeIndex
       this.handleComponentSubmit(node.node)
        .then((res) => {node.node.id = res.id});
     },
     ignoreCollapsed: false
   });
 };
 render() {
   return (
     <div>
      <Form className="row mb-4" inline={true}>
        <FormGroup className="col-md-8">
          <Label for="title" hidden>Title</Label>
            <Input
              className="col-md-12"
              type="text"
              name="title"
              onChange={this.handleChange}
              value={this.state.activeMap.title}
              placeholder="Enter Arrangement Map title"
              disabled={this.state.editable ? false : true }
            />
          </FormGroup>
          {this.state.editable ? (
          <div>
            <Button color="primary" className="mr-2" onClick={() => this.handleSubmit(this.state.activeMap)}>
            Save Title
            </Button>
            <Button color="danger" className="mr-2" onClick={this.toggleEditable}>
            Cancel
            </Button>
          </div>
        ) : (
          <div>
            <Button color="primary" className="mr-2" onClick={this.toggleEditable}>
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
      </div>
    );
  }
}

export default MapForm;
