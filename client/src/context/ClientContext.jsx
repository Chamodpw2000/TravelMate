import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const ClientContext = createContext(null);

const ClientContextProvider = (props) => {
    const [allHotelReviews, setAllHotelReviews] = useState([]);
    const [allGuideReviews, setAllGuideReviews] = useState([]);
    const [allAccommodations, setAllAccommodations] = useState([]);
    const [allTravelMateFeedback, setAllTravelMateFeedback] = useState([]);
    const [allGuides, setAllGuides] = useState([]);
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [allPrePlannedTrips, setAllPrePlannedTrips] = useState([]);
    const [allDetails, setAllDetails] = useState([]);
    const [allCities, setAllCities] = useState([]);
    const [allRestaurantReviews, setAllRestaurantReviews] = useState([]);
    const [allDestinations, setAllDestinations] = useState([]);
    const [allTransportServices, setAllTransportServices] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/cities/getCities")
            .then((res) => {
                setAllCities(res.data);
            })
            .catch((err) => {
                console.log("Error is", err);
            });

        axios
            .get("http://localhost:3000/travelmate/getdata")
            .then((response) => {
                console.log("All Details:", response.data);
                setAllDetails(response.data);
            })
            .catch((error) => {
                console.log("All Details fetch error:", error);
            });

            axios.get("http://localhost:3000/transportation/getAllTransportServices")
            .then((response) => {
                console.log("All Transport Services:", response.data);
                setAllTransportServices(response.data);
            })
            .catch((error) => {
                console.log("All Transport Services fetch error:", error);
            });

        axios
            .get("http://localhost:3000/travelmate/allAccomodations")
            .then((response) => {
                console.log("Accommodations:", response.data);
                setAllAccommodations(response.data);
            })
            .catch((error) => {
                console.log("Accommodations fetch error:", error);
            });



        axios
            .get("http://localhost:3000/travelmate/gettravelmatefeedback")
            .then((response) => {
                console.log("Feedback:", response.data);
                setAllTravelMateFeedback(response.data);
            })
            .catch((error) => {
                console.log("Feedback fetch error:", error);
            });

        axios
            .get("http://localhost:3000/travelmate/allGuides")
            .then((response) => {
                console.log("Guides:", response.data);
                setAllGuides(response.data);
            })
            .catch((error) => {
                console.log("Guides fetch error:", error);
            });

        axios
            .get("http://localhost:3000/travelmate/allRestaurants")
            .then((response) => {
                console.log("Restaurants:", response.data);
                setAllRestaurants(response.data);
            })
            .catch((error) => {
                console.log("Restaurants fetch error:", error);
            });

        axios
            .get("http://localhost:3000/travelmate/allPrePlannedTrips")
            .then((response) => {
                console.log("PrePlannedTrips:", response.data);
                setAllPrePlannedTrips(response.data);
            })
            .catch((error) => {
                console.log("PrePlannedTrips fetch error:", error);
            });

        axios
            .get("http://localhost:3000/travelmate/getAllRestaurantReviews")
            .then((response) => {
                console.log("Restaurant Reviews:", response.data);
                setAllRestaurantReviews(response.data);
            })
            .catch((error) => {
                console.log("Restaurant Review fetch error:", error);
            });

        axios
            .get("http://localhost:3000/travelmate/getAllHotelReviews")
            .then((response) => {
                console.log("Hotel Reviews:", response.data);
                setAllHotelReviews(response.data);
            })
            .catch((error) => {
                console.log("Hotel Review fetch error:", error);
            });

        axios
            .get("http://localhost:3000/travelmate/getAllGuideReviews")
            .then((response) => {
                console.log("Guide Reviews:", response.data);
                setAllGuideReviews(response.data);
            })
            .catch((error) => {
                console.log("Guide Review fetch error:", error);
            });

        axios
            .get('http://localhost:3000/travelmate/getAllRestaurantReviews')
            .then((response) => {
                console.log('Restaurant Reviews:', response.data);
                setAllRestaurantReviews(response.data);
            })
            .catch((error) => {
                console.log('Restaurant Review fetch error:', error);
            });

        axios
            .get('http://localhost:3000/travelmate/allDestinations')
            .then((response) => {
                console.log('All Destinations:', response.data);
                setAllDestinations(response.data);
            })
            .catch((error) => {
                console.log('Destination data fetch error:', error);
            });
    }, []);

    const contextValue = {
        allAccommodations,
        allTravelMateFeedback,
        allGuides,
        allRestaurants,
        allPrePlannedTrips,
        allDetails,
        allCities,
        allRestaurantReviews,
        allHotelReviews,
        allGuideReviews,
        allDestinations,
        allTransportServices,
    };

    return (
        <ClientContext.Provider value={contextValue}>
            {props.children}
        </ClientContext.Provider>
    );
};

export default ClientContextProvider;
