import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ComponentList from '../ComponentList'
import { ConfirmModal } from '../Modals'
import { walk } from 'react-sortable-tree'
import PropTypes from 'prop-types'
import axios from 'axios'
import classnames from 'classnames'
import Button from '../Button'

const MapForm = ({ appElement }) => {
  const { id } = useParams()
  const [activeMap, setActiveMap] = useState({ title: '' })
  const [publishModal, setPublishModal] = useState(false)
  const [editable, setEditable] = useState(!id)
  const navigate = useNavigate()

  const toggleModal = (map) => {
    setActiveMap(map)
    setPublishModal(!publishModal)
  }

  const togglePublish = (map) => {
    map.publish = !activeMap.publish
    toggleModal(map)
    handleSubmit(map)
  }

  const refreshMap = () => {
    if (id) {
      axios
        .get(`/api/maps/${id}`)
        .then((res) => setActiveMap(res.data))
        .catch((err) => console.log(err))
    }
  }

  const handleChange = (e) => {
    let { name, value } = e.target
    if (e.target.type === 'checkbox') {
      value = e.target.checked
    }
    setActiveMap({ ...activeMap, [name]: value })
  }

  const handleSubmit = (map) => {
    if (map.id) {
      axios
        .put(`/api/maps/${map.id}/`, map)
        .then((res) => {
          refreshMap()
          setEditable(false)
        })
        .catch((err) => console.log(err))
      return
    }
    axios
      .post('/api/maps/', map)
      .then((res) => (window.location = `/maps/${res.data.id}`))
      .then(setEditable(!editable))
      .catch((err) => console.log(err))
  }

  const handleComponentSubmit = (item) => {
    item.map = activeMap.id
    if (item.id) {
      return axios
        .put(`/api/components/${item.id}/`, item)
        .then((res) => {
          return res.data
        })
        .catch((err) => console.log(err))
    }
    return axios
      .post('/api/components/', item)
      .then((res) => {
        return res.data
      })
      .catch((err) => console.log(err))
  }

  const handleTreeChange = (newItems) => {
    handleChange({ target: { name: 'children', value: newItems } })
    walk({
      treeData: newItems,
      getNodeKey: ({ node }) => node.id,
      callback: (node) => {
        const parentNodeId = node.parentNode ? node.parentNode.id : null
        // Check to see if node has been updated
        if (
          node.node.parent !== parentNodeId ||
            node.node.order !== node.treeIndex ||
            node.node.updated
        ) {
          node.node.parent = parentNodeId
          node.node.order = node.treeIndex
          handleComponentSubmit(node.node)
            .then((res) => {
              node.node.id = res.id
              handleChange({ target: { name: 'children', value: newItems } })
            })
            .catch((err) => console.log(err))
        }
      },
      ignoreCollapsed: false
    })
  }

  useEffect(() => {
    refreshMap()
    document.title = id ? document.title + ': Edit Map' : document.title + ': Add New Map'
  }, [id])

  return (
    <div>
      <div className='map__header'>
        <h1>{id ? 'Edit Map' : 'Add New Map'}</h1>
        {id
          ? (
          <Button
            className={classnames('btn--lg', 'btn--blue', 'btn--publish')}
            onClick={() => toggleModal(activeMap)}
            label={activeMap.publish ? 'Unpublish Map' : 'Publish Map'} />)
          : null}
        </div>
      <form
        onSubmit={(e) => e.preventDefault()}>
        <div className="input">
          <label htmlFor="title">Arrangement Map Title</label>
          <input
            className='mb-10'
            name="title"
            type="text"
            id="title"
            value={activeMap.title}
            onChange={handleChange}
            disabled={!editable} />
        </div>
        {editable
          ? (
          <div className='mb-20'>
            <Button
              className={classnames('btn--blue', 'btn--md', 'mr-10')}
              disabled={!activeMap.title}
              onClick={() => {
                handleSubmit(activeMap)
              }}
              label='Save Title' />
            <Button
              className={classnames('btn--orange', 'btn--md', 'btn--cancel-edit')}
              onClick={() => {
                id ? setEditable(!editable) : navigate('/')
              }}
              label='Cancel' />
          </div>
            )
          : (
          <div className='mb-20'>
            <Button
              className={classnames('btn--blue', 'btn--md', 'btn--edit')}
              onClick={(e) => { e.preventDefault(); setEditable(!editable) }}
              label='Edit Title'/>
          </div>
            )}
      </form>
      {activeMap.id &&
          <ComponentList
            appElement={appElement}
            items={activeMap.children ? activeMap.children : []}
            onChange={handleTreeChange}
          />
      }
      <ConfirmModal
        appElement={appElement}
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
  )
}

MapForm.propTypes = {
  appElement: PropTypes.object
}

export default MapForm
