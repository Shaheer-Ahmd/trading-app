import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAllItemsStore, useUidStore } from "../store";
import { ItemsTable } from "./ItemsTable";
import { columns } from "./ui/inventory-columns";

function Inventory() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!useUidStore.getState().uid) {
      alert("Please login first");
      navigate("/");
    }
  }, []);

  const data = useAllItemsStore((state) => state.allItems);
  //   const [cash, setCash] = useState(useAllItemsStore.getState().cash);
  const cash = useAllItemsStore((state) => state.cash);

  return (
    <div className="container m-auto">
      <h1 className="text-3xl font-bold text-center">Inventory</h1>
      <div className="flex flex-row">
        <Link
          to="/add-item"
          className="p-2 ml-auto text-blue-700 underline hover:italic"
        >
          Add Item
        </Link>
      </div>
      <div className="container py-10 mx-auto">
        <ItemsTable columns={columns} data={data} />
      </div>
      <h1 className="text-3xl font-bold text-center">Cash: {cash}</h1>
    </div>
  );
}

export { Inventory };
