import {
  useCurrTradeStore,
  useSocketStore,
  useUidStore
} from "@/store";
import { useEffect } from "react";
import { useNavigate, useRevalidator } from "react-router-dom";
import { OffersTable } from "./OffersTable";
import { columns } from "./ui/offers-columns";

// function useLivePageData() {
//     let revalidator = useRevalidator();
//     setTimeout(() => {

//     }, 1000);

//     useEffect(() => {
//       if (revalidator.state === "idle") {
//         revalidator.revalidate();
//       }
//     }, [interval]);
//   }

export function AllOffers() {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  useEffect(() => {
    const socket = useSocketStore.getState().socket;
    if (!socket) {
      return;
    }
    socket.on("offerCreated", (data: any) => {
      const uid = useUidStore.getState().uid;
      const currTradeCreatorId = useCurrTradeStore.getState().creatorId;
      // console.log(data);
      console.log("revalidating", "uid", uid, currTradeCreatorId);
      if (!uid || !currTradeCreatorId) {
        return;
      }
      if (currTradeCreatorId == uid) {
        console.log("refreshing data");
        setTimeout(() => {
          revalidator.revalidate();
        }, 1000);
      }
    });

    // if (socket.listeners("offerAccepted").length > 0) {
    //     return;
    // }

    // socket.on("offerAccepted", (data:any) => {
    //   // useCurrTradeStore.getState().setAllOffers([]);
    //   // useAllTradesStore.getState().setAllTradesTable([]);
    //   // useAllItemsStore.getState().setAllItems([]);
    //   // revalidator.revalidate();
    //   // alert("Trade Finished");
    //   // console.log("alerted successfully")
    //   navigate("/inventory");
    //   // setTimeout(() => {
    //   //   }, 1000);
    //   // setTimeout(() => {
    //   // }, 1000);
    //   // toast("Trade Finished");
    // });
  }, []);
  const data = useCurrTradeStore((state) => state.allOffers);
  return <OffersTable columns={columns} data={data} />;
}
