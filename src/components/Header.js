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
        <nav className='nav-right' aria-label='Main'>
          <ul className='nav__list'>
            <li className="nav__item btn--navy">
              <a className="nav__link" href="/maps/new">
                Add New Map
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>)

export default Header
