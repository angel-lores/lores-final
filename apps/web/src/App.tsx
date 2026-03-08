import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./routes/Dashboard";
import Items from "./routes/Items";
import ItemForm from "./routes/ItemForm";
import Summary from "./routes/Summary";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/new" element={<ItemForm mode="create" />} />
        <Route path="/items/:id/edit" element={<ItemForm mode="edit" />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}