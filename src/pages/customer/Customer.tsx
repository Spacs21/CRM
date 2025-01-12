import CreateCS from "@/components/create-cs/CreateCS";
import Table from "@/components/table/Table";
import { Box, Button, CircularProgress, Pagination, Typography } from "@mui/material";
import { useState } from "react";
import { request } from "@/api";
import { useQuery } from "@tanstack/react-query";

const Customer = () => {
  const [open, setOpen] = useState<null | string>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const skip = (page - 1) * itemsPerPage;

  const { data, error, isLoading } = useQuery({
    queryKey: ['customers', page],
    queryFn: () => request.get("/get/customers", {
      params: {
        skip: skip,
        limit: itemsPerPage
      }
    }).then((res) => res.data),
  });

  if (isLoading) return <div>
    <Box sx={{ display: 'flex', justifyContent: "center", height: "80vh", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  </div>;
  if (error) return <div>Error loading data</div>;

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  

  return (
    <div>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: "20px" }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Customer
        </Typography>
        <Button onClick={() => setOpen("customer")}>Create</Button>
      </Box>
      <Table data={data?.innerData} />
      <div className="flex justify-center mt-12">
        <Pagination count={Math.ceil(data?.totalCount / itemsPerPage)} page={page} onChange={handlePageChange} color="primary" />
      </div>
      <CreateCS open={open} close={() => setOpen(null)} />
    </div>
  );
};

export default Customer;