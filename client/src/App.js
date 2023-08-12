import Footer from "./components/footer/Footer";
import NavBar from "./components/navbar/NavBar";
import Home from "./pages/home/Home";
import Category from "./pages/category/Category";
import NewPost from "./pages/new-post/NewPost";
import PostDetail from "./pages/post-detail/PostDetail";
import Login from "./pages/login/Login";
import EditPost from "./pages/edit-post/EditPost";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Unauthorized from "./pages/unauthorized/Unauthorized";
import Prefetch from "./features/auth/Prefetch";
import Video from "./pages/video/Video";
import useTitle from "./hooks/useTitle";
import Contact from "./pages/contact/Contact";  
import About from "./pages/about/About";
import Search from "./pages/search/Search";
import Users from "./pages/users/Users";
import NewUser from "./pages/new-user/NewUser";
import EditUser from "./pages/edit-user/EditUser";

function App() {
  useTitle("TAM PRODUCTION");
  const { username } = useAuth();

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/login" element={username ? <Home/> : <Login/>}/>
        <Route path="/unauthorized" element={<Unauthorized/>}/>
        
        <Route element={<PersistLogin/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/videos" element={<Video/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/category/:cate" element={<Category/>}/>
            <Route path="/search" element={<Search/>}/>
            <Route path="/post/:slug" element={<PostDetail/>}/>

            //EMPLOYEE
            <Route element={<RequireAuth onlyAdmin={false}/>}>
              <Route path="/new-post" element={<NewPost/>}/>
              <Route path="/edit-post/:slug" element={<EditPost/>}/>
            </Route>

            //ADMIN
            <Route element={<RequireAuth onlyAdmin={true} />}>
              <Route path="/users-list" element={<Users/>}/>
              <Route path="/new-user" element={<NewUser/>}/>
              <Route path="/edit-user/:id" element={<EditUser/>}/>
            </Route>
            
          
          //PREFETCH PROTECTED
          <Route element={<Prefetch/>}>
            //Add later (commentlist, imagesList)
          </Route>
        </Route>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
