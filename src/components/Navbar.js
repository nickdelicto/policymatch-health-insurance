import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-blue-500 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">

            <div className="text-lg font-bold">InsuranceFinder</div>
              <ul className="flex space-x-4">
                  <li>
                      <Link to="/" className="hover:text-yellow-200 transition duration-300">Home</Link>
                  </li>
                  <li>
                      <Link to="/compare" className="hover:text-blue-200 transition duration-300">Compare Products</Link>
                  </li>
                  {/* Add more navigation bar links as needed */}
              </ul>

            </div>
        </nav>
    );
};

export default Navbar;