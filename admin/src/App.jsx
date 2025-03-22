import Sidebar from './components/Sidebar/Sidebar'
import '@fortawesome/fontawesome-free/css/all.min.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Guides from './components/Guides/Guides';
import Hotels from './components/Hotels/Hotels';
import Admin from './pages/Admin/Admin';
import AddGuide from './components/AddGuide/AddGuide';
import AddHotel from './components/AddHotel/AddHotel';
import AddTransportationService from './components/AddTransportationService/AddTransportationService';
import AddRestaurant from './components/AddRestaurant/AddRestaurant';
import AddDestination from './components/AddDestination/AddDestination';
import HotelDataTable from './pages/HotelDataTable/HotelDataTable';
import TransportModeDataTable from './pages/TransportModeDataTable/TransportModeDataTable';
import ResturantDataTable from './pages/RasturantDataTable/ResturantDataTable';
import GuideDataTable from './pages/GuidesDataTable/GuideDataTable';
import DestinationsDataTable from './pages/DestinationsDataTable/DestinationsDataTable';
import TranspotationServices from './components/TranspotationServices/TranspotationServices';
import Restaurants from './components/Restaurants/Restaurants';
import AddPrePlannedTrips from './components/AddPrePlannedTrips/AddPrePlannedTrips';
import ViewHotel from './components/ViewHotel/ViewHotel';
import ViewGuide from './components/ViewGuide/ViewGuide';
import ViewDestination from './components/ViewDestination/ViewDestination';
import ViewRestaurant from './components/ViewRestaurant/ViewRestaurant';
import ViewTransportationService from './components/ViewTransportationServices/ViewTransportationServices';
import ManageRooms from './components/ViewHotel/ManageRooms';
import AddRoom from './components/ViewHotel/AddNewRoom';
import HotelBookings from './pages/HotelBookings/HotelBookings';
import GuidBooking from '../../backend/models/GuidBookings';
import GuideBookingsAdmin from './pages/GuideBooking/GuideBookingsAdmin';
import ManageVehicals from './components/ViewTransportationServices/ManageVehicals';
import AddVehicle from './components/ViewTransportationServices/AddVehical';
import TransportBookingsAdmin from './pages/TransportBooking/TransportBookingAdmin';


const App = () => {
  
  return (
    <>
      <BrowserRouter>
        <Sidebar />
        <div style={{ marginLeft: '250px', padding: '20px' }}>
          <Routes>
            <Route path="/guides" element={<Guides />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/destinations" element={<DestinationsDataTable />} />
            <Route path="/home" element={<Admin />} />
            <Route path='/add-new-guide' element={<AddGuide />} />
            <Route path='/add-restaurant' element={<AddRestaurant />} />
            <Route path='/add-destination' element={<AddDestination />} />
            <Route path='/add-new-hotel' element={<AddHotel />} />
            <Route path='/add-transportation-service' element={<AddTransportationService />} />
            <Route path='/add-pre-planned-trips' element={<AddPrePlannedTrips />} />
            <Route path="/hotel-data-table" element={<HotelDataTable />} />
            <Route path="/transport-mode-data-table" element={<TransportModeDataTable />} />
            <Route path="/resturant-data-table" element={<ResturantDataTable />} />
            <Route path="/guide-data-table" element={<GuideDataTable />} />
            <Route path="/destinations-data-table" element={<DestinationsDataTable />} />
            <Route path='/transportmodes' element={<TranspotationServices/>}/>
            <Route path='/restaurants' element={<Restaurants/>}/>
            <Route path="/view-hotel/:id" element={<ViewHotel />} />
            <Route path="/view-guide/:id" element={<ViewGuide />} />
            <Route path="/view-destination/:id" element={<ViewDestination />} />
            <Route path="/view-restaurant/:id" element={<ViewRestaurant />} />
            <Route path="/view-transportation-service/:id" element={<ViewTransportationService />} />
            <Route path="/manage-rooms"    element={<ManageRooms/>} />
            <Route path="/add-room" element={<AddRoom/>} />
            <Route path="/add-room" element={<AddRoom/>} />
            <Route path="/manage-hotel-bookings" element={<HotelBookings/>} />



            <Route path="/manage-guide-bookings" element={<GuideBookingsAdmin/>} />
            <Route path="/manage-vehicals/:id" element={<ManageVehicals/>} />
            <Route path="/add-vehical" element={<AddVehicle/>} />



            <Route path="/manage-transport-bookings" element={<TransportBookingsAdmin/>} />



          </Routes>
        </div>
      </BrowserRouter>
    </>

  )
   
}

export default App;
