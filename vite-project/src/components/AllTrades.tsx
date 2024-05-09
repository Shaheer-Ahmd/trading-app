import { useAllTradesStore } from "@/store";
import { TradesTable } from "./TradesTable";
import { Trade, columns } from "./ui/trades-columns";
export function AllTrades() {
  let data: Trade[] = useAllTradesStore((state) => state.allTradesTable);
  // let newData = data.map((trade) => {
  //     return {
  //         ...trade,
  //         items: trade.items.map((item) => item.name).join(", ")
  //     }
  // })
  return (
    <>
      <h1 className="text-3xl font-bold text-center">All Trades</h1>
      <TradesTable columns={columns} data={data} />
    </>
  );
}
