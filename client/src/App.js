import { Route, Routes } from "react-router-dom";
import Footer from "./components/footer/Footer";
import NavBar from "./components/navbar/NavBar";
import Home from "./pages/home/Home";
import Category from "./pages/category/Category";
import NewPost from "./pages/new-post/NewPost";
import PostDetail from "./pages/post-detail/PostDetail";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import EditPost from "./pages/edit-post/EditPost";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import useAuth from "./hooks/useAuth";
import Unauthorized from "./pages/unauthorized/Unauthorized";
import Error from "./pages/error/Error";
import Prefetch from "./features/auth/Prefetch";
import Video from "./pages/video/Video";
import useTitle from "./hooks/useTitle";
import Contact from "./pages/contact/Contact";
import About from "./pages/about/About";
import Search from "./pages/search/Search";
import Posts from "./pages/posts/Posts";
import Users from "./pages/users/Users";
import NewUser from "./pages/new-user/NewUser";
import EditUser from "./pages/edit-user/EditUser";
import Images from "./pages/images/Images";
import Manage from "./pages/manage/Manage";
import Profile from "./pages/profile/Profile";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";
import CustomSnackbar from "./components/custom-snackbar/CustomSnackbar";

function App() {
  useTitle("TAM PRODUCTION");
  const { username } = useAuth();

  return (
    <>
      <CustomSnackbar {...{ variant: 'warning', message: 'Server có thể mất một lúc để khởi động!', duration: 30000 }} />
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
