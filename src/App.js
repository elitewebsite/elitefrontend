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
import Userqueries from './Component/Queries/Userqueries';
import Branches from './Component/Dynamic Branches/Branches';
import BranchesDetails from './Component/Dynamic Branches/BranchesDetails';
import Updatebranchdetails from './Component/Dynamic Branches/Updatebranchdetails';
import GalleryPage from './Component/Gallery/GalleryPage';
import GalleryTable from './Component/Gallery/GalleryTable';
import Productorder from './Component/Changeorder/Productorder';
import FeaturedPage from './Component/Featured Products/FeaturedPage';
import FeaturedProductsTable from './Component/Featured Products/FeaturedProductsTable';
import Mainpage from './Mainpage';
import cheackAuth from './Auth';

//userQueries

function App() {
  return (
    <div className="App flex">

      <BrowserRouter>
        {/* <Sidebars /> */}

        <Routes>
          <Route path="/" index element={<Dashboard />} />
          {/* <Route path="/login" element={<Login />} /> */}
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
          <Route path='/queries' element={<Userqueries />} />
          <Route path='/branches' element={<Branches />} />
          <Route path='/branchesdetails' element={<BranchesDetails />} />
          <Route path='/updatebranch' element={<Updatebranchdetails />} />
          <Route path='/gallerypage' element={<GalleryPage />} />
          <Route path='/gallerytable' element={<GalleryTable />} />
          <Route path='/productorder' element={<Productorder />} />
          <Route path='/featuredproducts' element={<FeaturedPage />} />
          <Route path='/featuredproductstable' element={<FeaturedProductsTable />} />
        </Routes>
      </BrowserRouter>

    </div >
  );
}
export default App;