import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SortableTree, {
  addNodeUnderParent,
  changeNodeAtPath,
  insertNode,
  removeNode
} from 'react-sortable-tree'
import 'react-sortable-tree/style.css'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'
import { MapComponentModal, ConfirmModal } from './Modals'
import axios from 'axios'

const ComponentList = ({ items, onChange }) => {
  const [detailModal, setDetailModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [activeComponent, setActiveComponent] = useState({ title: '', archivesspace_uri: '' })

  const toggleDetailModal = (item) => {
    setActiveComponent(item)
    setDetailModal(!detailModal)
  }

  const toggleConfirmModal = (item) => {
    setActiveComponent(item)
    setConfirmModal(!confirmModal)
  }

  const handleDelete = (component) => {
    axios
      .delete(`/api/components/${component.id}`)
      .then((res) => {
        return true
      })
      .catch((err) => console.log(err))
  }

  const handleNodeAction = async (e, path) => {
    let treeData = {}
    if (e.id) {
      treeData = await nodeUpdate(e, path)
    } else if (e.parent) {
      treeData = await nodeAddChild(e)
    } else {
      treeData = await nodeAddNew(e)
    }
    onChange(treeData)
    setDetailModal(false)
  }

  const nodeAddChild = (e) => {
    e.updated = true
    const { treeData } = addNodeUnderParent({
      treeData: items,
      newNode: e,
      parentKey: e.parent,
      getNodeKey: ({ node }) => node.id,
      ignoreCollapsed: false,
      expandParent: true
    })
    return treeData
  }

  const nodeAddNew = (e) => {
    e.updated = true
    const { treeData } = insertNode({
      treeData: items,
      depth: 1,
      newNode: e,
      getNodeKey: ({ node }) => node.id,
      minimumTreeIndex: 0
    })
    return treeData
  }

  const nodeDelete = async (e) => {
    const { node, path } = e
    const { treeData } = removeNode({
      treeData: items,
      path,
      getNodeKey: ({ node }) => node.id
    })
    onChange(treeData)
    handleDelete(node)
    setConfirmModal(false)
  }

  const nodeUpdate = (e, path) => {
    e.updated = true
    const treeData = changeNodeAtPath({
      treeData: items,
      path,
      newNode: e,
      getNodeKey: ({ node }) => node.id
    })
    return treeData
  }

  return (
    <div>
      <div className='row'>
        <div className='col-md-12'>
          <div className='card p-3'>
            <div className='mb-3'>
              <button onClick={
                () => toggleDetailModal({ node: { title: '', archivesspace_uri: '', level: '' } })}
              className='btn btn-primary'>
                 Add arrangement map component
              </button>
            </div>
            <ResizableBox
              handleSize={[20, 20]}
              axis='y'
              resizeHandles={['s']}
              height={400}
              width={Infinity}>
              <SortableTree
                treeData={items}
                onChange={onChange}
                getNodeKey={({ node }) => node.id}
                generateNodeProps={ (node) => ({
                  buttons: [
                    <button
                      key={`${node.id}-add`}
                      className='btn btn-sm btn-success mr-2'
                      onClick={
                        () => toggleDetailModal({
                          node: {
                            title: '',
                            archivesspace_uri: '',
                            parent: node.node.id,
                            level: ''
                          }
                        })
                      }
                    >
                      Add Child
                    </button>,
                    <button
                      key={`${node.id}-edit`}
                      className='btn btn-sm btn-secondary mr-2'
                      onClick={() => toggleDetailModal(node)}
                    >
                      Edit
                    </button>,
                    <button
                      key={`${node.id}-delete`}
                      className='btn btn-sm btn-danger'
                      onClick={() => toggleConfirmModal(node)}
                    >
                      Delete
                    </button>
                  ]
                })}
              />
            </ResizableBox>
            <MapComponentModal
              isOpen={detailModal}
              initialComponent={activeComponent.node}
              path={activeComponent.path}
              toggle={toggleDetailModal}
              onSubmit={handleNodeAction}
            />
            <ConfirmModal
              isOpen={confirmModal}
              title='Confirm delete'
              activeItem={activeComponent}
              toggle={toggleConfirmModal}
              onConfirm={() => nodeDelete(activeComponent)}
              message={
                `Are you sure you want to delete \
                ${activeComponent.node && activeComponent.node.title}?`}
              confirmButtonText='Yes, delete'
              cancelButtonText='No, cancel'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

ComponentList.propTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func
}

export default ComponentList
