import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ComponentList from './ComponentList';
import {ConfirmModal} from './Modals';
import {walk} from 'react-sortable-tree';
import axios from 'axios';
import {Button, Form, FormGroup, Input, Label} from 'reactstrap';

const MapForm = () => {
  const {id} = useParams();
  const [activeMap, setActiveMap] = useState({'title': ''});
  const [publishModal, setPublishModal] = useState(false);
  const [editable, setEditable] = useState(id ? false : true);
  const navigate = useNavigate();

  const toggleModal = (map) => {
    setActiveMap(map);
    setPublishModal(!publishModal);
  };

  const togglePublish = (map) => {
    map.publish = !activeMap.publish;
    toggleModal(map);
    handleSubmit(map);
  };

  const refreshMap = () => {
    if (id) {
      axios
          .get(`/api/maps/${id}`)
          .then((res) => setActiveMap(res.data))
          .catch((err) => console.log(err));
    }
  };

  const handleChange = (e) => {
    let {name, value} = e.target;
    if (e.target.type === 'checkbox') {
      value = e.target.checked;
    }
    setActiveMap({...activeMap, [name]: value});
  };

  const handleSubmit = (map) => {
    if (map.id) {
      axios
          .put(`/api/maps/${map.id}/`, map)
          .then((res) => {
            refreshMap();
            setEditable(false);
          })
          .catch((err) => console.log(err));
      return;
    }
    axios
        .post('/api/maps/', map)
        .then((res) => window.location = `/maps/${res.data.id}`)
        .then(setEditable(!editable))
        .catch((err) => console.log(err));
  };

  const handleComponentSubmit = (item) => {
    item.map = activeMap.id;
    if (item.id) {
      return axios
          .put(`/api/components/${item.id}/`, item)
          .then((res) => {
            return res.data;
          })
          .catch((err) => console.log(err));
    }
    return axios
        .post('/api/components/', item)
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err));
  };

  const handleTreeChange = (newItems) => {
    handleChange({'target': {'name': 'children', 'value': newItems}});
    walk({
      treeData: newItems,
      getNodeKey: ({node}) => node.id,
      callback: (node) => {
        const parentNodeId = node.parentNode ? node.parentNode.id : null;
        // Check to see if node has been updated
        if (
          node.node.parent !== parentNodeId ||
            node.node.order !== node.treeIndex ||
            node.node.updated
        ) {
          node.node.parent = parentNodeId;
          node.node.order = node.treeIndex;
          handleComponentSubmit(node.node)
              .then((res) => {
                node.node.id = res.id;
                handleChange({'target': {'name': 'children', 'value': newItems}});
              })
              .catch((err) => console.log(err));
        }
      },
      ignoreCollapsed: false,
    });
  };

  useEffect(() => {
    refreshMap();
    document.title = id ? document.title + ': Edit Map' : document.title + ': Add New Map';
  }, [id]);

  return (
    <div>
      <div className='row mb-3'>
        <div className='col-12 col-sm-6'>
          <h1>{id ? 'Edit Map' : 'Add New Map'}</h1>
        </div>
        <div className='col-12 col-sm-6'>
          {id ? (
           <Button
             color={activeMap.publish ? 'danger' : 'success'}
             size='lg'
             className='float-right'
             outline={true}
             onClick={() => toggleModal(activeMap)} >
             {activeMap.publish ? 'Unpublish Map' : 'Publish Map'}
           </Button>): null}
        </div>
      </div>
      <Form
        className='row mb-4'
        onSubmit={(e) => {
          e.preventDefault(); handleSubmit(activeMap);
        }} >
        <FormGroup className='col-12 col-lg-8'>
          <Label for='title'>Arrangement Map Title</Label>
          <Input
            className='col-sm-12'
            type='text'
            name='title'
            id='title'
            onChange={handleChange}
            value={activeMap.title}
            disabled={!editable} />
        </FormGroup>
        {editable ? (
          <div className='col-6'>
            <Button
              color='primary'
              className='mr-2'
              disabled={!activeMap.title}
              onClick={() => handleSubmit(activeMap)} >
            Save Title
            </Button>
            <Button
              color='danger'
              className='mr-2'
              onClick={() => {
id ? setEditable(!editable) : navigate('/');
              }}>
            Cancel
            </Button>
          </div>
        ) : (
          <div className='col-6'>
            <Button
              color='primary'
              className='mr-2'
              onClick={() => setEditable(!editable)} >
            Edit Title
            </Button>
          </div>
        )}
      </Form>
      {activeMap.id &&
          <ComponentList
            items={activeMap.children ? activeMap.children : []}
            onChange={handleTreeChange}
          />
      }
      <ConfirmModal
        isOpen={publishModal}
        title={`Confirm ${activeMap.publish ? 'unpublish' : 'publish'}`}
        activeItem={activeMap}
        toggle={() => toggleModal(activeMap)}
        onConfirm={() => togglePublish(activeMap)}
        message={
          `Are you sure you want to ${activeMap.publish ? 'unpublish' : 'publish'} \
          ${activeMap.title}? ${activeMap.publish ? 'Unpublishing' : 'Publishing'} \
          this map will result in all related resource records in ArchivesSpace being \
          ${activeMap.publish ? 'unpublished' : 'published'} as well.`}
        cancelButtonText='Cancel'
        confirmButtonText={activeMap.publish ? 'Unpublish' : 'Publish'}
      />
    </div>
  );
};

export default MapForm;
