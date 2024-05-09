import {
  useAllItemsStore
} from "@/store";
import { ItemsTableOffer } from "./ItemsTableOffer";
import { columns } from "./ui/inventory-columns";

export function AllItemsOffer() {
  const data = useAllItemsStore((state) => state.allItems);
  // const navigate = useNavigate();
  // useEffect(() => {
  //     const socket:Socket = useSocketStore.getState().socket;
  //     if (!socket) {
  //         return;
  //     }
  //     if (socket.listeners("offerAccepted").length > 0) {
  //         return;
  //     }
  //     // socket.on("offerAccepted", (data:any) => {
  //     //   // alert("Trade Finished");
  //     //   console.log("offerAccepted", data)
  //     //   // toast("Trade Finished");
  //     //   console.log("new data", data.items as Item[])
  //     //   // useAllItemsStore.getState().setAllItems(data.items as Item[]);
  //     //   // useAllItemsStore.getState().setCash(data.cash);
  //     //   // useCurrTradeStore.getState().setAllOffers([]);
  //     //   // useAllTradesStore.getState().setAllTradesTable([]);
  //     //   navigate("/inventory");
  //     // });

  // },[]);
  return (
    <div className="container mx-10 py-auto">
      <h1 className="text-3xl font-bold text-center">
        Select Items to make an offer
      </h1>
      <ItemsTableOffer columns={columns} data={data} />
    </div>
  );
}
