import axios from "axios";
export const addDecision = (option)=> {
    return  axios.post('/data/decision.json');
}