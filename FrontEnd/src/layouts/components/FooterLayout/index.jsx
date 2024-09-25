import {footerConstant} from "../../../constants";

const FooterLayout = () => {
    return <>
        <footer className="main-footer">
            <div className="float-right d-none d-sm-block">
                <b>Version</b> {footerConstant.version}
            </div>
            <strong>{footerConstant.create_by}</strong> All rights
            reserved.
        </footer>
    </>
}

export default FooterLayout;