import NotificationComponent from "../../../components/NotificationComponent";
import PagingComponent from "../../../components/PagingComponent";
import TableHasAction from "../components/TableHasAction";
import ToolsComponent from "../components/ToolsComponent";

const PageContent = ({ headerContent }) => {
  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col">
              <div className="card card-primary">
                <div className="card-body">
                  <div className="mb-3 text-lg">{headerContent}</div>
                  <ToolsComponent />
                  <div className="row">
                    <div className="col-12">
                      <TableHasAction />
                    </div>
                  </div>

                  <div className="row justify-content-center mt-3">
                    <div className="col-auto">
                      <PagingComponent />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <NotificationComponent />
    </>
  );
};

export default PageContent;
