import HomePage from "../pages/HomePage";
import PersonDetail from "../pages/PersonDetail";
import FavoriteList from "../pages/FavoriteList";
import MediaDetail from "../pages/MediaDetail";
import MediaList from "../pages/MediaList";
import MediaSearch from "../pages/MediaSearch";
import PasswordUpdate from "../pages/PasswordUpdate";
import ReviewList from "../pages/ReviewList";
import ProtectedPage from "../components/common/ProtectedPage";
import Booking from "../pages/Booking";
import BookingHistory from "../pages/BookingHistory";
import MovieComparisonPage from '../pages/MovieComparisonPage';
import MovieCompareSelect from '../pages/MovieCompareSelect';

export const routesGen = {
  home: "/",
  mediaList: (type) => `/${type}`,
  mediaDetail: (type, id) => `/${type}/${id}`,
  mediaSearch: "/search",
  person: (id) => `/person/${id}`,
  favoriteList: "/favorites",
  reviewList: "/reviews",
  passwordUpdate: "password-update",
  booking: (movieId) => `/booking/${movieId}`,
  bookingHistory: "/my-bookings",
  movieComparison: {
    path: '/compare/:movie1Id/:movie2Id',
    state: 'movie.comparison'
  },
  movieCompareSelect: {
    path: '/movie/compare',
    state: 'movie.compare.select'
  }
};

const routes = [
  {
    index: true,
    element: <HomePage />,
    state: "home"
  },
  {
    path: "/person/:personId",
    element: <PersonDetail />,
    state: "person.detail"
  },
  {
    path: "/search",
    element: <MediaSearch />,
    state: "search"
  },
  {
    path: "/password-update",
    element: (
      <ProtectedPage>
        <PasswordUpdate />
      </ProtectedPage>
    ),
    state: "password.update"
  },
  {
    path: "/favorites",
    element: (
      <ProtectedPage>
        <FavoriteList />
      </ProtectedPage>
    ),
    state: "favorites"
  },
  {
    path: "/reviews",
    element: (
      <ProtectedPage>
        <ReviewList />
      </ProtectedPage>
    ),
    state: "reviews"
  },
  {
    path: "/booking/:movieId",
    element: (
      <ProtectedPage>
        <Booking />
      </ProtectedPage>
    ),
    state: "booking"
  },
  {
    path: "/my-bookings",
    element: (
      <ProtectedPage>
        <BookingHistory />
      </ProtectedPage>
    ),
    state: "booking.history"
  },
  {
    path: "/:mediaType",
    element: <MediaList />
  },
  {
    path: "/:mediaType/:mediaId",
    element: <MediaDetail />
  },
  {
    path: routesGen.movieCompareSelect.path,
    element: <MovieCompareSelect />,
    state: routesGen.movieCompareSelect.state
  },
  {
    path: routesGen.movieComparison.path,
    element: <MovieComparisonPage />,
    state: routesGen.movieComparison.state
  }
];

export default routes;