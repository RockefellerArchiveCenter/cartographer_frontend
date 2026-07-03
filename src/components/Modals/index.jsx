import { useEffect, useState } from 'react'
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
  const [isFetching, setIsFetching] = useState(false)
  const [component, setComponent] = useState()
  const [resourceId, setResourceId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setComponent(initialComponent)
  }, [initialComponent])

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
      isOpen={isOpen}
      autoFocus={true}
      className='modal modal--component'
      onRequestClose={toggle}
      appElement={appElement ?? Modal.setAppElement('#root')} >
      <div className='modal__header'>
        <h2 className='modal__header-title'>Arrangement Map Component</h2>
        <button className='modal__header-button' aria-label='Close' onClick={toggle}>
          X
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
            <h3 className='component__title'>{component.title}</h3>
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
                value={resourceId}
                onChange={handleResourceIdChange}
                autoFocus={true} />
            </div>
            <Button
              type='submit'
              className='btn btn--sm btn--dark-gray mt-10'
              onClick={() => fetchResource(resourceId)}
              disabled={!resourceId}
              label= {isFetching ? 'Fetching...' : 'Fetch from ArchivesSpace'}/>
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

export const ConfirmModal = (props) => (
  <Modal
    appElement={props.appElement ?? Modal.setAppElement('#root')}
    isOpen={props.isOpen}
    onRequestClose={props.toggle}
    className='modal modal--confirm'>
    <div className='modal__header'>
      <h2 className='modal__header-title'>{props.title}</h2>
      <button className='modal__header-button' aria-label='Close' onClick={props.toggle}>
        X
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
)
