import {NavLink, useMatch, useResolvedPath} from "react-router-dom";

const SideBarItemComponent = (props) => {
    const {to, name, icon, child} = props.item;
    const resolved = useResolvedPath(to);
    const isActive = useMatch({path: resolved.pathname, end: true});

    return (
        <li className="nav-item menu-open">
            {child.length > 0 ? (
                <>
                    <NavLink to={to} className={isActive ? "nav-link active" : "nav-link"}>
                        <i className={icon}></i>
                        <p>
                            {name}
                            <i className="fas fa-angle-left right"></i>
                        </p>
                    </NavLink>
                    <ul className="nav nav-treeview">
                        {child.map((item, index) => (
                            <SideBarItemComponent item={item} key={index}/>
                        ))}
                    </ul>
                </>
            ) : (
                <NavLink to={to} className={isActive ? "nav-link active" : "nav-link"}>
                    <i className={icon}></i>
                    <p>{name}</p>
                </NavLink>
            )}
        </li>
    );
};

export default SideBarItemComponent;
