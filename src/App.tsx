import { onAuthStateChanged } from "firebase/auth";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/header";
import Loader from "./components/loader";
import ProtectedRoute from "./components/protected-routes";
import { auth } from "./firebase";
import OrderDetails from "./pages/order-details";
import { getUser } from "./redux/api/userApi";
import { isUserExist, isUserNotExist } from "./redux/reducers/userReducer";
import "./styles/app.scss";
import { RootState } from "./redux/store";
const Home = lazy(() => import("../src/pages/home"));
const Search = lazy(() => import("./pages/search"));
const Cart = lazy(() => import("./pages/cart"));
const Shipping = lazy(() => import("./pages/shipping"));
const Login = lazy(() => import("./pages/login"));
const Orders = lazy(() => import("./pages/orders"));
const NotFound = lazy(() => import("./pages/not-found"));
const CheckOut = lazy(() => import("./pages/checkout"));

// admin page imports

const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

// admin page imports ends

const App = () => {
  const { user,isLoading } = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);
        dispatch(isUserExist(data?.user)); 
      } else dispatch(isUserNotExist());
    });
  }, []);
  
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Router>
        {/* header,footer etc.., */}
        <Header user={user} />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />
            {/* Not Logged in Routes */}
            <Route path="/login" element={<ProtectedRoute isAuthenticated={user ? false : true}><Login/></ProtectedRoute>}></Route>
            {/* logged in routes */}
            <Route element ={ <ProtectedRoute isAuthenticated ={user? true : false} ></ProtectedRoute>}>
              <Route path="/shipping" element={<Shipping/>}></Route>
              <Route path="/pay" element={<CheckOut/>}></Route>
              <Route path="/orders" element={<Orders/>}></Route>
              <Route path="/orders/:id" element = {<OrderDetails /> } />
            </Route>
            // Admin Rotues
            <Route
            element={
              <ProtectedRoute isAuthenticated={true} adminOnly={true} admin={user?.role ==="admin"?true:false} />
            }
            >
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/product" element={<Products />} />
              <Route path="/admin/customer" element={<Customers />} />
              <Route path="/admin/transaction" element={<Transaction />} />
              {/* Charts */}
              <Route path="/admin/chart/bar" element={<Barcharts />} />
              <Route path="/admin/chart/pie" element={<Piecharts />} />
              <Route path="/admin/chart/line" element={<Linecharts />} />
              {/* Apps */}
              <Route path="/admin/app/coupon" element={<Coupon />} />
              <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
              <Route path="/admin/app/toss" element={<Toss />} />

              {/* Management */}
              <Route path="/admin/product/new" element={<NewProduct />} />

              <Route
                path="/admin/product/:id"
                element={<ProductManagement />}
              />

              <Route
                path="/admin/transaction/:id"
                element={<TransactionManagement />}
              />
            </Route>
             <Route path="*" element={<NotFound/>} />
          </Routes>
        </Suspense>
        <Toaster position={"bottom-center"} />
      </Router>
    </>
  );
};

export default App;
