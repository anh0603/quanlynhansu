import FooterLayout from "../components/FooterLayout";
import SideBarLayout from "../components/SideBarLayout";
import HeaderLayout from "../components/HeaderLayout";

const LayoutDefault = ({children}) => {
    return <>
        <div className="wrapper">
            <HeaderLayout></HeaderLayout>
            <SideBarLayout></SideBarLayout>
            <div className="content-wrapper">
                {children}
            </div>
            <FooterLayout></FooterLayout>
            <aside className="control-sidebar control-sidebar-dark"></aside>
        </div>
    </>
}

export default LayoutDefault;