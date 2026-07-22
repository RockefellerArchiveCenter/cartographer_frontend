import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

import Modal from 'react-modal'
import Button from '../Button'


export const MapComponentModal = ({
  appElement,
  initialComponent,
  isOpen,
  onSubmit,
  path,
  toggle
}) => {
  const closeButtonRef = useRef(null)
  const componentTitleRef = useRef(null)
  const [isFetching, setIsFetching] = useState(false)
  const [component, setComponent] = useState()
  const [resourceId, setResourceId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setComponent(initialComponent)
  }, [initialComponent])

  useEffect(() => {
    if (component?.title) {
      componentTitleRef.current?.focus()
    }
}, [component])

  const handleResourceIdChange = (e) => {
    const { value } = e.target
    setResourceId(value)
  }

  const toggleData = (data) => {
    if (data.data) {
      setComponent(
        {
          ...component,
          archivesspace_uri: data.data.uri,
          title: data.data.title,
          level: data.data.level
        })
      return
    }
    setComponent({ ...component, archivesspace_uri: '', title: '', level: '' })
    setResourceId('')
  }

  const fetchResource = (resourceId) => {
    if (!isFetching) {
      setIsFetching(true)
      setError('')
      axios
        .get(`/api/fetch-resource/${resourceId}`)
        .then((res) => toggleData(res))
        .catch((error) => setError(error.response.data))
        .then((res) => setIsFetching(false))
    }
  }

  return (
    <Modal
      appElement={appElement ?? Modal.setAppElement('#root')}
      isOpen={isOpen}
      onRequestClose={toggle}
      className='modal modal--component'
      overlayClassName='modal__overlay'
      onAfterOpen={() => {
        closeButtonRef.current?.focus()
      }}
      aria={{ labelledby: 'arrangement-map-component' }} >
      <div className='modal__header'>
        <h2 id='arrangement-map-component' className='modal__header-title'>Arrangement Map Component</h2>
        <button className='modal__header-button' aria-label='Close' ref={closeButtonRef} onClick={toggle}>
          <span className="material-icon" aria-hidden="true">close</span>
        </button>
      </div>
      <div className='modal-body p-20'>
        { error
          ? (
            <div className="alert alert--orange" role="alert">
            <div className="alert__text-wrapper">
              <p className="alert__text">
                Error message: {error}
              </p>
            </div>
          </div>)
          : <div role="alert"></div> }
        { component && component.archivesspace_uri
          ? (
        <div className='card card--container mt-2'>
          <div>
            <h3
              ref={componentTitleRef}
              tabIndex={-1}
              className='component__title'>{component.title}
            </h3>
            <p className='component__uri'>{component.archivesspace_uri}</p>
            <Button
              className='btn--sm btn--orange'
              onClick={toggleData}
              label='Clear' />
          </div>
        </div>
            )
          : (
        <div>
          <form onSubmit={(e) => {
            fetchResource(resourceId); e.preventDefault()
          }}>
            <div className="input">
              <label htmlFor="resourceId">ArchivesSpace Resource ID</label>
              <input
                name="resourceId"
                type="number"
                id="resourceId"
                required={true}
                value={resourceId}
                onChange={handleResourceIdChange} />
            </div>
            <Button
              type='submit'
              className='btn btn--sm btn--dark-gray mt-10'
              onClick={() => fetchResource(resourceId)}
              label= {isFetching ? 'Fetching...' : 'Fetch Resource'}/>
          </form>
        </div>)}
        <div className='mt-20'>
          <Button
            className='btn--md btn--blue mr-10'
            onClick={() => onSubmit(component, path)}
            disabled={component && !component.title}
            label='Save' />
          <Button
            className='btn--md btn--orange'
            onClick={toggle}
            label='Cancel' />
        </div>
      </div>
    </Modal>
  )
}

export const ConfirmModal = (props) => {
  const closeButtonRef = useRef(null);

  return (
    <Modal
      appElement={props.appElement ?? Modal.setAppElement('#root')}
      isOpen={props.isOpen}
      onRequestClose={props.toggle}
      className='modal modal--confirm'
      overlayClassName='modal__overlay'
      onAfterOpen={() => {
        closeButtonRef.current?.focus();
      }}
      aria={{ labelledby: 'confirm-modal' }}>
      <div className='modal__header'>
        <h2 id='confirm-modal' className='modal__header-title'>{props.title}</h2>
        <button className='modal__header-button' aria-label='Close' ref={closeButtonRef} onClick={props.toggle}>
          <span className="material-icon" aria-hidden="true">close</span>
        </button>
      </div>
      <div className='modal-body--confirm px-40 py-40'>
        <div className='modal-message pb-40'>
          {props.message}
        </div>
        <div className='modal-buttons'>
          <Button
            className='btn--md btn--blue mr-10'
            onClick={props.onConfirm}
            label={props.confirmButtonText} />
          <Button
            className='btn--md btn--orange'
            onClick={props.toggle}
            label={props.cancelButtonText} />
        </div>
      </div>
    </Modal>
  )}
