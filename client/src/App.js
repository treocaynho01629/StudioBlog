import Footer from "./components/footer/Footer";
import NavBar from "./components/navbar/NavBar";
import Home from "./pages/home/Home";
import Category from "./pages/category/Category";
import NewPost from "./pages/new-post/NewPost";
import PostDetail from "./pages/post-detail/PostDetail";
import Login from "./pages/login/Login";
import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./context/Context";
import EditPost from "./pages/edit-post/EditPost";

function App() {
  const { auth } = useContext(Context);

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/category/:cate" element={<Category/>}/>
        <Route path="/login" element={auth ? <Home/> : <Login/>}/>
        <Route path="/new-post" element={auth ? <NewPost/> : <Login />}/>
        <Route path="/edit-post/:slug" element={auth ? <EditPost/> : <Login />}/>
        <Route path="/post/:slug" element={<PostDetail/>}/>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
