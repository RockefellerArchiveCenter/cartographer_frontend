import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
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
  Label,
} from 'reactstrap';
import axios from 'axios';

export const MapComponentModal = ({initialComponent, isOpen, onSubmit, path, toggle}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [component, setComponent] = useState();
  const [resourceId, setResourceId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setComponent(initialComponent);
  }, [initialComponent]);

  const handleResourceIdChange = (e) => {
    const {value} = e.target;
    setResourceId(value);
  };

  const toggleData = (data) => {
    if (data.data) {
      setComponent(
          {...component,
            archivesspace_uri: data.data.uri,
            title: data.data.title,
            level: data.data.level});
      return;
    }
    setComponent({...component, archivesspace_uri: '', title: '', level: ''});
    setResourceId('');
  };

  const fetchResource = (resourceId) => {
    if (!isFetching) {
      setIsFetching(true);
      setError('');
      axios
          .get(`/api/fetch-resource/${resourceId}`)
          .then((res) => toggleData(res))
          .catch((error) => setError(error.response.data))
          .then((res) => setIsFetching(false));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} autoFocus={true} className='modal__component modal-md'>
      <ModalHeader tag='h2'>Arrangement Map Component</ModalHeader>
      <ModalBody>
        <Row>
          <Col sm='12'>
            { error ? (
            <Alert className='mt-2' color='danger'>
              {error}
            </Alert>) : null }
            { component && component.archivesspace_uri ? (
            <div className='mt-2'>
              <p className='h5'>{component.title}</p>
              <p className='text-muted'>{component.archivesspace_uri}</p>
              <Button
                color='warning'
                onClick={toggleData}>
                Clear
              </Button>
            </div>
          ) : (
            <div>
              <Form onSubmit={(e) => {
                fetchResource(resourceId); e.preventDefault();
              }}>
                <FormGroup>
                  <Label for='resourceId'>ArchivesSpace Resource ID</Label>
                  <Input
                    autoFocus={true}
                    type='number'
                    name='resourceId'
                    id='resourceId'
                    value={resourceId}
                    onChange={handleResourceIdChange}
                  />
                </FormGroup>
                <Button
                  type='submit'
                  className='btn btn-sm btn-secondary'
                  onClick={() => fetchResource(resourceId)}
                  disabled={!resourceId}>
                  {isFetching ? 'Fetching...' : 'Fetch from ArchivesSpace'}
                </Button>
              </Form>
            </div>)}
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          color='primary'
          onClick={() => onSubmit(component, path)}
          disabled={component && !component.title}>
          Save
        </Button>
        <Button
          color='danger'
          onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

MapComponentModal.propTypes = {
  initialComponent: PropTypes.object,
  isOpen: PropTypes.bool,
  onSubmit: PropTypes.func,
  path: PropTypes.string,
  toggle: PropTypes.func,
};

export const ConfirmModal = ({
  isOpen,
  toggle,
  title,
  message,
  onConfirm,
  cancelButtonText,
  confirmButtonText,
}) => (
  <Modal isOpen={isOpen} toggle={toggle} className='modal__confirm'>
    <ModalHeader tag='h2' toggle={toggle}>{title}</ModalHeader>
    <ModalBody>
      {message}
    </ModalBody>
    <ModalFooter>
      <Button color='primary' onClick={onConfirm}>
        {confirmButtonText}
      </Button>
      <Button color='danger' onClick={toggle}>
        {cancelButtonText}
      </Button>
    </ModalFooter>
  </Modal>
);

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  onConfirm: PropTypes.func,
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
};
