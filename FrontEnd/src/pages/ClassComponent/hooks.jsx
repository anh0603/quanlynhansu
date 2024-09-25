import { useQuery } from "@tanstack/react-query";
import { classApi } from "../../services/classApi";

export const useGetClassList = () => {
  const { data } = useQuery({
    queryKey: ["classList"],
    queryFn: classApi.getClassList,
  });
  return {
    data: data?.data,
  };
};

export const useGetStudentByClassId = (id) => {
  const { data } = useQuery({
    queryKey: ["studentByClassId", id],
    queryFn: () => classApi.getStudentByIdClass(id),
  });

  return {
    data: data?.data.students,
  };
};
