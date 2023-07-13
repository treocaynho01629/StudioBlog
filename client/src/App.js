import Footer from "./components/footer/Footer";
import NavBar from "./components/navbar/NavBar";
import Home from "./pages/home/Home";
import NewPost from "./pages/new-post/NewPost";
import Post from "./pages/post/Post";
import Login from "./pages/login/Login";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={false ? <Home/> : <Login/>}/>
        <Route path="/new-post" element={true ? <NewPost/> : <Login />}/>
        <Route path="/post/:id" element={<Post/>}/>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
