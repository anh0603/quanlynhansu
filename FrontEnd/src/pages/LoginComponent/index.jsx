import React from 'react';
import {Button, Card} from "react-bootstrap";

function LoginComponent() {
    return (
        <>
            <div className="container container-fluid">
                   <Card>
                       <div className="row ">
                           <div className="col-6">
                               {/*<input onChange={} name={} value={} />*/}
                               {/*<input onChange={} name={} value={} />*/}
                               <Button>
                                   Đăng nhập
                               </Button>
                               <Button>
                                   Huỷ bỏ
                               </Button>
                           </div>
                           <div className="col-6">
                               <Button>
                                   Đăng nhập bằng Google
                               </Button>
                               <Button>
                                   Đăng nhập bằng Facebook
                               </Button>
                               <Button>
                                   Đăng nhập bằng Github
                               </Button>
                           </div>
                       </div>
                   </Card>
            </div>
        </>
    );
}

export default LoginComponent;
