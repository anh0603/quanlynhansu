import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

function PagingComponent({totalPage, currentPage, onPageChange}) {
    return (
        <Pagination>
            <Pagination.First
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            />
            <Pagination.Prev
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            />

            {[...Array(totalPage).keys()].map((number) => {
                const pageNumber = number + 1;
                return (
                    <Pagination.Item
                        key={pageNumber}
                        active={pageNumber === currentPage}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </Pagination.Item>
                );
            })}

            <Pagination.Next
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPage}
            />
            <Pagination.Last
                onClick={() => onPageChange(totalPage)}
                disabled={currentPage === totalPage}
            />
        </Pagination>
    );
}

export default PagingComponent;
