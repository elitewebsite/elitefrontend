import Sidebars from './Component/Sidebar'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Component/Dashboard';

import Homepage from './Component/Home Page/Homepage';

import Createadmin from './Component/Admin/Createadmin';
import Admintable from './Component/Admin/Admintable';

import Mainlightcategory from './Component/Main Light Category/Mainlightcategory';
import Lightcategorytable from './Component/Main Light Category/Lightcategorytable';
import Updatemainlightcategory from './Component/Main Light Category/Updatemainlightcategory';

import Addlightseries from './Component/Light Series/Addlightseries';
import Seriestable from './Component/Light Series/Seriestable';
import Updatelightseries from './Component/Light Series/Updatelightseries'

import Addproducts from './Component/Products/Addproducts';
import Productstable from './Component/Products/Productstable';
import Updateproduct from "./Component/Products/Updateproduct";
import Login from './Component/LogIn/Login'
import Logout from './Component/LogIn/Logout'
function App() {
  return (
    <div className="App flex">

      <BrowserRouter>
        <Sidebars />
        <Routes>
          <Route path="/" index element={<Dashboard />} />
          <Route path='/createadmin' element={<Createadmin />} />
          <Route path='/admintable' element={<Admintable />} />
          <Route path='/mainlight' element={<Mainlightcategory />} />
          <Route path='/lightcategorytable' element={<Lightcategorytable />} />
          <Route path='/addseries' element={<Addlightseries />} />
          <Route path='/seriestable' element={<Seriestable />} />
          <Route path='/addproducts' element={<Addproducts />} />
          <Route path='/productstable' element={<Productstable />} />
          <Route path='/home' element={<Homepage />} />
          <Route path='/updatemainlightcategory' element={<Updatemainlightcategory />} />
          <Route path='/updatelightseries' element={<Updatelightseries />} />
          <Route path='/updateproduct' element={<Updateproduct />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
        </Routes>

      </BrowserRouter>

    </div>
  );
}
export default App;