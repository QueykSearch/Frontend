import React from "react";
import UserList from "../../components/User/UserList";
import UserForm from "../../components/User/UserForm";
import { Routes, Route } from "react-router-dom";

const UserPage: React.FC = () => {
  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/create" element={<UserForm />} />
        <Route path="/edit/:userId" element={<UserForm />} />
      </Routes>
    </div>
  );
};

export default UserPage;
