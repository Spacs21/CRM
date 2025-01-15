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
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
};
interface Payment {
  amount: number
}
const initalState: Payment = {
  amount: 0
}

const BasicTable: React.FC<{data: clients[], type: string}> = ({data, type}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [id, setId] = React.useState<null | string>(null)
  const [modalItemId, setModalItemId] = React.useState<null | string>(null);
  const open = Boolean(anchorEl);
  const queryClient = useQueryClient();
  const [isOpen, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<Payment>(initalState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: parseFloat(value) }));
  };

  const handleOpen = (itemId: string) => {
    setModalItemId(itemId);
    setOpen(true);
  };

  const handleModalClose = () => {
    setModalItemId(null);
    setOpen(false);
    setForm(initalState);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, _id: string) => {
    setAnchorEl(event.currentTarget);
    setId(_id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setId(null);
  };

  const handlePin = useMutation({
    mutationFn: ({ pin, id }: { pin: boolean; id: string }) => request.patch(`/update/${type}/${id}`, { pin }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${type}`] });
    },
  });

  const handlePayment = useMutation({
    mutationFn: ({ budget, id }: { budget: number; id: string }) => request.patch(`/update/${type}/${id}`, { budget }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${type}`] });
    },
  });

  const handlePaymentSubmit = (itemId: string) => {
    const paymentAmount = form.amount;
    const item = data.find((client) => client._id === itemId);
    if (item) {
      const newBudget = item.budget - paymentAmount;
      handlePayment.mutate({ budget: newBudget, id: itemId });
    }
    handleModalClose();
  };

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
                  <PushPinIcon sx={{ fontSize: "medium" }} />
                }
                {item.fname}
                {/* {
                  item.isActive &&
                  <CheckCircleIcon/>
                } */}
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
                  <MenuItem onClick={() => { handlePin.mutate({ pin: !item.pin, id: item._id }); handleClose(); }}>
                    {item.pin ? "Unpin" : "Pin"}
                  </MenuItem>
                  <MenuItem onClick={handleClose}><span onClick={() => handleOpen(item._id)}>Payment</span></MenuItem>
                </Menu>
                }
                {
                  modalItemId === item._id &&
                  <Modal
                  open={isOpen}
                  onClose={handleModalClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      Payment
                    </Typography>
                    <form onSubmit={(e) => { e.preventDefault(); handlePaymentSubmit(item._id); }}>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md mt-4"
                        name="amount"
                        onChange={handleChange}
                        value={form.amount}
                      />
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4"
                      >
                        Pay
                      </button>
                    </form>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Your payment is secure
                    </Typography>
                  </Box>
                </Modal>
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