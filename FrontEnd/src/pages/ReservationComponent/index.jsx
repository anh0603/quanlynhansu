import { useQuery } from "@tanstack/react-query";
import { reservationApi } from "../../services/reservationApi";
import PageContent from "./layouts/PageContent";
import PageHeader from "./layouts/PageHeader";
import PageLayout from "./layouts/PageLayout";
import { useState, useEffect } from "react";
import { columns } from "./constants";

const ReservationComponent = () => {
  const { data } = useQuery({
    queryKey: ["reser-list"],
    queryFn: reservationApi.getReservationList,
  });

  ////data
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data?.data) {
      const results = data.data.filter((row) =>
        row.id_hoc_vien
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredData(results);
    }
  }, [searchTerm, data]);
  ///////S

  return (
    <PageLayout>
      <PageHeader namePage={"Quản lý bảo lưu"} />
      <PageContent
        headerContent={"Danh sách bảo lưu"}
        dataTable={filteredData} // tim trong data
        columns={columns}
        //
        setSearchTerm={setSearchTerm}
        //
      />
    </PageLayout>
  );
};

export default ReservationComponent;
