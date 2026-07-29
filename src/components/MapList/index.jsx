import { useEffect, useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'

import { ConfirmModal } from '../Modals'
import Button from '../Button'


const MapList = ({ appElement }) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [publishModal, setPublishModal] = useState(false)
  const [arrangementMapList, setArrangementMapList] = useState([])
  const [activeMap, setActiveMap] = useState()

  const refreshList = () => {
    axios
      .get('/api/maps/')
      .then((res) => setArrangementMapList(res.data.results))
      .catch((err) => console.log(err))
  }

  const toggleDeleteModal = (map) => {
    setActiveMap(map)
    setDeleteModal(!deleteModal)
  }

  const togglePublishModal = (map) => {
    setActiveMap(map)
    setPublishModal(!publishModal)
  }

  const togglePublishMap = (map) => {
    map.publish = !activeMap.publish
    togglePublishModal(map)
    axios
        .put(`/api/maps/${map.id}/`, map)
        .then((res) => {setActiveMap(res.data)})
        .catch((err) => console.log(err))
  }

  const handleDeleteMap = (item) => {
    axios
      .delete(`/api/maps/${item.id}`)
      .then((res) => refreshList())
      .catch((e) => console.log(e))
      .then(toggleDeleteModal(item))
  }

  useEffect(() => {
    refreshList()
    document.title = 'Arrangement Maps: Cartographer'
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
                  onClick={() => toggleDeleteModal(item)}
                  className={classnames('btn', 'btn--sm', 'btn--orange', 'mr-2')}
                  label='Delete' />
                <Button
                  ariaLabel={(`${item.publish ? 'Unpublish' : 'Publish'} ${item.title}`)}
                  className={classnames('btn', 'btn--sm', 'btn--dark-gray', 'btn--publish')}
                  onClick={() => togglePublishModal(item)}
                  label={item.publish ? 'Unpublish Map' : 'Publish Map'} />
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
          toggle={toggleDeleteModal}
          onConfirm={() => handleDeleteMap(activeMap)}
          message={`Are you sure you want to delete ${activeMap && activeMap.title}?`}
          cancelButtonText = 'No, cancel'
          confirmButtonText = 'Yes, delete' />
      <ConfirmModal
        appElement={appElement}
        isOpen={publishModal}
        title={`Confirm ${activeMap && activeMap.publish ? 'unpublish' : 'publish'}`}
        activeItem={activeMap}
        toggle={() => togglePublishModal(activeMap)}
        onConfirm={() => togglePublishMap(activeMap)}
        message={
          `Are you sure you want to ${activeMap && activeMap.publish ? 'unpublish' : 'publish'} \
          "${activeMap && activeMap.title}"? ${activeMap && activeMap.publish ? 'Unpublishing' : 'Publishing'} \
          this map will result in all related resource records in ArchivesSpace being \
          ${activeMap && activeMap.publish ? 'unpublished' : 'published'} as well.`}
        cancelButtonText='Cancel'
        confirmButtonText={activeMap && activeMap.publish ? 'Unpublish' : 'Publish'}
      />
    </>
  )
}

export default MapList
