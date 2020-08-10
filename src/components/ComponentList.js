import React, { Component } from "react";
import SortableTree, { addNodeUnderParent, changeNodeAtPath, insertNode, removeNode } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { MapComponentModal, ConfirmModal } from './Modals'
import axios from "axios";


class ComponentList extends Component {
 constructor(props) {
   super(props);
   this._isMounted = false;
   this.onChange = this.props.onChange
   this.state = {
     detailModal: false,
     confirmModal: false,
     activeComponent: {title: "", archivesspace_uri: ""},
   };
 }
 toggleDetailModal = item => {
   this.setState({ activeComponent: item, detailModal: !this.state.detailModal });
 };
 toggleConfirmModal = item => {
   this.setState({ activeComponent: item, confirmModal: !this.state.confirmModal });
 };
 handleDelete = component => {
    axios
     .delete(`/api/components/${component.id}`)
     .then(res => { return true; })
     .catch(err => console.log(err));
 };
 handleNodeAction = async (e, path) => {
   let treeData = {}
   if (e.id) {
     treeData = await this.nodeUpdate(e, path)
   } else if (e.parent) {
     treeData = await this.nodeAddChild(e);
   } else {
     treeData = await this.nodeAddNew(e)
   }
   this.onChange(treeData);
   this.setState({detailModal: false})
 };
 nodeAddChild = e => {
   e.updated = true;
   const {treeData} = addNodeUnderParent({
     treeData: this.props.items,
     newNode: e,
     parentKey: e.parent,
     getNodeKey: ({ node }) => node.id,
     ignoreCollapsed: false,
     expandParent: true
   });
   return treeData
 };
 nodeAddNew = e => {
   e.updated = true;
   const {treeData} = insertNode({
     treeData: this.props.items,
     depth: 1,
     newNode: e,
     getNodeKey: ({ node }) => node.id,
     minimumTreeIndex: 0,
   });
   return treeData
 };
 nodeDelete = async e => {
   let {node, path} = e;
   const {treeData} = removeNode({
     treeData: this.props.items,
     path: path,
     getNodeKey: ({node}) => node.id
   });
   this.onChange(treeData);
   this.handleDelete(node);
   this.setState({confirmModal: false})
 };
 nodeUpdate = (e, path) => {
   e.updated = true;
   const treeData = changeNodeAtPath({
     treeData: this.props.items,
     path: path,
     newNode: e,
     getNodeKey: ({ node }) => node.id
   });
   return treeData
 };
 render() {
  return (
     <div>
       <div className="row">
         <div className="col-md-12">
           <div className="card p-3">
             <div className="mb-3">
               <button onClick={() => this.toggleDetailModal({"node": { title: "", archivesspace_uri: "", level: ""}})} className="btn btn-primary">
                 Add arrangement map component
               </button>
             </div>
             <ResizableBox handleSize={[20, 20]} axis="y" resizeHandles={["s"]} height={400} width={Infinity}>
              <SortableTree
                treeData={this.props.items}
                onChange={this.props.onChange}
                getNodeKey={({node}) => node.id}
                generateNodeProps={ node => ({
                  buttons: [
                    <button
                      className="btn btn-sm btn-success mr-2"
                      onClick={() => this.toggleDetailModal({"node": {title: "", archivesspace_uri: "", parent: node.node.id, level: ""}})}
                    >
                      Add Child
                    </button>,
                    <button
                      className="btn btn-sm btn-secondary mr-2"
                      onClick={() => this.toggleDetailModal(node)}
                    >
                      Edit
                    </button>,
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => this.toggleConfirmModal(node)}
                    >
                      Delete
                    </button>,
                  ],
                })}
              />
             </ResizableBox>
             {this.state.detailModal &&
               <MapComponentModal
                 activeComponent={this.state.activeComponent.node}
                 activeMap={this.props.activeMap}
                 path={this.state.activeComponent.path}
                 toggle={this.toggleDetailModal}
                 onSubmit={this.handleNodeAction}
               />}
             {this.state.confirmModal &&
               <ConfirmModal
                 title="Confirm delete"
                 activeItem={this.state.activeComponent}
                 toggle={this.toggleConfirmModal}
                 onConfirm={() => this.nodeDelete(this.state.activeComponent)}
                 message={`Are you sure you want to delete ${this.state.activeComponent.node.title}?`}
                 confirmButtonText="Yes, delete"
                 cancelButtonText="No, cancel"
               />}
           </div>
          </div>
       </div>
     </div>
   );
 }
}

export default ComponentList;
