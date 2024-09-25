// import {useEffect, useState} from 'react';
// import PropTypes from 'prop-types';
// import axios from 'axios';
//
// const SelectDropdown = ({id, apiUrl, label, defaultOption, disabled}) => {
//     const [options, setOptions] = useState([]);
//     const [loading, setLoading] = useState(true); // Hiện khi data đang load
//     const [error, setError] = useState(null);               // Hiện khi lỗi load data
//
//     //BEGIN - Get Data
//     useEffect(() => {
//         const fetchOptions = async () => {
//             try {
//                 const response = await axios.get(apiUrl);
//                 const data = response.data.map(item => ({
//                     value: item.id,
//                     label: item.name,
//                 }));
//                 setOptions([defaultOption, ...data]);
//                 setLoading(false);
//             } catch (error) {
//                 setError('Error fetching options');
//                 setLoading(false);
//             }
//         };
//
//         fetchOptions();
//     }, [apiUrl, defaultOption]);
//     // END - Get Data
//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>{error}</p>;
//
//     return (
//         <>
//             <div className="form-group">
//                 <label htmlFor={id}>{label}</label>
//                 <select className="form-control" id={id} disabled={disabled}>
//                     {options.map((option, index) => (
//                         <option key={index} value={option.value}>
//                             {option.label}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//         </>
//     );
// };
//
// //Đảm bảo kiểu mà selectdown nhận đc là đúng kiểu
// SelectDropdown.propTypes = {
//     id: PropTypes.string.isRequired,
//     apiUrl: PropTypes.string.isRequired,
//     label: PropTypes.string,
//     defaultOption: PropTypes.shape({
//         value: PropTypes.string.isRequired,
//     }).isRequired,
// };
//
// export default SelectDropdown;
