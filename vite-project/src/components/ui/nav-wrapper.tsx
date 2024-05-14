import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

import {
  useCurrTradeStore,
  useSocketStore,
  useUidStore
} from "@/store";
import { useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

export function NavWrapper({ el }: { el: JSX.Element }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!useUidStore.getState().uid) {
      alert("Please login first");
      navigate("/");
    }
    const socket = useSocketStore.getState().socket;
    if (!socket) {
      return;
    }
    // useAllItemsStore.getState().setAllItems([]);
    // useCurrTradeStore.getState().setAllOffers([]);
    // useCurrTradeStore.getState().setId(null, null);
    socket.on("offerAccepted", () => {
      if (!useCurrTradeStore.getState().id) {
        return;
      }
      // go from make offers to inventory
      // Notification.requestPermission().then((result) => {
      //   if (result === "granted") {
      //     new Notification("Trade Finished");
      //   }
      // });
      navigate("/inventory");
    });
  }, []);
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/inventory">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Inventory
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/all-trades">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                All Trades
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/profile">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Profile
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/home">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {el}
      <div className="mt-4 text-sm text-center text-gray-400">
        Made with 🫶 by{" "}
        <a href="www.github.com/Shaheer-Ahmd" className="underline">
          Shaheer Ahmad
        </a>
      </div>
    </>
  );
}
