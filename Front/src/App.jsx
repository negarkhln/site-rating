import React from "react";
import {Routes, Route} from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Watchlist from "./pages/WatchList";
import ProductAnalytics from "./pages/ProductAnalytics"; // 🟢 این همان کامپوننت آنالیتیکس شماست
import ChangePassword from "./pages/ChangePassword";
import EditComment from "./pages/EditComment";
import PhoneForgotPassword from "./pages/PhoneForgotPassword";
import PhoneResetComplete from "./pages/PhoneResetComplete";
import PhoneResetConfirm from "./pages/PhoneResetConfirm";
import PhoneResetDone from "./pages/PhoneResetDone";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (<Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/movies" element={<ProductList/>}/>
        <Route path="/movie/:id" element={<ProductDetail/>}/>
        <Route path="/watchlist" element={<Watchlist/>}/>

        {/* 🟢 روت‌های اصلاح شده برای آنالیتیکس (پشتیبانی از هر دو حالت آدرس‌دهی) */}
        <Route path="/ProductAnalytics/:id" element={<ProductAnalytics/>}/>
        <Route path="/analytics/:id" element={<ProductAnalytics/>}/>
        <Route path="/ProductAnalytics" element={<ProductAnalytics/>}/>

        <Route path="/change-password" element={<ChangePassword/>}/>
        <Route path="/edit-comment/:id" element={<EditComment/>}/>
        <Route path="/forgot-password" element={<PhoneForgotPassword/>}/>
        <Route path="/reset-complete" element={<PhoneResetComplete/>}/>
        <Route
            path="/reset-confirm/:uidb64/:token"
            element={<PhoneResetConfirm/>}
        />
        <Route path="/reset-done" element={<PhoneResetDone/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
    </Routes>);
}

export default App;