import React, {useEffect, useState} from 'react';
import {ConfirmModal} from './Modals';
import axios from 'axios';

const MapList = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [arrangementMapList, setArrangementMapList] = useState([]);
  const [activeMap, setActiveMap] = useState();

  const refreshList = () => {
    axios
        .get('/api/maps/')
        .then((res) => setArrangementMapList(res.data.results))
        .catch((err) => console.log(err));
  };

  const toggleModal = (map) => {
    setActiveMap(map);
    setDeleteModal(!deleteModal);
  };

  const handleDelete = (item) => {
    axios
        .delete(`/api/maps/${item.id}`)
        .then((res) => refreshList())
        .catch((e) => console.log(e))
        .then(toggleModal(item));
  };

  useEffect(() => {
    refreshList();
    document.title = document.title + ': Arrangement Maps';
  }, []);


  return (
    <div className='row'>
      <div className='col-md-12'>
        <h1>Arrangement Maps</h1>
        <div className='card p-3'>
          <ul className='list-group list-group-flush'>
            {arrangementMapList.length ? (arrangementMapList.map((item) => (
              <li
                key = {item.id}
                className = 'list-group-item d-flex justify-content-between align-items-center'>
                <span className='mr-2'>{ item.title }</span>
                <span>
                  <a href={`/maps/${item.id}`} className='btn btn-secondary mr-2'>Edit</a>
                  <button onClick = {() => toggleModal(item)} className='btn btn-danger'>
                    Delete
                  </button>
                </span>
              </li>
            ))) : 'No Arrangement Maps yet'}
          </ul>
          <ConfirmModal
            isOpen={deleteModal}
            title='Confirm delete'
            activeItem={activeMap}
            toggle={toggleModal}
            onConfirm={() => handleDelete(activeMap)}
            message={`Are you sure you want to delete ${activeMap && activeMap.title}?`}
            cancelButtonText = 'No, cancel'
            confirmButtonText = 'Yes, delete' />
        </div>
      </div>
    </div>
  );
};

export default MapList;
