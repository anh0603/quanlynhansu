import {NavLink, useMatch, useResolvedPath} from "react-router-dom";
import {useState} from "react";

const SideBarItemComponent = (props) => {
    const {to, name, icon, child = []} = props.item;
    const resolved = useResolvedPath(to);
    const isActive = useMatch({path: resolved.pathname, end: true});

    // State để quản lý menu con
    const [isOpen, setIsOpen] = useState(false);

    // Hàm để toggle trạng thái mở/đóng của menu con
    const handleToggle = (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của NavLink
        setIsOpen(prevState => !prevState); // Đổi trạng thái mở/đóng
    };

    return (
        <li className="nav-item">
            {child.length > 0 ? (
                <>
                    <a
                        to={to}
                        className={`nav-link ${isActive ? "active" : ""}`}
                        onClick={handleToggle} // Toggle khi nhấp vào
                    >
                        <i className={icon}></i>
                        <p>
                            {name}
                            <i className={`fas ${isOpen ? "fa-angle-down" : "fa-angle-left"} right`}></i>
                        </p>
                    </a>
                    {isOpen && (
                        <ul className="nav nav-treeview">
                            {child.map((item, index) => (
                                <SideBarItemComponent item={item} key={index}/>
                            ))}
                        </ul>
                    )}
                </>
            ) : (
                <NavLink
                    to={to}
                    className={`nav-link ${isActive ? "active" : ""}`}
                >
                    <i className={icon}></i>
                    <p>{name}</p>
                </NavLink>
            )}
        </li>
    );
};

export default SideBarItemComponent;
