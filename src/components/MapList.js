import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ConfirmModal } from './Modals'
import Button from './Button'
import axios from 'axios'

const MapList = ({ appElement }) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [arrangementMapList, setArrangementMapList] = useState([])
  const [activeMap, setActiveMap] = useState()

  const refreshList = () => {
    axios
      .get('/api/maps/')
      .then((res) => setArrangementMapList(res.data.results))
      .catch((err) => console.log(err))
  }

  const toggleModal = (map) => {
    setActiveMap(map)
    setDeleteModal(!deleteModal)
  }

  const handleDelete = (item) => {
    axios
      .delete(`/api/maps/${item.id}`)
      .then((res) => refreshList())
      .catch((e) => console.log(e))
      .then(toggleModal(item))
  }

  useEffect(() => {
    refreshList()
    document.title = document.title + ': Arrangement Maps'
  }, [])

  return (
    <>
      <h1>Arrangement Maps</h1>
      <div className='card card--container'>
        <ul className='mapList list--unstyled mt-0'>
          {arrangementMapList.length
            ? (arrangementMapList.map((item) => (
            <li key = {item.id}
              className='mapList__item'>
              <span className='mr-10'>{ item.title }</span>
              <span>
                <a
                  href={`/maps/${item.id}`}
                  className='btn btn--sm btn--blue mr-2'
                  aria-label={`Edit ${item.title}`}>Edit
                </a>
                <Button
                  ariaLabel={`Delete ${item.title}`}
                  onClick={() => toggleModal(item)}
                  className='btn btn--sm btn--orange'
                  label='Delete' />
              </span>
            </li>
              )))
            : 'No Arrangement Maps yet'}
        </ul>
      </div>
      <ConfirmModal
          appElement={appElement}
          isOpen={deleteModal}
          title='Confirm delete'
          activeItem={activeMap}
          toggle={toggleModal}
          onConfirm={() => handleDelete(activeMap)}
          message={`Are you sure you want to delete ${activeMap && activeMap.title}?`}
          cancelButtonText = 'No, cancel'
          confirmButtonText = 'Yes, delete' />
    </>
  )
}

MapList.propTypes = {
  appElement: PropTypes.object
}

export default MapList
