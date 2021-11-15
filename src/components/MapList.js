import React, { Component } from "react";
import { ConfirmModal } from "./Modals";
import axios from "axios";

class MapList extends Component {
 constructor(props) {
   super(props);
   this.state = {
     deleteModal: false,
     arrangementMapList: []
   };
 }

 componentDidMount() {
   this.refreshList();
   document.title = document.title + ": Arrangement Maps";
 }

 toggleModal = map => {
   this.setState({ activeMap: map, deleteModal: !this.state.deleteModal });
 }

 refreshList = () => {
   axios
     .get("/api/maps/")
     .then(res => this.setState({ arrangementMapList: res.data.results }))
     .catch(err => console.log(err));
 }

 handleDelete = item => {
   axios
     .delete(`/api/maps/${item.id}`)
     .then(res => this.refreshList());
   this.toggleModal(item)
 }

 render() {
   return (
     <div className="row">
      <div className="col-md-12">
       <h1>Arrangement Maps</h1>
       <div className="card p-3">
         <ul className="list-group list-group-flush">
          {this.state.arrangementMapList.length ? (this.state.arrangementMapList.map(item => (
             <li
               key={item.id}
               className="list-group-item d-flex justify-content-between align-items-center"
             >
               <span
                 className="mr-2"
               >
                 {item.title}
               </span>
               <span>
                 <a
                   href={`/maps/${item.id}`}
                   className="btn btn-secondary mr-2"
                 >
                   Edit
                 </a>
                 <button
                   onClick={() => this.toggleModal(item)}
                   className="btn btn-danger"
                 >
                   Delete
                 </button>
               </span>
             </li>
           ))) : "No Arrangement Maps yet"
         }
         </ul>
         {this.state.deleteModal ? (
           <ConfirmModal
             title="Confirm delete"
             activeItem={this.state.activeMap}
             toggle={this.toggleModal}
             onConfirm={() => this.handleDelete(this.state.activeMap)}
             message={`Are you sure you want to delete ${this.state.activeMap.title}?`}
             cancelButtonText="No, cancel"
             confirmButtonText="Yes, delete"
           />
         ) : null}
       </div>
      </div>
    </div>
   );
 }
}

export default MapList;
