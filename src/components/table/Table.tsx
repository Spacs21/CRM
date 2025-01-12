import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {clients} from "@/types/index"

const BasicTable: React.FC<{data: clients[]}> = ({data}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>First name</TableCell>
            <TableCell align="right">Last name</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Budget</TableCell>
            <TableCell align="right">Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item: clients) => (
            <TableRow
              key={item._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.fname}
              </TableCell>
              <TableCell align="right">{item.lname}</TableCell>
              <TableCell align="right">{item.phone_primary}</TableCell>
              <TableCell align="right">{item.budget}</TableCell>
              <TableCell align="right">{item.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


export default BasicTable