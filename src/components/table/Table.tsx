import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {clients} from "@/types/index"
import PushPinIcon from '@mui/icons-material/PushPin';
import { Button } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from "@/api";

const BasicTable: React.FC<{data: clients[]}> = ({data}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [id, setId] = React.useState<null | string>(null)
  const open = Boolean(anchorEl);
  const queryClient = useQueryClient();
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, _id:string) => {
    setAnchorEl(event.currentTarget);
    setId(_id)
  };
  const handleClose = () => {
    setAnchorEl(null);
    setId(null)
  };
  
  const handlePin = useMutation({
    mutationFn: ({ pin, id }: { pin: boolean; id: string }) => request.patch(`/update/customer/${id}`, { pin }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer'] });
    },
  })

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
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item: clients) => (
            <TableRow
              key={item._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {
                  item.pin && 
                  <PushPinIcon/>
                }
                {item.fname}
              </TableCell>
              <TableCell align="right">{item.lname}</TableCell>
              <TableCell align="right">{item.phone_primary}</TableCell>
              <TableCell align="right">{item.budget}</TableCell>
              <TableCell align="right">{item.address}</TableCell>
              <TableCell align="right">
                <Button sx={{color: "#333"}} onClick={(event) => handleClick(event, item._id)}>
                  <MoreHorizIcon/>
                </Button>
                {
                  item._id === id &&
                  <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={() => { handlePin.mutate({ pin: !item.pin, id: item._id }), handleClose() }}>
                    {item.pin ? "Unpin" : "Pin"}
                  </MenuItem>
                  <MenuItem onClick={handleClose}>Payment</MenuItem>
                </Menu>
                }
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


export default BasicTable