import { useUidStore, useUserTradesOffersStore } from "@/store";
// import { AllTrades } from "./AllTrades";
import { useNavigate } from "react-router-dom";
import { ProfileOffersTable } from "./ProfileOffersTable";
import { TradesTable } from "./TradesTable";
import { Button } from "./ui/button";
import * as profileOffers from "./ui/profile-offers-columns";
import * as profileTrades from "./ui/profile-trades-columns";

export function Profile() {
  const userName = useUidStore((state) => state.userName);
  const fullName = useUidStore((state) => state.fullName);
  const allTrades: profileTrades.Trade[] = useUserTradesOffersStore(
    (state) => state.trades,
  );
  const allOffers: profileOffers.Offer[] = useUserTradesOffersStore(
    (state) => state.offers,
  ).filter((offer) => offer.status == "PENDING");
  console.log("allTrades", allTrades);
  console.log("allOffers", allOffers);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={`https://picsum.photos/${userName?.length}/200.webP`}
            alt="Profile picture"
            className="w-16 h-16 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold">{userName}</span>
            <span className="text-sm text-muted-foreground">{fullName}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <span className="mt-2 text-2xl font-bold">Your Live Trades</span>
        <TradesTable columns={profileTrades.columns} data={allTrades} />
      </div>
      <div>
        <span className="mt-2 mb-2 text-2xl font-bold">Your Live Offers</span>
        <ProfileOffersTable columns={profileOffers.columns} data={allOffers} />
      </div>
      <div className="flex flex-row items-center justify-center space-x-4">
        <Button onClick={() => navigate("/change-password")}>
          Change Password
        </Button>
        <Button onClick={() => navigate("/inventory")}>Create Trade</Button>
        <Button
          onClick={() => {
            useUidStore.getState().setUid("");
            navigate("/");
          }}
        >
          Log out
        </Button>
      </div>
    </div>
  );
}
