"use client";

import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useAllItemsStore,
  useCurrTradeStore,
  useSocketStore,
  useUidStore,
} from "@/store";
import confetti from "canvas-confetti";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ItemsTableOffer<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [cash, setCash] = useState(0);
  const userCash = useAllItemsStore.getState().cash;
  const [columnVisibility] = useState<VisibilityState>({
    select: true,
    _id: false,
    name: true,
    description: true,
    price: true,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      columnVisibility,
    },
  });

  const createOffer = async () => {
    const itemIds: string[] = table
      .getSelectedRowModel()
      .rows.map((row:any) => row.original._id);
    const uid = useUidStore.getState().uid;
    const tradeId = useCurrTradeStore.getState().id;
    const socket = useSocketStore.getState().socket;
    if (itemIds.length == 0 && cash == 0) {
      alert("Please select items or enter cash");
      return;
    }

    if (cash > userCash) {
      alert("You do not have enough cash");
      return;
    }
    if (!socket) {
      console.log("socket not initialized");
      return;
    }
    console.log("emitting createOffer");

    socket.emit("createOffer", {
      itemIds: itemIds,
      offererId: uid,
      tradeId: tradeId,
      price: cash,
    });
    confetti();
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <h1>Offer cash (optional)</h1>
      <Input
        type="number"
        value={cash}
        onChange={(e) => setCash(parseInt(e.target.value))}
      />
      <Button onClick={createOffer}>Create Offer</Button>
    </div>
  );
}
