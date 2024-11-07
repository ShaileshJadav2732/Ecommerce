import { Column } from "react-table";
import TableHoc from "../components/admin/TableHOC";
import { ReactElement } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
type dataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<dataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];
const Orders = () => {
const [rows,setRows]=useState<dataType[]>([{
    _id:"1",
    amount:100,
    quantity:1,
    discount: 0,
    status: <div className="red">Pending</div>,
    action: <Link to={`/order-details}`}>View</Link>
}]);

  const table = TableHoc<dataType>(column, rows, "dashboard-product-box", "Orders", rows.length > 6)();

  return (
    <div className="container">
      <h1>My Orders</h1>
      {table}
    </div>
  );
};

export default Orders;
