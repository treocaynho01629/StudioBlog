import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import useTitle from "./hooks/useTitle";
import useAuth from "./hooks/useAuth";
import Loadable from "./components/layout/Loadable";
import Footer from "./components/footer/Footer";
import NavBar from "./components/navbar/NavBar";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import Unauthorized from "./pages/unauthorized/Unauthorized";
import Error from "./pages/error/Error";
import Prefetch from "./features/auth/Prefetch";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";
import Reachable from "./components/layout/Reachable";

const Video = Loadable(lazy(() => import("./pages/video/Video")));
const Contact = Loadable(lazy(() => import("./pages/contact/Contact")));
const About = Loadable(lazy(() => import("./pages/about/About")));
const Search = Loadable(lazy(() => import("./pages/search/Search")));
const Posts = Loadable(lazy(() => import("./pages/posts/Posts")));
const Users = Loadable(lazy(() => import("./pages/users/Users")));
const NewUser = Loadable(lazy(() => import("./pages/new-user/NewUser")));
const EditUser = Loadable(lazy(() => import("./pages/edit-user/EditUser")));
const Images = Loadable(lazy(() => import("./pages/images/Images")));
const Manage = Loadable(lazy(() => import("./pages/manage/Manage")));
const Profile = Loadable(lazy(() => import("./pages/profile/Profile")));
const Home = Loadable(lazy(() => import("./pages/home/Home")));
const Category = Loadable(lazy(() => import("./pages/category/Category")));
const NewPost = Loadable(lazy(() => import("./pages/new-post/NewPost")));
const PostDetail = Loadable(lazy(() => import("./pages/post-detail/PostDetail")));
const Login = Loadable(lazy(() => import("./pages/login/Login")));
const Register = Loadable(lazy(() => import("./pages/register/Register")));
const EditPost = Loadable(lazy(() => import("./pages/edit-post/EditPost")));

function App() {
  useTitle("TAM PRODUCTION");
  const { username } = useAuth();

  return (
    <>
      <Reachable/>
      <NavBar />
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={username ? <Home /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Error />} />

        <Route element={<PersistLogin />}>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<Video />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/category/:cate" element={<Category />} />
          <Route path="/search" element={<Search />} />
          <Route path="/post/:slug" element={<PostDetail />} />

          #EMPLOYEE
          <Route element={<RequireAuth onlyAdmin={false} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/posts-list" element={<Posts />} />
            <Route path="/new-post" element={<NewPost />} />
            <Route path="/edit-post/:slug" element={<EditPost />} />
          </Route>

          #ADMIN
          <Route element={<Prefetch />}>
            <Route element={<RequireAuth onlyAdmin={true} />}>
              <Route path="/users-list" element={<Users />} />
              <Route path="/new-user" element={<NewUser />} />
              <Route path="/edit-user/:id" element={<EditUser />} />
              <Route path="/images-list" element={<Images />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
