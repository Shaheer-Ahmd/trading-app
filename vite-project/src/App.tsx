import axios from "axios";
import { useEffect } from "react";
import {
    createBrowserRouter,
    Link,
    RouterProvider,
} from "react-router-dom";
import { io, Socket } from "socket.io-client";
import "./App.css";
import { AddItem } from "./components/AddItem";
import { AllItemsOffer } from "./components/AllItemsOffer";
import { AllOffers } from "./components/AllOffers";
import { AllTrades } from "./components/AllTrades";
import { ChangePassword } from "./components/ChangePassword";
import { Home } from "./components/Home";
import { Inventory } from "./components/Inventory";
import { Login } from "./components/Login";
import { ModeToggle } from "./components/mode-toggle";
import { Profile } from "./components/Profile";
import { Signup } from "./components/Signup";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { Item } from "./components/ui/inventory-columns";
import { NavWrapper } from "./components/ui/nav-wrapper";
import { Offer } from "./components/ui/offers-columns";
import { Trade } from "./components/ui/trades-columns";
import {
    useAllItemsStore,
    useAllTradesStore,
    useCurrTradeStore,
    useSocketStore,
    useUidStore,
    useUserTradesOffersStore,
} from "./store";



async function getAllItems() {
  // Fetch data from your API here.
  const uid = useUidStore.getState().uid;
  // if (useAllItemsStore.getState().allItems) {
  //   if(useAllItemsStore.getState().allItems.length > 0) {
  //     return null;
  //   }
  // }
  axios
    .get("https://trading-app-a69n.onrender.com/" + "getAllItems", {
      params: {
        userId: uid,
      },
    })
    .then((response) => {
      console.log(response.data.data);
      console.log("setting cash= ", response.data.data.cash);
      useAllItemsStore
        .getState()
        .setAllItems(response.data.data.items as Item[]);
      useAllItemsStore.getState().setCash(response.data.data.cash);
    })
    .catch((error) => {
      console.log(error);
    });
  return null;
}

async function getAllTrades() {
  axios
    .get("https://trading-app-a69n.onrender.com/" + "getAllTrades")
    .then((response) => {
      console.log(response.data.data as Trade[]);
      const setAllTrades = useAllTradesStore.getState().setAllTradesTable;
      const uid = useUidStore.getState().uid;
      const setCurrTrade = useCurrTradeStore.getState().setId;
      if (!uid) {
        return;
      }
      let allTrades: Trade[] = [];

      response.data.data.forEach((dct: any) => {
        let trade: Trade = {
          ...dct,
          price: dct.items.reduce(
            (acc: number, item: any) => acc + item.price,
            0,
          ),
          items: dct.items.map((item: any) => item.name).join(", "),
          offers: dct.offers ? dct.offers.length : 0,
          conditions: dct.conditions
            ? dct.conditions.join(", ")
            : "No conditions",
          tradingBtn:
            dct.userId === uid ? (
              <Link to="/live-trading-accept-offers">
                <Button
                  onClick={() => {
                    useCurrTradeStore.getState().setAllOffers([]);
                    setCurrTrade(
                      dct._id, // tradeId
                      dct.userId, // creatorId
                    );

                    const socket = useSocketStore.getState().socket;
                    socket.emit("live-trading", dct._id);
                  }}
                >
                  Accept Offers
                </Button>
              </Link>
            ) : (
              <Link to="/live-trading-make-offers">
                <Button
                  onClick={() => {
                    setCurrTrade(dct._id, dct.userId);
                    const socket = useSocketStore.getState().socket;
                    socket.emit("live-trading", dct._id);
                  }}
                >
                  Make Offer
                </Button>
              </Link>
            ),
        };
        allTrades.push(trade);
      });

      setAllTrades(allTrades);
    })
    .catch((error) => {
      console.log(error);
    });
  return null;
}

async function getAllOffers() {
  const uid = useUidStore.getState().uid;
  const tradeId = useCurrTradeStore.getState().id;
  const creatorId = useCurrTradeStore.getState().creatorId;
  if (uid != creatorId) {
    alert("You are not the creator of this trade");
    return null;
  }
  if (!tradeId) {
    return null;
  }
  axios
    .get("https://trading-app-a69n.onrender.com/" + "getAllOffers", {
      params: {
        tradeId,
        creatorId,
      },
    })
    .then((response) => {
      // console.log("Offers", response.data.data);
      const setAllOffers = useCurrTradeStore.getState().setAllOffers;
      let allOffers: Offer[] = [];
      if (response.data.data.length == 0) {
        return;
      }
      response.data.data.forEach((dct: any) => {
        let offer: Offer = {
          ...dct,
          items: dct.items.map((item: any) => item.name).join(", "),
          cash: dct.price,
          fullName: dct.userName,
        };
        allOffers.push(offer);
      });
      setAllOffers(allOffers);
    })
    .catch((error) => {
      console.log(error);
    });

  return null;
}

async function getUserTradesOffers() {
  const uid = useUidStore.getState().uid;
  axios
    .get("https://trading-app-a69n.onrender.com/" + "getInventory", {
      params: {
        userId: uid,
      },
    })
    .then((response) => {
      let allTrades: Trade[] = [];
      console.log(response);

      response.data.data.trades.forEach((dct: any) => {
        dct.price = dct.items.reduce(
          (acc: number, item: any) => acc + item.price,
          0,
        );
        dct.items = dct.items.map((item: any) => item.name).join(", ");
        // delete dct.userName;
        dct.offers = dct.offers.length;
        allTrades.push(dct);
      });
      let allOffers: Offer[] = [];
      response.data.data.offersGiven.forEach((dct: any) => {
        // dct.price = dct.items.reduce((acc: number, item: any) => acc + item.price, 0);
        dct.items = dct.items.map((item: any) => item.name).join(", ");
        dct.cash = dct.price;
        allOffers.push(dct);
      });
      console.log("in loader data", allTrades, allOffers);
      const setTrades = useUserTradesOffersStore.getState().setTrades;
      const setOffers = useUserTradesOffersStore.getState().setOffers;
      setTrades(allTrades);
      setOffers(allOffers);
    })
    .catch((error) => {
      console.log("error", error);
    });
  return null;
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/inventory",
    loader: getAllItems,
    element: <NavWrapper el={<Inventory />} />,
  },
  {
    path: "/all-trades",
    loader: getAllTrades,
    element: <NavWrapper el={<AllTrades />} />,
  },
  {
    path: "/live-trading-accept-offers",
    loader: getAllOffers,
    // action: actionRejectOffer,
    element: <NavWrapper el={<AllOffers />} />,
  },
  {
    path: "/live-trading-make-offers",
    loader: getAllItems,
    element: <NavWrapper el={<AllItemsOffer />} />,
  },
  {
    path: "/profile",
    loader: getUserTradesOffers,
    element: <NavWrapper el={<Profile />} />,
  },
  {
    path: "/change-password",
    element: <NavWrapper el={<ChangePassword />} />,
  },
  {
    path: "/add-item",
    element: <NavWrapper el={<AddItem />} />,
  },
  {
    path: "/home",
    element: <NavWrapper el={<Home />} />,
  },
]);

function App() {
  // const revalidator = useRevalidator();
  // const navigate = useNavigate();
  useEffect(() => {
    const socket: Socket = io("https://trading-app-a69n.onrender.com/" + "");
    const setSocket = useSocketStore.getState().setSocket;
    setSocket(socket);

    // socket.on("offerCreated", (data:any) => {
    //   console.log("offerCreated", data);
    // });
  }, []);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex justify-end">
          <ModeToggle />
        </div>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
