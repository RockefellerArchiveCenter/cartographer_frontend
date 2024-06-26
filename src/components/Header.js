import React from 'react'

const Header = () => (
  <header className='header header--blue'>
    <div className='wrapper'>
      <div className='container flex'>
        <div className='header__brand header__brand--text'>
          <a href='/' id='home' className='header__brand-title'>
            Cartographer
          </a>
          <p className='header__brand-subtitle'>
            Mapping Large Collections
          </p>
        </div>
      </div>
    </div>
  </header>)

export default Header
