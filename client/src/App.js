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

function App() {
  const { username } = useAuth();

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/login" element={username ? <Home/> : <Login/>}/>
        <Route path="/unauthorized" element={<Unauthorized/>}/>
        
        <Route element={<PersistLogin/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/category/:cate" element={<Category/>}/>
          <Route path="/post/:slug" element={<PostDetail/>}/>

          //EMPLOYEE
          <Route element={<RequireAuth onlyAdmin={false}/>}>
            <Route path="/new-post" element={<NewPost/>}/>
          </Route>

          //ADMIN
          <Route element={<RequireAuth onlyAdmin={true} />}>
            <Route path="/edit-post/:slug" element={<EditPost/>}/>
          </Route>
        </Route>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
