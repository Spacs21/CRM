import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { request } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Menu, MenuItem, Modal, Box } from "@mui/material";
import { clients } from "@/types/index";
import PushPinIcon from '@mui/icons-material/PushPin';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Typography from '@mui/material/Typography';

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

const Archive = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['archivedCustomers'],
    queryFn: () => request.get("/get/customers?isArchive=true&limit=209").then((res) => res.data),
  });
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
    mutationFn: ({ pin, id }: { pin: boolean; id: string }) => request.patch(`/update/customers/${id}`, { pin }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archivedCustomers'] });
    },
  });

  const handlePayment = useMutation({
    mutationFn: ({ budget, id }: { budget: number; id: string }) => request.patch(`/update/customers/${id}`, { budget }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archivedCustomers'] });
    },
  });

  const handleArchive = useMutation({
    mutationFn: ({ isArchive, id }: { isArchive: boolean; id: string }) => request.patch(`/update/customers/${id}`, { isArchive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archivedCustomers'] });
    },
  });

  const handlePaymentSubmit = (itemId: string) => {
    const paymentAmount = form.amount;
    const item = data.innerData.find((client: clients) => client._id === itemId);
    if (item) {
      const newBudget = item.budget - paymentAmount;
      handlePayment.mutate({ budget: newBudget, id: itemId });
    }
    handleModalClose();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  console.log(data);

  return (
    <>
     <Typography id="modal-modal-title" variant="h6" component="h2">
          Archive
    </Typography>
    <TableContainer component={Paper} className="mt-4">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell align="right">Last Name</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Budget</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.innerData?.map((item: clients) => (
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
                  <MenuItem onClick={() => { handleArchive.mutate({ isArchive: false, id: item._id }); handleClose(); }}>
                    Unarchive
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
    </>
  );
}


export default Archive