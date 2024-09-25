import NotificationComponent from "../../../components/NotificationComponent";
import PagingComponent from "../../../components/PagingComponent";
import TableTemplate from "../components/TableTemplate";
import ToolsComponent from "../components/ToolsComponent";
import SearchComponent from "../components/SearchComponent";
const PageContent = ({ headerContent, dataTable, columns, setSearchTerm }) => {
  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col">
              <div className="card card-primary">
                <div className="card-body">
                  <div className="mb-3 text-lg">{headerContent}</div>
                  <ToolsComponent setSearchTerm={setSearchTerm} />
                  <div className="row">
                    <div className="col-12">
                      <TableTemplate columns={columns} dataTable={dataTable} />
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
