"use client";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import confetti from "canvas-confetti";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useCurrTradeStore, useSocketStore, useUidStore } from "@/store";
import axios from "axios";
import { useState } from "react";
import { useRevalidator } from "react-router-dom";
import { Button } from "./ui/button";
import { Offer } from "./ui/offers-columns";

export const actionRejectOffer = () => {};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function OffersTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const revalidate = useRevalidator();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    selected: true,
    _id: false,
    offererId: false,
    fullName: true,
    items: true,
    price: true,
  });
  const [rowSelection, setRowSelection] = useState({});

  let table = useReactTable({
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

  const acceptOffer = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length != 1) {
      alert("Please select one offer to accept");
      return;
    }

    const offerId = selectedRows[0].original._id;
    const offererId = selectedRows[0].original.offererId;
    const uid = useUidStore.getState().uid;
    const tradeId = useCurrTradeStore.getState().id;
    const data = {
      userId: uid,
      offerId: offerId,
      tradeId: tradeId,
      offererId: offererId,
    };
    // console.log(data)
    const socket = useSocketStore.getState().socket;
    socket.emit("acceptOffer", data);
    confetti();
  };
  const rejectOffer = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length != 1) {
      alert("Please select one offer to accept");
      return;
    }

    const offerId = selectedRows[0].original._id;
    const offererId = selectedRows[0].original.offererId;
    const uid = useUidStore.getState().uid;
    const tradeId = useCurrTradeStore.getState().id;
    const data = {
      uid: uid,
      offerId: offerId,
      tradeId: tradeId,
      offererId: offererId,
    };
    axios
      .post("https://trading-app-a69n.onrender.com/" + "rejectOffer", data)
      .then((response) => {
        confetti();
        // actionRejectOffer();
        // setTimeout(() => {
        //   revalidate.revalidate();
        // }, 1000);
        useCurrTradeStore
          .getState()
          .setAllOffers(
            useCurrTradeStore
              .getState()
              .allOffers.filter((offer: Offer) => offer._id != offerId),
          );
        // revalidate.revalidate();
      })
      .catch((error) => {
        alert("Error rejecting offer");
        console.log(error);
      });
    // revalidate.revalidate();
    // let timeout = setTimeout(() => {
    //   clearTimeout(timeout);
    // }, 1000);
    // // console.log(data)
    // const socket = useSocketStore.getState().socket;
    // socket.emit("acceptOffer", data);
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
      <div className="flex justify-center p-4 space-x-4">
        <Button onClick={acceptOffer}>Accept Offer</Button>
        <Button onClick={rejectOffer}>Reject Offer</Button>
      </div>
    </div>
  );
}
