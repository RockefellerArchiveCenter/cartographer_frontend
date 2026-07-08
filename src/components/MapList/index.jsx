import { useEffect, useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'

import { ConfirmModal } from '../Modals'
import Button from '../Button'


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
      <div className='map__header'>
        <h1>Arrangement Maps</h1>
        <a
          className={classnames('btn', 'btn--lg', 'btn--blue', 'btn--new-map')}
          href="/maps/new">
            Add New Map
        </a>
      </div>
      <div className='card card--container'>
        <ul className={classnames('mapList', 'list--unstyled', 'mt-0')}>
          {arrangementMapList && arrangementMapList.length
            ? (arrangementMapList.map((item) => (
            <li key = {item.id}
              className='mapList__item'>
              <div className='mr-10'>{ item.title }</div>
              <div className='mapList__item-actions'>
                <a
                  href={`/maps/${item.id}`}
                  className={classnames('btn', 'btn--sm', 'btn--blue', 'mr-2')}
                  aria-label={`Edit ${item.title}`}>Edit
                </a>
                <Button
                  ariaLabel={`Delete ${item.title}`}
                  onClick={() => toggleModal(item)}
                  className={classnames('btn', 'btn--sm', 'btn--orange')}
                  label='Delete' />
              </div>
            </li>
              )))
            : <li>No Arrangement Maps yet</li>}
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

export default MapList
