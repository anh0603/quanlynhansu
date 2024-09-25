
import API from '../store/Api';
import axios from './customize-axios';
const fetchAllTrainingPrograms = (page) => {
    return axios.get(`${API.TRAINNING_PROGRAM}?page=${page}&limit=5`);
};
const createProgram = (programName, courseName, fee, timeTrainning) => {
    return axios.post(`${API.TRAINNING_PROGRAM}`, { programName, courseName, fee, timeTrainning })
}
const updateProgram = (id, programName, courseName, fee, timeTrainning, status) => {
    return axios.put(`${API.TRAINNING_PROGRAM}/${id}`, { programName, courseName, fee, timeTrainning, status })
}
const deleteProgram = (id) => {
    return axios.delete(`${API.TRAINNING_PROGRAM}/${id}`)
}
const fetchSubjectsByProgramId = (page, id) => {
    return axios.get(`https://64dc81fbe64a8525a0f699a1.mockapi.io/api/v1/subjects?page=${page}&limit=5`, { id })


}
const fetchClassesByProgramId = (page, id) => {
    return axios.get(`https://66b2e5997fba54a5b7eabca6.mockapi.io/Class?page=${page}&limit=5`, { id })


}

export { fetchAllTrainingPrograms, createProgram, updateProgram, deleteProgram, fetchSubjectsByProgramId, fetchClassesByProgramId };