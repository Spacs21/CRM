import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Items} from "@/types/index"
import { request } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "@mui/material";


const Products = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => request.get("/get/products").then((res) => res.data),
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  console.log(data);
  
  return (
    <>
     <Typography id="modal-modal-title" variant="h6" component="h2">
          Customer
    </Typography>
    <TableContainer component={Paper} className="mt-4">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">inStock</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.innerData?.map((item: Items) => (
            <TableRow
              key={item._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.title}
              </TableCell>
              <TableCell align="right">{item.category}</TableCell>
              <TableCell align="right">{item.isActive ? "Yes" : "No"}</TableCell>
              <TableCell align="right">{item.price}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}


export default Products